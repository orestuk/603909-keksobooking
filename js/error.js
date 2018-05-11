'use strict';
window.error = (function () {
  var ERROR_POPUP_TIMEOUT = 3000;
  var renderError = function (erMessage) {
    var errorEl = document.createElement('div');
    errorEl.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    errorEl.style.position = 'absolute';
    errorEl.style.left = '0px';
    errorEl.style.right = '0px';
    errorEl.style.fontSize = '30px';
    errorEl.textContent = erMessage;
    document.body.insertAdjacentElement('afterbegin', errorEl);
    setTimeout(function () {
      errorEl.remove();
    }, ERROR_POPUP_TIMEOUT);
  };
  return {
    renderError: renderError
  };
})();
