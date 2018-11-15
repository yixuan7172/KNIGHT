"use strict";
var F = (function () {
    function F() {
        this.__name = '';
    }
    Object.defineProperty(F.prototype, "name", {
        get: function () {
            return this.__name;
        },
        enumerable: true,
        configurable: true
    });
    F.prototype.con = function () {
        console.log('1111111111');
    };
    return F;
}());
var FF = (function () {
    function FF() {
    }
    FF.prototype.getN = function () {
        return 1;
    };
    return FF;
}());
