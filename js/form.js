'use strict';
window.form = (function () {
  var SUCCESS_POPUP_TIMEOUT = 2000;
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
  var timeinEl = document.querySelector('select[name=timein]');
  var timeoutEl = document.querySelector('select[name=timeout]');
  var roomsEl = document.querySelector('select[name=rooms]');
  var capacityEl = document.querySelector('select[name=capacity]');
  var typeEl = document.querySelector('select[name=type]');
  var priceEl = document.querySelector('input[name=price]');
  var formEl = document.querySelector('.ad-form');
  var fieldsetsEl = document.querySelectorAll('.ad-form fieldset');
  var addressEl = document.querySelector('input[name=address]');
  var successEl = document.querySelector('.success');

  var renderAdCapacityOptions = function (allowedOptions) {
    capacityEl.innerHTML = '';
    var fragment = document.createDocumentFragment();
    allowedOptions.forEach(function (value) {
      var optionEl = document.createElement('option');
      optionEl.value = value;
      optionEl.textContent = capacityNameMap[optionEl.value];
      fragment.appendChild(optionEl);
    });
    capacityEl.appendChild(fragment);
  };

  var setCapacityOptions = function () {
    var currentValue = capacityEl.value;
    var allowedOpt = capacityRoomsMap[roomsEl.value];
    renderAdCapacityOptions(allowedOpt);
    if (allowedOpt.indexOf(+currentValue) !== -1) {
      capacityEl.value = currentValue;
    }
  };

  var setPriceAttributes = function () {
    priceEl.placeholder = minPriceMap[typeEl.value];
    priceEl.min = minPriceMap[typeEl.value];
  };

  var setAddressValue = function (location) {
    addressEl.value = location.x + ', ' + location.y;
  };

  var disableForm = function () {
    formEl.classList.add('ad-form--disabled');
    fieldsetsEl.forEach(function (value) {
      value.disabled = true;
    });
  };

  var enableForm = function () {
    formEl.classList.remove('ad-form--disabled');
    fieldsetsEl.forEach(function (value) {
      value.disabled = false;
    });
  };

  typeEl.addEventListener('change', function () {
    setPriceAttributes();
  });

  timeinEl.addEventListener('change', function () {
    timeoutEl.value = timeinEl.value;
  });

  timeoutEl.addEventListener('change', function () {
    timeinEl.value = timeoutEl.value;
  });

  roomsEl.addEventListener('change', function () {
    setCapacityOptions();
  });

  var submitHandler = function () {
    form.onSubmitForm();
    successEl.classList.remove('hidden');
    setTimeout(function () {
      successEl.classList.add('hidden');
    }, SUCCESS_POPUP_TIMEOUT);
  };
  var resetForm = function () {
    formEl.reset();
  };

  formEl.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(formEl), submitHandler, window.error.renderError);
    evt.preventDefault();
  });

  formEl.addEventListener('reset', function () {
    form.onResetForm();
  });

  // Initiate form element fields
  setPriceAttributes();
  setCapacityOptions();
  var form = {
    onSubmitForm: function () {},
    onResetForm: function () {},
    enableForm: enableForm,
    disableForm: disableForm,
    resetForm: resetForm,
    setAddressValue: setAddressValue
  };
  return form;
})();
