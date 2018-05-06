'use strict';

window.form = (function () {
  var minPriceMap = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var capacityRoomsMap = {
    100: [0],
    1: [1],
    2: [1, 2],
    3: [1, 2, 3]
  };
  var capacityNameMap = {
    3: 'для 3 гостей',
    2: 'для 2 гостей',
    1: 'для 1 гостя',
    0: 'не для гостей'
  };
  var timein = document.querySelector('select[name=timein]');
  var timeout = document.querySelector('select[name=timeout]');
  var rooms = document.querySelector('select[name=rooms]');
  var capacity = document.querySelector('select[name=capacity]');
  var type = document.querySelector('select[name=type]');
  var price = document.querySelector('input[name=price]');
  var form = document.querySelector('.ad-form');
  var fieldsets = document.querySelectorAll('.ad-form fieldset');
  var address = document.querySelector('input[name=address]');

  var renderAdCapacityOptions = function (allowedOptions) {
    capacity.innerHTML = '';
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < allowedOptions.length; i++) {
      var o = document.createElement('option');
      o.value = allowedOptions[i];
      o.textContent = capacityNameMap[o.value];
      fragment.appendChild(o);
    }
    capacity.appendChild(fragment);
  };

  var setCapacityOptions = function () {
    var currentVal = capacity.value;
    var allowedOpt = capacityRoomsMap[rooms.value];
    renderAdCapacityOptions(allowedOpt);
    if (allowedOpt.indexOf(+currentVal) !== -1) {
      capacity.value = currentVal;
    }
  };

  var setPriceAttributes = function () {
    price.placeholder = minPriceMap[type.value];
    price.min = minPriceMap[type.value];
  };

  var setAddressValue = function (loc) {
    address.value = loc.x + ', ' + loc.y;
  };

  var disableForm = function () {
    form.classList.add('ad-form--disabled');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = true;
    }
  };

  var enableForm = function () {
    form.classList.remove('ad-form--disabled');
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = false;
    }
  };

  type.addEventListener('change', function () {
    setPriceAttributes();
  });

  timein.addEventListener('change', function () {
    timeout.value = timein.value;
  });

  timeout.addEventListener('change', function () {
    timein.value = timeout.value;
  });

  rooms.addEventListener('change', function () {
    setCapacityOptions();
  });

  // Initiate form fields
  setPriceAttributes();
  setCapacityOptions();
  // ====
  return {
    formElement: form,
    enableForm: enableForm,
    disableForm: disableForm,
    setAddressValue: setAddressValue
  };
})();
