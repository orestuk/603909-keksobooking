'use strict';
window.pin = (function () {
  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 40;
  var mapPinTemplateEl = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinsEl = document.querySelector('.map__pins');
  var renderPin = function (ad) {
    var pinEl = mapPinTemplateEl.cloneNode(true);
    var image = pinEl.querySelector('img');
    pinEl.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
    pinEl.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
    image.src = ad.author.avatar;
    image.alt = ad.offer.title;
    return pinEl;
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
    mapPinsEl.appendChild(fragment);
  };
  var removeAllPins = function () {
    var pinListEl = document.querySelectorAll('.map__pins button[type=button]');
    pinListEl.forEach(function (item) {
      item.remove();
    });
  };
  var pin = {
    mapPinsEl: mapPinsEl,
    onOpenPopup: function () {},
    removeAllPins: removeAllPins,
    renderMapPinList: renderMapPinList
  };
  return pin;
})();
