"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
if ((0, utils_1.isIE)()) {
    var origDefineProperty_1 = Object.defineProperty;
    var arePropertyDescriptorsSupported = function () {
        var obj = {};
        try {
            origDefineProperty_1(obj, "x", { enumerable: false, value: obj });
            for (var _ in obj) {
                return false;
            }
            return obj.x === obj;
        }
        catch (e) {
            /* this is IE 8. */
            return false;
        }
    };
    var supportsDescriptors = origDefineProperty_1 && arePropertyDescriptorsSupported();
    if (!supportsDescriptors) {
        Object.defineProperty = function (a, b, c) {
            //IE8支持修改元素节点的属性
            if (origDefineProperty_1 && a.nodeType == 1) {
                return origDefineProperty_1(a, b, c);
            }
            else {
                a[b] = c.value || (c.get && c.get());
            }
        };
    }
}
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: https://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function (callback /*, thisArg*/) {
        var T, A, k;
        if (this == null) {
            throw new TypeError("this is null or not defined");
        }
        // 1. Let O be the result of calling ToObject passing the |this|
        //    value as the argument.
        var O = Object(this);
        // 2. Let lenValue be the result of calling the Get internal
        //    method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;
        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: https://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = arguments[1];
        }
        // 6. Let A be a new array created as if by the expression new Array(len)
        //    where Array is the standard built-in constructor with that name and
        //    len is the value of len.
        A = new Array(len);
        // 7. Let k be 0
        k = 0;
        // 8. Repeat, while k < len
        while (k < len) {
            var kValue, mappedValue;
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {
                // i. Let kValue be the result of calling the Get internal
                //    method of O with argument Pk.
                kValue = O[k];
                // ii. Let mappedValue be the result of calling the Call internal
                //     method of callback with T as the this value and argument
                //     list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);
                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor
                // { Value: mappedValue,
                //   Writable: true,
                //   Enumerable: true,
                //   Configurable: true },
                // and false.
                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, k, {
                //   value: mappedValue,
                //   writable: true,
                //   enumerable: true,
                //   configurable: true
                // });
                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }
        // 9. return A
        return A;
    };
}
