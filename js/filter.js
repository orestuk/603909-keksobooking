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
  var adItems = [];
  var mapFilters = document.querySelector('.map__filters');
  var typeEl = mapFilters.querySelector('select[name=housing-type]');
  var priceEl = mapFilters.querySelector('select[name=housing-price]');
  var roomsEl = mapFilters.querySelector('select[name=housing-rooms]');
  var guestsEl = mapFilters.querySelector('select[name=housing-guests]');
  var featuresEls = mapFilters.querySelectorAll('input[name=features]');
  var updatePins = function () {
    window.pin.removeAllPins();
    window.card.closePopup(window.card.getOpenedCard());
    var list = adItems.filter(function (ad) {
      var result = true;
      if (typeEl.value !== 'any') {
        result = result && typeEl.value === ad.offer.type;
      }
      if (priceEl.value !== 'any') {
        result = result && (priceMap[priceEl.value].min <= ad.offer.price) && (ad.offer.price < priceMap[priceEl.value].max);
      }
      if (roomsEl.value !== 'any') {
        result = result && +roomsEl.value === ad.offer.rooms;
      }
      if (guestsEl.value !== 'any') {
        result = result && +guestsEl.value === ad.offer.guests;
      }
      featuresEls.forEach(function (item) {
        if (item.checked) {
          result = result && ad.offer.features.indexOf(item.value) !== -1;
        }
      });
      return result;
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
  var resetFilter = function () {
    mapFilters.reset();
  };
  var setFilter = function (data) {
    adItems = data;
    updatePins();
  };
  return {
    resetFilter: resetFilter,
    setFilter: setFilter
  };
})();
