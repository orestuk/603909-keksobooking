'use strict';
window.card = (function () {
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var typeNameMap = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var openedCardEl = null;
  var cardTemplateEl = document.querySelector('template').content.querySelector('.map__card');
  var photoTemplateEl = document.querySelector('template').content.querySelector('.popup__photo');
  var mapFilterContainerEl = document.querySelector('.map__filters-container');
  var mapElementEl = document.querySelector('.map');
  // Card template
  var titleEl = cardTemplateEl.querySelector('.popup__title');
  var addressEl = cardTemplateEl.querySelector('.popup__text--address');
  var priceEl = cardTemplateEl.querySelector('.popup__text--price');
  var typeEl = cardTemplateEl.querySelector('.popup__type');
  var capacityEl = cardTemplateEl.querySelector('.popup__text--capacity');
  var timeEl = cardTemplateEl.querySelector('.popup__text--time');
  var descriptionEl = cardTemplateEl.querySelector('.popup__description');
  var photoListEl = cardTemplateEl.querySelector('.popup__photos');
  var avatarEl = cardTemplateEl.querySelector('.popup__avatar');
  var featuresEl = cardTemplateEl.querySelector('.popup__features');
  var renderCard = function (ad) {
    // Check if some card already opened and delete it
    if (openedCardEl !== null) {
      openedCardEl.remove();
    }
    titleEl.textContent = ad.offer.title;
    addressEl.textContent = ad.offer.address;
    priceEl.textContent = ad.offer.price + '₽/ночь.';
    typeEl.textContent = typeNameMap[ad.offer.type];
    capacityEl.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей.';
    timeEl.textContent = 'заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout + '.';
    avatarEl.src = ad.author.avatar;
    featuresEl.style.display = ad.offer.features.length === 0 ? 'none' : 'block';
    FEATURES.forEach(function (value) {
      var featureEl = cardTemplateEl.querySelector('.popup__feature--' + value);
      featureEl.style.display = ad.offer.features.indexOf(value) === -1 ? 'none' : 'inline-block';
    });
    descriptionEl.textContent = ad.offer.description;
    photoListEl.innerHTML = '';
    ad.offer.photos.forEach(function (value) {
      var photoEl = photoTemplateEl.cloneNode(true);
      photoTemplateEl.src = value;
      photoListEl.appendChild(photoEl);
    });
    openedCardEl = cardTemplateEl.cloneNode(true);
    return openedCardEl;
  };
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.data.KeyCode.ESC) {
      document.removeEventListener('keydown', onPopupEscPress);
      openedCardEl.remove();
    }
  };
  var openPopup = function (ad) {
    var cardEl = renderCard(ad);
    mapElementEl.insertBefore(cardEl, mapFilterContainerEl);
    var popupCloser = cardEl.querySelector('.popup__close');
    popupCloser.addEventListener('click', function () {
      closePopup();
    });
    popupCloser.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.KeyCode.ENTER) {
        closePopup();
      }
    });
    document.addEventListener('keydown', onPopupEscPress);
  };
  var closePopup = function () {
    if (openedCardEl !== null) {
      openedCardEl.remove();
    }
    document.removeEventListener('keydown', onPopupEscPress);
  };
  window.pin.onOpenPopup = openPopup;
  return {
    closePopup: closePopup
  };
})();
