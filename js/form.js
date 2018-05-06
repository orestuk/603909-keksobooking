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
  var formElement = document.querySelector('.ad-form');
  var fieldsets = document.querySelectorAll('.ad-form fieldset');
  var address = document.querySelector('input[name=address]');

  var renderAdCapacityOptions = function (allowedOptions) {
    capacity.innerHTML = '';
    var fragment = document.createDocumentFragment();
    allowedOptions.forEach(function (value) {
      var o = document.createElement('option');
      o.value = value;
      o.textContent = capacityNameMap[o.value];
      fragment.appendChild(o);
    });
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
    formElement.classList.add('ad-form--disabled');
    fieldsets.forEach(function (value) {
      value.disabled = true;
    });
  };

  var enableForm = function () {
    formElement.classList.remove('ad-form--disabled');
    fieldsets.forEach(function (value) {
      value.disabled = false;
    });
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

  var submitHandler = function () {
    form.onSubmitForm();
    var successElement = document.querySelector('.success');
    successElement.classList.remove('hidden');
    setTimeout(function () {
      successElement.classList.add('hidden');
    }, 2000);
  };
  var resetForm = function () {
    formElement.reset();
  };

  formElement.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(formElement), submitHandler, window.error.renderError);
    evt.preventDefault();
  });

  formElement.addEventListener('reset', function () {
    form.onResetForm();
  });

  // Initiate formElement fields
  setPriceAttributes();
  setCapacityOptions();
  var form = {
    formElement: formElement,
    onSubmitForm: function () {},
    onResetForm: function () {},
    enableForm: enableForm,
    disableForm: disableForm,
    resetForm: resetForm,
    setAddressValue: setAddressValue
  };
  return form;
})();
