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

  var Rect = function (left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  };

  var Size = function (width, height) {
    this.width = width;
    this.height = height;
  };

  var Location = function (x, y) {
    this.x = x;
    this.y = y;
  };

  var PinLocation = function (x, y) {
    this._constraints = new Rect(0, MainPinConstraints.MIN_Y, window.pin.mapPinsEl.offsetWidth, MainPinConstraints.MAX_Y);
    this._pinSize = new Size(MainPinSize.WIDTH, MainPinSize.ACTIVE_STATE_HEIGHT);
    this.setX(x);
    this.setY(y);
  };

  PinLocation.prototype.setX = function (x) {
    this.x = x;
    if (x + this._pinSize.width > this._constraints.right) {
      this.x = this._constraints.right - this._pinSize.width / 2;
    } else if (x + this._pinSize.width / 2 < this._constraints.left) {
      this.x = this._constraints.left - this._pinSize.width / 2;
    }
  };

  PinLocation.prototype.setY = function (y) {
    this.y = y;
    if (y + this._pinSize.height > this._constraints.bottom) {
      this.y = this._constraints.bottom - this._pinSize.height;
    } else if (y + this._pinSize.height < this._constraints.top) {
      this.y = this._constraints.top - this._pinSize.height;
    }
  };

  var getMainPinLocation = function () {
    var pinHeight = activeState ? MainPinSize.ACTIVE_STATE_HEIGHT : MainPinSize.INACTIVE_STATE_HEIGHT;
    return new Location(mainPinEl.offsetLeft + MainPinSize.WIDTH / 2, mainPinEl.offsetTop + pinHeight);
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
    mainPinEl.style.left = MainPinStartLocation.LEFT + 'px';
    mainPinEl.style.top = MainPinStartLocation.TOP + 'px';
    window.card.closePopup();
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
    var startLocation = new Location(evt.clientX, evt.clientY);
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = new Location(startLocation.x - moveEvt.clientX, startLocation.y - moveEvt.clientY);
      var newLocation = new PinLocation(mainPinEl.offsetLeft - shift.x, mainPinEl.offsetTop - shift.y);
      startLocation = new Location(moveEvt.clientX, moveEvt.clientY);
      mainPinEl.style.left = newLocation.x + 'px';
      mainPinEl.style.top = newLocation.y + 'px';
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
