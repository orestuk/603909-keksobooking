'use strict';
window.avatar = (function () {
  var defaultAvatarSrc = 'img/muffin-grey.svg';
  var fileChooserEl = document.querySelector('.ad-form-header__input');
  var dropAreaEl = document.querySelector('.ad-form__field');
  var previewEl = document.querySelector('.ad-form-header__preview img');

  fileChooserEl.addEventListener('change', function () {
    window.fileReader.loadFile(fileChooserEl.files[0], previewEl);
  });
  dropAreaEl.addEventListener('dragenter', function (evt) {
    evt.target.style.backgroundColor = 'grey';
    evt.preventDefault();
  });
  dropAreaEl.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });
  dropAreaEl.addEventListener('dragleave', function (evt) {
    evt.target.style.backgroundColor = '';
    evt.preventDefault();
  });
  dropAreaEl.addEventListener('drop', function (evt) {
    evt.target.style.backgroundColor = '';
    window.fileReader.loadFile(evt.dataTransfer.files[0], previewEl);
    evt.preventDefault();
  });
  var resetAvatar = function () {
    previewEl.src = defaultAvatarSrc;
  };
  return {
    resetAvatar: resetAvatar
  };
})();
