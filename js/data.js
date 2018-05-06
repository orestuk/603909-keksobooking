'use strict';

window.data = (function () {
  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MAX_ROOMS = 5;
  var MIN_ROOMS = 1;
  var MAX_GUESTS = 15;
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

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

  var generateConsecutiveNumbers = function (quantity) {
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
    var avatarNumbersSequence = shuffleArray(generateConsecutiveNumbers(quantity).slice());
    var titlesSequence = shuffleArray(TITLES.slice());
    var result = [];
    for (var i = 0; i < quantity; i++) {
      result[i] = generateOneAd(avatarNumbersSequence[i], titlesSequence[i]);
    }
    return result;
  };

  return {
    generateAdds: generateAdds,
    KeyCode: KeyCode,
    FEATURES: FEATURES
  };
})();
