'use strict';
window.filter = (function () {
  var priceMap = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: 10000000
    }
  };
  var addItems = [];
  var mapFilters = document.querySelector('.map__filters');
  var typeEl = mapFilters.querySelector('select[name=housing-type]');
  var priceEl = mapFilters.querySelector('select[name=housing-price]');
  var roomsEl = mapFilters.querySelector('select[name=housing-rooms]');
  var guestsEl = mapFilters.querySelector('select[name=housing-guests]');
  var featuresEls = mapFilters.querySelectorAll('input[name=features]');
  var updatePins = function () {
    window.pin.removeAllPins();
    window.card.closePopup(window.card.getOpenedCard());
    var list = addItems.filter(function (et) {
      var s = true;
      if (typeEl.value !== 'any') {
        s = s && typeEl.value === et.offer.type;
      }
      if (priceEl.value !== 'any') {
        s = s && (priceMap[priceEl.value].min <= et.offer.price) && (et.offer.price < priceMap[priceEl.value].max);
      }
      if (roomsEl.value !== 'any') {
        s = s && +roomsEl.value === et.offer.rooms;
      }
      if (guestsEl.value !== 'any') {
        s = s && +guestsEl.value === et.offer.guests;
      }
      featuresEls.forEach(function (item) {
        if (item.checked) {
          s = s && et.offer.features.indexOf(item.value) !== -1;
        }
      });
      return s;
    });
    window.pin.renderMapPinList(list.slice(0, 5));
  };
  var updateHandler = function () {
    window.debounce(function () {
      updatePins();
    })();
  };
  typeEl.addEventListener('change', updateHandler);
  priceEl.addEventListener('change', updateHandler);
  roomsEl.addEventListener('change', updateHandler);
  guestsEl.addEventListener('change', updateHandler);
  featuresEls.forEach(function (value) {
    value.addEventListener('change', updateHandler);
  });
  var successfulHandler = function (data) {
    addItems = data;
  };
  var errorHandler = function (erMessage) {
    window.error.renderError(erMessage);
  };

  window.backend.load(successfulHandler, errorHandler);
  return {
    updatePins: updatePins
  };
})();
