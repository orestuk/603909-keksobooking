'use strict';
window.error = (function () {
  var ERROR_POPUP_TIMEOUT = 3000;
  var renderError = function (erMessage) {
    var err = document.createElement('div');
    err.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    err.style.position = 'absolute';
    err.style.left = '0px';
    err.style.right = '0px';
    err.style.fontSize = '30px';
    err.textContent = erMessage;
    document.body.insertAdjacentElement('afterbegin', err);
    setTimeout(function () {
      err.remove();
    }, ERROR_POPUP_TIMEOUT);
  };
  return {
    renderError: renderError
  };
})();
