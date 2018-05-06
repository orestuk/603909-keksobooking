'use strict';
var MAX_PIN_Y = 500;
var MIN_PIN_Y = 150;
var MAIN_PIN_ACTIVE_HEIGHT = 84;
var MAIN_PIN_INACTIVE_HEIGHT = 200;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_LEFT = 570;
var MAIN_PIN_TOP = 375;
// var AD_QUANTITY = 8;

var activeState = false;
var mapElement = document.querySelector('.map');
var mainPin = document.querySelector('.map__pin--main');

var getMainPinLocation = function () {
  var result = {};
  var pinHeight = activeState ? MAIN_PIN_ACTIVE_HEIGHT : MAIN_PIN_INACTIVE_HEIGHT;
  result.x = mainPin.offsetLeft + MAIN_PIN_WIDTH / 2;
  result.y = mainPin.offsetTop + pinHeight;
  return result;
};

var submitHandler = function () {
  setInactiveState();
  var successElement = document.querySelector('.success');
  successElement.classList.remove('hidden');
  setTimeout(function () {
    successElement.classList.add('hidden');
  }, 2000);
};

var setInactiveState = function () {
  mapElement.classList.add('map--faded');
  mainPin.style.left = MAIN_PIN_LEFT + 'px';
  mainPin.style.top = MAIN_PIN_TOP + 'px';
  window.card.closePopup(window.card.getOpenedCard());
  window.pin.removeAllPins();
  window.form.disableForm();
  window.form.formElement.reset();
  window.form.setAddressValue(getMainPinLocation());
  activeState = false;
};
var setActiveState = function () {
  if (activeState) {
    return;
  }
  mapElement.classList.remove('map--faded');
  window.form.enableForm();
  window.filter.updatePins();
  activeState = true;
};

mainPin.addEventListener('mouseup', function () {
  if (!activeState) {
    setActiveState();
  }
  window.form.setAddressValue(getMainPinLocation());
});

mainPin.addEventListener('mousedown', function (evt) {
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
    var newX = mainPin.offsetLeft - shift.x;
    var newY = mainPin.offsetTop - shift.y;
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
    if (newX + MAIN_PIN_WIDTH > window.pin.mapPinsElement.offsetWidth) {
      newX = window.pin.mapPinsElement.offsetWidth - MAIN_PIN_WIDTH / 2;
    } else if (newX + MAIN_PIN_WIDTH / 2 < 0) {
      newX = 0 - MAIN_PIN_WIDTH / 2;
    }
    mainPin.style.left = newX + 'px';
    mainPin.style.top = newY + 'px';
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

window.form.formElement.addEventListener('submit', function (evt) {
  window.backend.save(new FormData(window.form.formElement), submitHandler, window.error.renderError);
  evt.preventDefault();
});

setInactiveState();
