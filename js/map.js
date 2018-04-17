'use strict';

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

var mapElement = document.querySelector('.map');
var mapPinsElement = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var photoTemplate = document.querySelector('template').content.querySelector('.popup__photo');
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

var renderMapPin = function (ad) {
  var pin = mapPinTemplate.cloneNode(true);
  var img = pin.querySelector('img');
  pin.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
  pin.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
  img.src = ad.author.avatar;
  img.alt = ad.offer.title;
  return pin;
};

var renderCard = function (ad) {
  var card = cardTemplate.cloneNode(true);
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
  return card;
};

var renderMapPinList = function (ads) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderMapPin(ads[i]));
  }
  mapPinsElement.appendChild(fragment);
};

var renderOneCard = function (ad) {
  var card = renderCard(ad[0]);
  var mapFilterContainer = document.querySelector('.map__filters-container');
  mapElement.insertBefore(card, mapFilterContainer);
};

mapElement.classList.remove('map--faded');
adItems = generateAdds(AD_QUANTITY);
renderMapPinList(adItems);
renderOneCard(adItems);
