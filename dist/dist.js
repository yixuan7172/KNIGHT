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
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.set(a, b, c, d, tx, ty);
        }
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
            return new Point(this.x + point.x, this.y + point.y);
        };
        Point.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
            return this;
        };
        Point.prototype.sub = function (point) {
            return new Point(this.x - point.x, this.y - point.y);
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
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.set(x, y, width, height);
        }
        Object.defineProperty(Rectangle.prototype, "left", {
            get: function () {
                return this.x;
            },
            set: function (value) {
                this.width += this.x - value;
                this.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            get: function () {
                return this.y;
            },
            set: function (value) {
                this.height += this.y - value;
                this.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            set: function (value) {
                this.width = value - this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            set: function (value) {
                this.height += value - this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "topLeft", {
            get: function () {
                return new KINGHT.Point(this.left, this.top);
            },
            set: function (value) {
                this.left = value.x;
                this.top = value.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottomRight", {
            get: function () {
                return new KINGHT.Point(this.right, this.bottom);
            },
            set: function (value) {
                this.right = value.x;
                this.bottom = value.y;
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.copy = function (rect) {
            this.x = rect.x;
            this.y = rect.y;
            this.width = rect.width;
            this.height = rect.height;
            return this;
        };
        Rectangle.prototype.clone = function () {
            return new Rectangle(this.x, this.y, this.width, this.height);
        };
        Rectangle.prototype.set = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        Rectangle.prototype.contains = function (x, y) {
            return (this.left <= x && x <= this.right
                && this.top <= y && y <= this.bottom);
        };
        Rectangle.prototype.containsPoint = function (point) {
            return this.contains(point.x, point.y);
        };
        Rectangle.prototype.containsRect = function (rect) {
            return (rect.left >= this.left && rect.left < this.right &&
                rect.top >= this.top && rect.top < this.bottom &&
                rect.right <= this.right && rect.right > this.left &&
                rect.bottom <= this.bottom && rect.bottom > this.top);
        };
        Rectangle.prototype.isEmpty = function () {
            return this.width <= 0 || this.height <= 0;
        };
        Rectangle.prototype.setEmpty = function () {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            return this;
        };
        Rectangle.prototype.equals = function (rect) {
            if (this === rect)
                return true;
            return (this.x === rect.x &&
                this.y === rect.y &&
                this.width === rect.width &&
                this.height === rect.height);
        };
        Rectangle.prototype.offset = function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        };
        Rectangle.prototype.offsetPoint = function (point) {
            return this.offset(point.x, point.y);
        };
        Rectangle.prototype.union = function (toUnion) {
            var result = this.clone();
            if (toUnion.isEmpty())
                return result;
            if (result.isEmpty()) {
                result.copy(toUnion);
                return result;
            }
            var minX = Math.min(result.x, toUnion.x);
            var minY = Math.min(result.y, toUnion.y);
            var width = Math.max(result.right, toUnion.right) - minX;
            var height = Math.max(result.bottom, toUnion.bottom) - minY;
            return result.set(minX, minY, width, height);
        };
        Rectangle.prototype.intersection = function (toIntersectRect) {
            var result = this.clone();
            if (result.isEmpty() || toIntersectRect.isEmpty()) {
                return result.setEmpty();
            }
            var min = Math.min, max = Math.max;
            var maxX = max(this.x, toIntersectRect.x);
            var maxY = max(this.y, toIntersectRect.y);
            var width = min(this.right, toIntersectRect.right) - maxX;
            var height = min(this.bottom, toIntersectRect.bottom) - maxY;
            if (width <= 0 || height <= 0)
                return result.setEmpty();
            return result.set(maxX, maxY, width, height);
        };
        Rectangle.prototype.isIntersects = function (toIntersectRect) {
            return (Math.max(this.x, toIntersectRect.x) <= Math.min(this.right, toIntersectRect.right) &&
                Math.max(this.y, toIntersectRect.y) <= Math.min(this.bottom, toIntersectRect.bottom));
        };
        Rectangle.prototype.inflate = function (dx, dy) {
            this.x -= dx;
            this.width += 2 * dx;
            this.y -= dy;
            this.height += 2 * dy;
            return this;
        };
        Rectangle.prototype.toString = function () {
            return "[Rectangle(x=" + this.x + ",y=" + this.y + ",width=" + this.width + ",height=" + this.height + ")]";
        };
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
var KINGHT;
(function (KINGHT) {
    var WebGLUtils = (function () {
        function WebGLUtils() {
        }
        WebGLUtils.compileProgram = function (gl, vertexSrc, framSrc) {
            var fragmentShader = this.compileFragmentShader(gl, framSrc);
            var vertexShader = this.compileVertexShader(gl, vertexSrc);
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.log("program not linked!");
                console.log(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }
            return program;
        };
        WebGLUtils.compileFragmentShader = function (gl, shadersource) {
            return this.__compileShader(gl, shadersource, gl.FRAGMENT_SHADER);
        };
        WebGLUtils.compileVertexShader = function (gl, shadersource) {
            return this.__compileShader(gl, shadersource, gl.VERTEX_SHADER);
        };
        WebGLUtils.__compileShader = function (gl, shadersource, shaderType) {
            var shader = gl.createShader(shaderType);
            gl.shaderSource(shader, shadersource);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log("shader not compiled!");
                console.log(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };
        WebGLUtils.checkCanUseWebGL = function () {
            if (this.canUseWebGL == void 0) {
                try {
                    var canvas = document.createElement('canvas');
                    this.canUseWebGL = !!window['WebGLRenderingContext'] && !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                }
                catch (e) {
                    this.canUseWebGL = false;
                }
            }
            return this.canUseWebGL;
        };
        return WebGLUtils;
    }());
    KINGHT.WebGLUtils = WebGLUtils;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    function createCanvas(width, height) {
        var canvas = document.createElement('canvas');
        if (width != void 0 && height != void 0) {
            canvas.width = width;
            canvas.height = height;
        }
        return canvas;
    }
    var WebGLRenderContext = (function () {
        function WebGLRenderContext(width, height) {
        }
        WebGLRenderContext.getInstance = function (width, height) {
            if (!this.instance)
                return new WebGLRenderContext(width, height);
            return this.instance;
        };
        return WebGLRenderContext;
    }());
    KINGHT.WebGLRenderContext = WebGLRenderContext;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    var WebGLVertexArrayObject = (function () {
        function WebGLVertexArrayObject() {
        }
        return WebGLVertexArrayObject;
    }());
    KINGHT.WebGLVertexArrayObject = WebGLVertexArrayObject;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    var WebGLDrawCmdManager = (function () {
        function WebGLDrawCmdManager() {
        }
        return WebGLDrawCmdManager;
    }());
    KINGHT.WebGLDrawCmdManager = WebGLDrawCmdManager;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    var WebGLRenderBuffer = (function () {
        function WebGLRenderBuffer() {
        }
        return WebGLRenderBuffer;
    }());
    KINGHT.WebGLRenderBuffer = WebGLRenderBuffer;
})(KINGHT || (KINGHT = {}));
var KINGHT;
(function (KINGHT) {
    var WebGLRenderTarget = (function () {
        function WebGLRenderTarget(gl, width, height) {
            this.clearColor = [0, 0, 0, 0];
            this.useFrameBuffer = true;
            this.gl = gl;
            this.width = width || 1;
            this.height = height || 1;
        }
        WebGLRenderTarget.prototype.resize = function (width, height) {
            var gl = this.gl;
            this.width = width;
            this.height = height;
            if (!!this.frameBuffer) {
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
            if (!!this.stencilBuffer) {
                gl.deleteRenderbuffer(this.stencilBuffer);
                this.stencilBuffer = null;
            }
        };
        WebGLRenderTarget.prototype.initFrameBuffer = function () {
            if (!this.frameBuffer) {
                var gl = this.gl;
                this.texture = this.createTexture();
                this.frameBuffer = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            }
        };
        WebGLRenderTarget.prototype.getFrameBuffer = function () {
            if (!this.useFrameBuffer)
                return null;
            return this.frameBuffer;
        };
        WebGLRenderTarget.prototype.createTexture = function () {
            var gl = this.gl;
            var texture = gl.createTexture();
            texture['glContext'] = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        };
        return WebGLRenderTarget;
    }());
    KINGHT.WebGLRenderTarget = WebGLRenderTarget;
})(KINGHT || (KINGHT = {}));
