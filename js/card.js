'use strict';
window.card = (function () {
  var TYPE_DICTIONARY = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var photoTemplate = document.querySelector('template').content.querySelector('.popup__photo');
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
    card.querySelector('.popup__type').textContent = TYPE_DICTIONARY[ad.offer.type];
    card.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей.';
    card.querySelector('.popup__text--time').textContent = 'заезд после ' + ad.offer.checking + ', выезд до ' + ad.offer.checkout + '.';
    for (var i = 0; i < window.data.FEATURES.length; i++) {
      if (ad.offer.features.indexOf(window.data.FEATURES[i]) === -1) {
        card.querySelector('.popup__feature--' + window.data.FEATURES[i]).remove();
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
  var getOpenedCard = function () {
    return document.querySelector('.map__card');
  };
  return {
    renderCard: renderCard,
    getOpenedCard: getOpenedCard
  };
})();
