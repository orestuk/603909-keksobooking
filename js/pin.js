'use strict';
window.pin = (function () {
  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 40;

  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var renderPin = function (ad) {
    var pin = mapPinTemplate.cloneNode(true);
    var img = pin.querySelector('img');
    pin.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
    pin.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
    img.src = ad.author.avatar;
    img.alt = ad.offer.title;
    return pin;
  };
  var removeAllPins = function () {
    var pins = document.querySelectorAll('.map__pins button[type=button]');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };
  return {
    renderPin: renderPin,
    removeAllPins: removeAllPins
  };
})();
