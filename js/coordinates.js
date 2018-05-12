'use strict';
window.coordinates = (function () {
  var Rect = function (left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  };

  var Size = function (width, height) {
    this.width = width;
    this.height = height;
  };

  var Location = function (x, y) {
    this.x = x;
    this.y = y;
  };

  var PinLocation = function (constraints, pinSize) {
    this.x = 0;
    this.y = 0;
    this._constraints = constraints;
    this._pinSize = pinSize;
  };

  PinLocation.prototype.setX = function (x) {
    this.x = x;
    if (x + this._pinSize.width > this._constraints.right) {
      this.x = this._constraints.right - this._pinSize.width / 2;
    } else if (x + this._pinSize.width / 2 < this._constraints.left) {
      this.x = this._constraints.left - this._pinSize.width / 2;
    }
  };

  PinLocation.prototype.setY = function (y) {
    this.y = y;
    if (y + this._pinSize.height > this._constraints.bottom) {
      this.y = this._constraints.bottom - this._pinSize.height;
    } else if (y + this._pinSize.height < this._constraints.top) {
      this.y = this._constraints.top - this._pinSize.height;
    }
  };
  return {
    Rect: Rect,
    Size: Size,
    Location: Location,
    PinLocation: PinLocation
  };
})();
