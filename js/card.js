'use strict';
window.card = (function () {
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var typeNameMap = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var photoTemplate = document.querySelector('template').content.querySelector('.popup__photo');
  var mapFilterContainer = document.querySelector('.map__filters-container');
  var mapElement = document.querySelector('.map');
  var renderCard = function (ad) {
    // Check if some card already opened and delete it
    var openedCard = getOpenedCard();
    if (openedCard !== null) {
      openedCard.remove();
    }
    var card = cardTemplate.cloneNode(true);
    card.querySelector('.popup__title').textContent = ad.offer.title;
    card.querySelector('.popup__text--address').textContent = ad.offer.address;
    card.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь.';
    card.querySelector('.popup__type').textContent = typeNameMap[ad.offer.type];
    card.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей.';
    card.querySelector('.popup__text--time').textContent = 'заезд после ' + ad.offer.checking + ', выезд до ' + ad.offer.checkout + '.';
    FEATURES.forEach(function (value) {
      if (ad.offer.features.indexOf(value) === -1) {
        card.querySelector('.popup__feature--' + value).remove();
      }
    });
    card.querySelector('.popup__description').textContent = ad.offer.description;
    card.querySelector('.popup__photos').innerHTML = '';
    ad.offer.photos.forEach(function (value) {
      var photo = photoTemplate.cloneNode(true);
      photo.src = value;
      card.appendChild(photo);
    });
    card.querySelector('.popup__avatar').src = ad.author.avatar;
    return card;
  };
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.data.KeyCode.ESC) {
      document.removeEventListener('keydown', onPopupEscPress);
      document.querySelector('.map__card').remove();
    }
  };
  var openPopup = function (ad) {
    var card = renderCard(ad);
    mapElement.insertBefore(card, mapFilterContainer);
    var popupCloser = card.querySelector('.popup__close');
    popupCloser.addEventListener('click', function () {
      closePopup(card);
    });
    popupCloser.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.KeyCode.ENTER) {
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
  var getOpenedCard = function () {
    return document.querySelector('.map__card');
  };
  window.pin.onOpenPopup = openPopup;
  return {
    getOpenedCard: getOpenedCard,
    closePopup: closePopup
  };
})();
