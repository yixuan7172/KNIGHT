var KINGHT;
(function (KINGHT) {
    var Event = (function () {
        function Event(type, bubbles, cancelable) {
            this.type = type;
            this.bubbles = !!bubbles;
            this.cancelable = !!cancelable;
            this.target = null;
            this.currentTarget = null;
            this.eventPhase = 0;
            this.timeStamp = (new Date).getTime();
            this.defaultPrevented = false;
            this.propagationStopped = false;
            this.removed = false;
        }
        return Event;
    }());
    KINGHT.Event = Event;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.__listeners = null;
            this.__captureListeners = null;
        }
        EventDispatcher.prototype.addEventlistener = function (type, listener, useCapture) {
            if (useCapture === void 0) { useCapture = true; }
            var listeners;
            if (useCapture) {
                listeners = this.__captureListeners = this.__captureListeners || {};
            }
            else {
                listeners = this.__listeners = this.__listeners || {};
            }
            var listenerArray = listeners[type];
            if (listenerArray) {
                this.removeEventListener(type, listener, useCapture);
            }
            listenerArray = listeners[type];
            if (!listenerArray) {
                listenerArray[type] = [listener];
            }
            else {
                listenerArray.push(listener);
            }
        };
        EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
            if (useCapture === void 0) { useCapture = true; }
            var listeners = useCapture ? this.__captureListeners : this.__listeners;
            if (!listeners)
                return;
            var listenersArray = listeners[type];
            if (!listenersArray)
                return;
            for (var i = 0, l = listenersArray.length; i < l; ++i) {
                if (listenersArray[i] === listener) {
                    listenersArray.splice(i, 1);
                    break;
                }
            }
        };
        EventDispatcher.prototype.removeAllEventListeners = function (type) {
            if (!type) {
                this.__listeners = this.__captureListeners = null;
            }
            if (this.__listeners) {
                delete this.__listeners[type];
            }
            if (this.__captureListeners) {
                delete this.__captureListeners[type];
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (event, bubble, cancelable) {
            if (typeof event === "string") {
                var listeners = this.__listeners;
                if (!bubble && (!listeners || !listeners[event])) {
                    return true;
                }
            }
        };
        return EventDispatcher;
    }());
    KINGHT.EventDispatcher = EventDispatcher;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    var matrixPool = [];
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.create = function () {
            var matrix = matrixPool.pop();
            if (!matrix) {
                matrix = new Matrix();
            }
            return matrix;
        };
        Matrix.release = function (matrix) {
            if (!matrix)
                return;
            matrixPool.push(matrix);
        };
        Matrix.prototype.clone = function (matrix) {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        };
        Matrix.prototype.identity = function () {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
            return this;
        };
        Matrix.prototype.isIdentity = function () {
            return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
        };
        Matrix.prototype.setValues = function (a, b, c, d, tx, ty) {
            this.a = a != null ? a : 1;
            this.b = b || 0;
            this.c = c || 0;
            this.d = d != null ? d : 1;
            this.tx = tx || 0;
            this.ty = ty || 0;
            return this;
        };
        Matrix.prototype.equals = function (other) {
            return this.a === other.a &&
                this.b === other.b &&
                this.c === other.c &&
                this.d === other.d &&
                this.tx === other.tx &&
                this.ty === other.ty;
        };
        Matrix.prototype.copy = function (other) {
            return this.setValues(other.a, other.b, other.c, other.d, other.tx, other.ty);
        };
        Matrix.prototype.toString = function () {
            return "[Matrix(a=" + this.a + ",b=" + this.b + ",c=" + this.c + ",d=" + this.d + ",tx=" + this.tx + ",ty=" + this.ty + ")]";
        };
        return Matrix;
    }());
    KINGHT.Matrix = Matrix;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    var Point = (function () {
        function Point() {
        }
        return Point;
    }());
    KINGHT.Point = Point;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    var Rectangle = (function () {
        function Rectangle() {
        }
        return Rectangle;
    }());
    KINGHT.Rectangle = Rectangle;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    var _Math = (function () {
        function _Math() {
        }
        _Math.deg2Rad = function (deg) {
            return deg * Math.PI / 180;
        };
        _Math.rad2Deg = function (rad) {
            return rad * 180 / Math.PI;
        };
        _Math.randInt = function (low, high) {
            if (low > high)
                return;
            return low + Math.floor(Math.random() * (high - low + 1));
        };
        _Math.randFloat = function (low, high) {
            if (low > high)
                return;
            return low + Math.random() * (high - low);
        };
        _Math.isPowerOfTwo = function (value) {
            return (value & (value - 1)) === 0 && value !== 0;
        };
        _Math.arrayMin = function (arr) {
            var len = arr.length;
            if (len <= 0)
                return Infinity;
            var min = arr[0];
            for (var i = 1; i < len; ++i) {
                if (min > arr[i])
                    min = arr[i];
            }
            return min;
        };
        _Math.arrayMax = function (arr) {
            var len = arr.length;
            if (len <= 0)
                return -Infinity;
            var max = arr[0];
            for (var i = 1; i < len; ++i) {
                if (max < arr[i])
                    max = arr[i];
            }
            return max;
        };
        return _Math;
    }());
    KINGHT._Math = _Math;
})(KINGHT || (KINGHT = {}));
