'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var MAX_PIN_Y = 500;
var MIN_PIN_Y = 150;
var MAIN_PIN_ACTIVE_HEIGHT = 84;
var MAIN_PIN_INACTIVE_HEIGHT = 200;
var MAIN_PIN_WIDTH = 62;
var AD_QUANTITY = 8;

var activeState = false;
var mapElement = document.querySelector('.map');
var mapPinsElement = document.querySelector('.map__pins');
var mainPin = document.querySelector('.map__pin--main');
var mapFilterContainer = document.querySelector('.map__filters-container');

var adItems = [];

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    document.removeEventListener('keydown', onPopupEscPress);
    document.querySelector('.map__card').remove();
  }
};
var openPopup = function (ad) {
  var card = window.card.renderCard(ad);
  mapElement.insertBefore(card, mapFilterContainer);
  var popupCloser = card.querySelector('.popup__close');
  popupCloser.addEventListener('click', function () {
    closePopup(card);
  });
  popupCloser.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup(card);
    }
  });
  document.addEventListener('keydown', onPopupEscPress);
};
var closePopup = function (card) {
  card.remove();
  document.removeEventListener('keydown', onPopupEscPress);
};
var addPinClickListener = function (pin, ad) {
  pin.addEventListener('click', function () {
    openPopup(ad);
  });
};
var addPinKeyDownListener = function (pin, ad) {
  pin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openPopup(ad);
    }
  });
};
var renderMapPinList = function (ads) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    var pin = window.pin.renderPin(ads[i]);
    addPinClickListener(pin, ads[i]);
    addPinKeyDownListener(pin, ads[i]);
    fragment.appendChild(pin);
  }
  mapPinsElement.appendChild(fragment);
};

var getMainPinLocation = function () {
  var result = {};
  var pinHeight = activeState ? MAIN_PIN_ACTIVE_HEIGHT : MAIN_PIN_INACTIVE_HEIGHT;
  result.x = mainPin.offsetLeft + MAIN_PIN_WIDTH / 2;
  result.y = mainPin.offsetTop + pinHeight;
  return result;
};

var setInactiveState = function () {
  mapElement.classList.add('map--faded');
  window.form.disableForm();
  window.form.setAddressValue(getMainPinLocation());
};
var setActiveState = function () {
  if (activeState) {
    return;
  }
  mapElement.classList.remove('map--faded');
  window.form.enableForm();
  adItems = window.data.generateAdds(AD_QUANTITY);
  renderMapPinList(adItems);
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
    if (newX + MAIN_PIN_WIDTH > mapPinsElement.offsetWidth) {
      newX = mapPinsElement.offsetWidth - MAIN_PIN_WIDTH / 2;
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

setInactiveState();
