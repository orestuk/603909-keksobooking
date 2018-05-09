'use strict';
window.pin = (function () {
  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 40;
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');
  var renderPin = function (ad) {
    var pin = mapPinTemplate.cloneNode(true);
    var image = pin.querySelector('img');
    pin.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
    pin.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
    image.src = ad.author.avatar;
    image.alt = ad.offer.title;
    return pin;
  };
  var addPinClickListener = function (pinEl, ad) {
    pinEl.addEventListener('click', function () {
      pin.onOpenPopup(ad);
    });
  };
  // Created separate function for right passing ad value
  var addPinKeyDownListener = function (pinEl, ad) {
    pinEl.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.KeyCode.ENTER) {
        pin.onOpenPopup(ad);
      }
    });
  };
  var renderMapPinList = function (ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (item) {
      var pinEl = renderPin(item);
      addPinClickListener(pinEl, item);
      addPinKeyDownListener(pinEl, item);
      fragment.appendChild(pinEl);
    });
    mapPinsElement.appendChild(fragment);
  };
  var removeAllPins = function () {
    var pins = document.querySelectorAll('.map__pins button[type=button]');
    pins.forEach(function (item) {
      item.remove();
    });
  };
  var pin = {
    mapPinsElement: mapPinsElement,
    onOpenPopup: function () {},
    removeAllPins: removeAllPins,
    renderMapPinList: renderMapPinList
  };
  return pin;
})();
