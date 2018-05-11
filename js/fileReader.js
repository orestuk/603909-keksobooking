'use strict';
window.fileReader = (function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var loadFile = function (file, placeHolderEl) {
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (value) {
      return fileName.endsWith(value);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        placeHolderEl.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };
  return {
    loadFile: loadFile
  };
})();
