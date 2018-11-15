define("event/Event", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.default = Event;
});
define("event/EventDispatcher", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        EventDispatcher.prototype.dispatchEvent = function (event) {
        };
        return EventDispatcher;
    }());
    exports.default = EventDispatcher;
});
define("math/_Math", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.default = _Math;
});
