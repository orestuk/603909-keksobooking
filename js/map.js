'use strict';
window.map = (function () {
  var MAX_PIN_Y = 500;
  var MIN_PIN_Y = 150;
  var MAIN_PIN_ACTIVE_HEIGHT = 84;
  var MAIN_PIN_INACTIVE_HEIGHT = 200;
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_LEFT = 570;
  var MAIN_PIN_TOP = 375;

  var activeState = false;
  var mapEl = document.querySelector('.map');
  var mainPinEl = document.querySelector('.map__pin--main');

  var getMainPinLocation = function () {
    var result = {};
    var pinHeight = activeState ? MAIN_PIN_ACTIVE_HEIGHT : MAIN_PIN_INACTIVE_HEIGHT;
    result.x = mainPinEl.offsetLeft + MAIN_PIN_WIDTH / 2;
    result.y = mainPinEl.offsetTop + pinHeight;
    return result;
  };
  var successfulHandler = function (data) {
    window.filter.setFilter(data);
  };
  var errorHandler = function (erMessage) {
    window.error.renderError(erMessage);
  };
  var setActiveState = function () {
    if (activeState) {
      return;
    }
    window.backend.load(successfulHandler, errorHandler);
    mapEl.classList.remove('map--faded');
    window.form.enableForm();
    activeState = true;
  };
  var setInactiveState = function () {
    mapEl.classList.add('map--faded');
    mainPinEl.style.left = MAIN_PIN_LEFT + 'px';
    mainPinEl.style.top = MAIN_PIN_TOP + 'px';
    window.card.closePopup(window.card.getOpenedCard());
    window.pin.removeAllPins();
    window.form.disableForm();
    window.form.resetForm();
    window.avatar.resetAvatar();
    window.photo.resetPhotos();
    window.form.setAddressValue(getMainPinLocation());
    window.filter.resetFilter();
    activeState = false;
  };
  mainPinEl.addEventListener('mouseup', function () {
    if (!activeState) {
      setActiveState();
    }
    window.form.setAddressValue(getMainPinLocation());
  });

  mainPinEl.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startPosition = {
      x: evt.clientX,
      y: evt.clientY
    };
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startPosition.x - moveEvt.clientX,
        y: startPosition.y - moveEvt.clientY
      };
      var newX = mainPinEl.offsetLeft - shift.x;
      var newY = mainPinEl.offsetTop - shift.y;
      startPosition = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      // Correct new Y position according to the area region
      if (newY + MAIN_PIN_ACTIVE_HEIGHT > MAX_PIN_Y) {
        newY = MAX_PIN_Y - MAIN_PIN_ACTIVE_HEIGHT;
      } else if (newY + MAIN_PIN_ACTIVE_HEIGHT < MIN_PIN_Y) {
        newY = MIN_PIN_Y - MAIN_PIN_ACTIVE_HEIGHT;
      }
      // Correct Calculate new X position according to the area region
      if (newX + MAIN_PIN_WIDTH > window.pin.mapPinsEl.offsetWidth) {
        newX = window.pin.mapPinsEl.offsetWidth - MAIN_PIN_WIDTH / 2;
      } else if (newX + MAIN_PIN_WIDTH / 2 < 0) {
        newX = 0 - MAIN_PIN_WIDTH / 2;
      }
      mainPinEl.style.left = newX + 'px';
      mainPinEl.style.top = newY + 'px';
      window.form.setAddressValue(getMainPinLocation());
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  window.form.onSubmitForm = function () {
    setInactiveState();
  };
  window.form.onResetForm = function () {
    setInactiveState();
  };
  setInactiveState();
})();
