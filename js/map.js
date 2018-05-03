'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
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
  if (card !== null) {
    card.remove();
  }
  document.removeEventListener('keydown', onPopupEscPress);
};
var addPinClickListener = function (pin, ad) {
  pin.addEventListener('click', function () {
    openPopup(ad);
  });
};
// Created separate function for right passing ad value
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
  closePopup(window.card.getOpenedCard());
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
  // adItems = window.data.generateAdds(AD_QUANTITY);
  window.backend.load(renderMapPinList, window.error.renderError);
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

window.form.formElement.addEventListener('submit', function (evt) {
  window.backend.save(new FormData(window.form.formElement), submitHandler, window.error.renderError);
  evt.preventDefault();
});

setInactiveState();
