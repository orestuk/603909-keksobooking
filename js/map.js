'use strict';
window.map = (function () {
  var MainPinConstraints = {
    MIN_Y: 150,
    MAX_Y: 500
  };
  var MainPinSize = {
    ACTIVE_STATE_HEIGHT: 84,
    INACTIVE_STATE_HEIGHT: 200,
    WIDTH: 62
  };
  var MainPinStartLocation = {
    LEFT: 570,
    TOP: 375
  };
  var activeState = false;
  var mapEl = document.querySelector('.map');
  var mainPinEl = document.querySelector('.map__pin--main');

  var Rect = window.coordinates.Rect;
  var Size = window.coordinates.Size;
  var PinLocation = window.coordinates.PinLocation;
  var Location = window.coordinates.Location;
  var pinConstraints = new Rect(0, MainPinConstraints.MIN_Y, window.pin.mapPinsEl.offsetWidth, MainPinConstraints.MAX_Y);
  var pinSize = new Size(MainPinSize.WIDTH, MainPinSize.ACTIVE_STATE_HEIGHT);
  var mainPinLocation = new PinLocation(pinConstraints, pinSize);

  var getMainPinLocation = function () {
    var pinHeight = activeState ? MainPinSize.ACTIVE_STATE_HEIGHT : MainPinSize.INACTIVE_STATE_HEIGHT;
    return new Location(mainPinEl.offsetLeft + MainPinSize.WIDTH / 2, mainPinEl.offsetTop + pinHeight);
  };
  var setMainPinAddress = function () {
    window.form.setAddressValue(getMainPinLocation());
  };
  var successfulHandler = function (data) {
    window.filter.setFilter(data);
  };
  var errorHandler = function (erMessage) {
    window.error.renderError(erMessage);
  };
  var enableMap = function () {
    mapEl.classList.remove('map--faded');
  };
  var disableMap = function () {
    mapEl.classList.add('map--faded');
  };
  var setActiveState = function () {
    if (activeState) {
      return;
    }
    window.backend.load(successfulHandler, errorHandler);
    enableMap();
    window.form.enableForm();
    activeState = true;
  };
  var setInactiveState = function () {
    window.form.resetForm();
    disableMap();
    mainPinEl.style.left = MainPinStartLocation.LEFT + 'px';
    mainPinEl.style.top = MainPinStartLocation.TOP + 'px';
    window.card.closePopup();
    window.pin.removeAllPins();
    window.form.disableForm();
    window.avatar.resetAvatar();
    window.photo.resetPhotos();
    setMainPinAddress();
    window.filter.resetFilter();
    activeState = false;
  };
  mainPinEl.addEventListener('mouseup', function () {
    if (!activeState) {
      setActiveState();
    }
    setMainPinAddress();
  });

  mainPinEl.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startLocation = new Location(evt.clientX, evt.clientY);
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = new Location(startLocation.x - moveEvt.clientX, startLocation.y - moveEvt.clientY);
      startLocation = new Location(moveEvt.clientX, moveEvt.clientY);
      mainPinLocation.setX(mainPinEl.offsetLeft - shift.x);
      mainPinLocation.setY(mainPinEl.offsetTop - shift.y);
      mainPinEl.style.left = mainPinLocation.x + 'px';
      mainPinEl.style.top = mainPinLocation.y + 'px';
      setMainPinAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  window.form.onResetForm = function () {
    setInactiveState();
  };
  window.form.onSubmitForm = function () {
    setInactiveState();
  };
  setInactiveState();
})();
