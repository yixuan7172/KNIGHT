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
        Matrix.prototype.append = function (a, b, c, d, tx, ty) {
            var ma = this.a, mb = this.b, mc = this.c, md = this.d;
            if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
                this.a = ma * a + mc * b;
                this.b = mb * a + md * b;
                this.c = ma * c + mc * d;
                this.d = mb * c + md * d;
            }
            this.tx = ma * tx + mc * ty + this.tx;
            this.ty = mb * tx + md * ty + this.ty;
            return this;
        };
        Matrix.prototype.prepend = function (a, b, c, d, tx, ty) {
            var ma = this.a, mb = this.b, mc = this.c, md = this.d;
            if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
                this.a = a * ma + c * mb;
                this.b = b * ma + d * mb;
                this.c = a * mc + c * md;
                this.d = b * mc + d * md;
            }
            this.tx = a * this.tx + c * this.ty + tx;
            this.tx = b * this.tx + d * this.ty + ty;
            return this;
        };
        Matrix.prototype.appendMatrix = function (matrix) {
            return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        };
        Matrix.prototype.prependMatrix = function (matrix) {
            return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        };
        Matrix.prototype.translate = function (dx, dy) {
            this.tx += dx;
            this.ty += dy;
            return this;
        };
        Matrix.prototype.scale = function (sx, sy) {
            if (sx !== 1) {
                this.a *= sx;
                this.c *= sx;
                this.tx *= sx;
            }
            if (sy !== 1) {
                this.b *= sy;
                this.d *= sy;
                this.ty *= sy;
            }
            return this;
        };
        Matrix.prototype.rotate = function (angle) {
            angle %= 360;
            if (angle !== 0) {
                var rad = KINGHT._Math.deg2Rad(angle);
                var cos = Math.cos(rad), sin = Math.sin(rad);
                var a = this.a, b = this.b, c = this.c, d = this.d, tx = this.tx, ty = this.ty;
                this.a = a * cos - b * sin;
                this.b = a * sin + b * cos;
                this.c = c * cos - d * sin;
                this.d = c * sin + d * cos;
                this.tx = tx * cos - ty * sin;
                this.ty = tx * sin + ty * cos;
            }
            return this;
        };
        Matrix.prototype.inverse = function () {
            var a = this.a, b = this.b, c = this.c, d = this.d, tx = this.tx, ty = this.ty;
            var n = a * d - b * c;
            if (n === 0)
                return this;
            n = 1 / n;
            this.a = d * n;
            this.b = -b * n;
            this.c = -c * n;
            this.d = a * n;
            this.tx = (c * ty - d * tx) * n;
            this.ty = -(a * ty - b * tx) * n;
            return this;
        };
        Matrix.prototype.clone = function (matrix) {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        };
        Matrix.prototype.identity = function () {
            return this.set(1, 0, 0, 1, 0, 0);
        };
        Matrix.prototype.isIdentity = function () {
            return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
        };
        Matrix.prototype.set = function (a, b, c, d, tx, ty) {
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
            return this.set(other.a, other.b, other.c, other.d, other.tx, other.ty);
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
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.set(x, y);
        }
        Point.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.copy = function (point) {
            this.x = point.x;
            this.y = point.y;
            return this;
        };
        Point.prototype.add = function (point) {
            this.x += point.x;
            this.y += point.y;
            return this;
        };
        Point.prototype.sub = function (point) {
            this.x -= point.x;
            this.y -= point.y;
            return this;
        };
        Point.prototype.equals = function (point) {
            return this.x === point.x && this.y === point.y;
        };
        Point.prototype.distance = function (point) {
            return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
        };
        Point.prototype.toString = function () {
            return "[Point(x=" + this.x + ",y=" + this.y + ")]";
        };
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
