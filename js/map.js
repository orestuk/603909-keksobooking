'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var MAX_PIN_Y = 500;
var MIN_PIN_Y = 150;
var MAIN_PIN_ACTIVE_HEIGHT = 84;
var MAIN_PIN_INACTIVE_HEIGHT = 200;
var MAIN_PIN_WIDTH = 62;
var AD_QUANTITY = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MAX_ROOMS = 5;
var MIN_ROOMS = 1;
var MAX_GUESTS = 15;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var TYPE_DICTIONARY = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};
var MIN_PRICE_DICTIONARY = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};
var CAPACITY_ROOMS_DICTIONARY = {
  100: [0],
  1: [1],
  2: [1, 2],
  3: [1, 2, 3]
};
var CAPACITY_OPTIONS = {
  3: 'для 3 гостей',
  2: 'для 2 гостей',
  1: 'для 1 гостя',
  0: 'не для гостей'
};

var activeState = false;
var mapElement = document.querySelector('.map');
var mapPinsElement = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var photoTemplate = document.querySelector('template').content.querySelector('.popup__photo');
var mainPin = document.querySelector('.map__pin--main');
var mapFilterContainer = document.querySelector('.map__filters-container');

// Form elements
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = document.querySelectorAll('.ad-form fieldset');
var adAddress = document.querySelector('input[name=address]');
var adType = document.querySelector('select[name=type]');
var adPrice = document.querySelector('input[name=price]');
var adTimein = document.querySelector('select[name=timein]');
var adTimeout = document.querySelector('select[name=timeout]');
var adRooms = document.querySelector('select[name=rooms]');
var adCapacity = document.querySelector('select[name=capacity]');
var adItems = [];

var getRandomIndex = function (array) {
  return Math.floor(Math.random() * array.length);
};

var getRandomNumberByRange = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

var generateRandomArray = function (array) {
  var wordNumber = getRandomNumberByRange(1, array.length);
  var result = [];
  for (var i = 0; i < wordNumber; i++) {
    result.push(array[getRandomIndex(array)]);
  }
  return result;
};

var shuffleArray = function (array) {
  var result = [];
  while (array.length > 0) {
    result.push(array.splice(getRandomIndex(array), 1)[0]);
  }
  return result;
};

var getRandomItem = function (array) {
  return array[getRandomIndex(array)];
};

var generateAvatarNumbers = function (quantity) {
  var result = [];
  for (var i = 1; i <= quantity; i++) {
    result.push(i);
  }
  return result;
};

var generateOneAd = function (avatarNum, title) {
  var x = getRandomNumberByRange(300, 900);
  var y = getRandomNumberByRange(150, 500);
  return {
    author: {
      avatar: 'img/avatars/user0' + avatarNum + '.png'
    },
    offer: {
      title: title,
      address: x + ', ' + y,
      price: getRandomNumberByRange(MIN_PRICE, MAX_PRICE),
      type: getRandomItem(TYPES),
      rooms: getRandomNumberByRange(MIN_ROOMS, MAX_ROOMS),
      guests: getRandomNumberByRange(1, MAX_GUESTS),
      checking: getRandomItem(CHECKINS),
      checkout: getRandomItem(CHECKOUTS),
      features: generateRandomArray(FEATURES),
      description: '',
      photos: shuffleArray(PHOTOS.slice())
    },
    location: {
      x: x,
      y: y
    }
  };
};

var generateAdds = function (quantity) {
  var avatarNumbersSequence = shuffleArray(generateAvatarNumbers(quantity).slice());
  var titlesSequence = shuffleArray(TITLES.slice());
  var result = [];
  for (var i = 0; i < quantity; i++) {
    result[i] = generateOneAd(avatarNumbersSequence[i], titlesSequence[i]);
  }
  return result;
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    document.removeEventListener('keydown', onPopupEscPress);
    document.querySelector('.map__card').remove();
  }
};

var openPopup = function (ad) {
  renderCard(ad);
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function (card) {
  card.remove();
  document.removeEventListener('keydown', onPopupEscPress);
};

var renderCard = function (ad) {
  // Check if some curd already opened and delete it
  var openedCard = document.querySelector('.map__card');
  var card = cardTemplate.cloneNode(true);
  var popupCloser = card.querySelector('.popup__close');
  if (openedCard !== null) {
    openedCard.remove();
  }
  card.querySelector('.popup__title').textContent = ad.offer.title;
  card.querySelector('.popup__text--address').textContent = ad.offer.address;
  card.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь.';
  card.querySelector('.popup__type').textContent = TYPE_DICTIONARY[ad.offer.type];
  card.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей.';
  card.querySelector('.popup__text--time').textContent = 'заезд после ' + ad.offer.checking + ', выезд до ' + ad.offer.checkout + '.';
  for (var i = 0; i < FEATURES.length; i++) {
    if (ad.offer.features.indexOf(FEATURES[i]) === -1) {
      card.querySelector('.popup__feature--' + FEATURES[i]).remove();
    }
  }
  card.querySelector('.popup__description').textContent = ad.offer.description;
  card.querySelector('.popup__photos').innerHTML = '';
  for (i = 0; i < ad.offer.photos.length; i++) {
    var photo = photoTemplate.cloneNode(true);
    photo.src = ad.offer.photos[i];
    card.appendChild(photo);
  }
  card.querySelector('.popup__avatar').src = ad.author.avatar;
  popupCloser.addEventListener('click', function () {
    closePopup(card);
  });
  popupCloser.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup(card);
    }
  });
  mapElement.insertBefore(card, mapFilterContainer);
  return card;
};

var renderMapPin = function (ad) {
  var pin = mapPinTemplate.cloneNode(true);
  var img = pin.querySelector('img');
  pin.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
  pin.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
  img.src = ad.author.avatar;
  img.alt = ad.offer.title;
  pin.addEventListener('click', function () {
    openPopup(ad);
  });
  pin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openPopup(ad);
    }
  });
  return pin;
};

var renderMapPinList = function (ads) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderMapPin(ads[i]));
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

var setAdAddressValue = function (loc) {
  adAddress.value = loc.x + ', ' + loc.y;
};

var disableAdFormFields = function () {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = true;
  }
};

var enableAdFormFields = function () {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = false;
  }
};

var setAdPriceAttributes = function () {
  adPrice.placeholder = MIN_PRICE_DICTIONARY[adType.value];
  adPrice.min = MIN_PRICE_DICTIONARY[adType.value];
};

var setInactiveState = function () {
  mapElement.classList.add('map--faded');
  disableAdFormFields();
  adForm.classList.add('ad-form--disabled');
  setAdAddressValue(getMainPinLocation());
};

var setActiveState = function () {
  if (activeState) {
    return;
  }
  mapElement.classList.remove('map--faded');
  enableAdFormFields();
  adForm.classList.remove('ad-form--disabled');
  adItems = generateAdds(AD_QUANTITY);
  renderMapPinList(adItems);
  activeState = true;
  setAdPriceAttributes();
  setAdCapacityOptions();
};

mainPin.addEventListener('mouseup', function () {
  if (!activeState) {
    setActiveState();
  }
  setAdAddressValue(getMainPinLocation());
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
    setAdAddressValue(getMainPinLocation());
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

var renderAdCapacityOptions = function (allowedOptions) {
  adCapacity.innerHTML = '';
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < allowedOptions.length; i++) {
    var o = document.createElement('option');
    o.value = allowedOptions[i];
    o.textContent = CAPACITY_OPTIONS[o.value];
    fragment.appendChild(o);
  }
  adCapacity.appendChild(fragment);
};

var setAdCapacityOptions = function () {
  var currentVal = adCapacity.value;
  var allowedOpt = CAPACITY_ROOMS_DICTIONARY[adRooms.value];
  renderAdCapacityOptions(allowedOpt);
  if (allowedOpt.indexOf(+currentVal) !== -1) {
    adCapacity.value = currentVal;
  }
};

adType.addEventListener('change', function () {
  setAdPriceAttributes();
});

adTimein.addEventListener('change', function () {
  adTimeout.value = adTimein.value;
});

adTimeout.addEventListener('change', function () {
  adTimein.value = adTimeout.value;
});

adRooms.addEventListener('change', function () {
  setAdCapacityOptions();
});

setInactiveState();
