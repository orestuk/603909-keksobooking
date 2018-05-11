'use strict';
(function () {
  var fileChooserEl = document.querySelector('.ad-form__input');
  var dropAreaEl = document.querySelector('.ad-form__upload');
  var photoContainerEl = document.querySelector('.ad-form__photo-container');
  var draggedEl;

  var renderPhoto = function (fileName) {
    var photoEl = document.createElement('div');
    photoEl.classList.add('ad-form__photo');
    photoEl.draggable = true;
    var imageEL = document.createElement('img');
    imageEL.style.width = '70px';
    imageEL.style.height = '70px';
    photoEl.appendChild(imageEL);
    window.fileReader.loadFile(fileName, imageEL);

    photoEl.addEventListener('dragstart', function (evt) {
      draggedEl = evt.target;
      evt.dataTransfer.dropEffect = 'copy';
    });
    photoEl.addEventListener('dragover', function (evt) {
      evt.preventDefault();
      return false;
    });
    photoEl.addEventListener('dragenter', function (evt) {
      evt.preventDefault();
    });
    photoEl.addEventListener('dragleave', function (evt) {
      evt.preventDefault();
    });
    photoEl.addEventListener('drop', function (evt) {
      var targetParentEl = evt.target.parentNode;
      var draggedParentEl = draggedEl.parentNode;
      targetParentEl.removeChild(evt.target);
      targetParentEl.appendChild(draggedEl);
      draggedParentEl.appendChild(evt.target);
      evt.preventDefault();
    });
    photoContainerEl.insertAdjacentElement('beforeend', photoEl);
  };
  fileChooserEl.addEventListener('change', function () {
    renderPhoto(fileChooserEl.files[0]);
  });
  dropAreaEl.addEventListener('dragenter', function (evt) {
    evt.preventDefault();
  });
  dropAreaEl.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });
  dropAreaEl.addEventListener('dragleave', function (evt) {
    evt.preventDefault();
  });
  dropAreaEl.addEventListener('drop', function (evt) {
    renderPhoto(evt.dataTransfer.files[0]);
    evt.preventDefault();
  });
  document.addEventListener('drop', function (evt) {
    evt.preventDefault();
  });
})();
