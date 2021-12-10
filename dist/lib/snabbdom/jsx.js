"use strict";
exports.__esModule = true;
exports.jsx = void 0;
/* eslint-disable @typescript-eslint/no-namespace, import/export */
var vnode_1 = require("./vnode");
var h_1 = require("./h");
function flattenAndFilter(children, flattened) {
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        // filter out falsey children, except 0 since zero can be a valid value e.g inside a chart
        if (child !== undefined &&
            child !== null &&
            child !== false &&
            child !== "") {
            if (Array.isArray(child)) {
                flattenAndFilter(child, flattened);
            }
            else if (typeof child === "string" ||
                typeof child === "number" ||
                typeof child === "boolean") {
                flattened.push((0, vnode_1.vnode)(undefined, undefined, undefined, String(child), undefined));
            }
            else {
                flattened.push(child);
            }
        }
    }
    return flattened;
}
/**
 * jsx/tsx compatible factory function
 * see: https://www.typescriptlang.org/docs/handbook/jsx.html#factory-functions
 */
function jsx(tag, data) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var flatChildren = flattenAndFilter(children, []);
    if (typeof tag === "function") {
        // tag is a function component
        return tag(data, flatChildren);
    }
    else {
        if (flatChildren.length === 1 &&
            !flatChildren[0].sel &&
            flatChildren[0].text) {
            // only child is a simple text node, pass as text for a simpler vtree
            return (0, h_1.h)(tag, data, flatChildren[0].text);
        }
        else {
            return (0, h_1.h)(tag, data, flatChildren);
        }
    }
}
exports.jsx = jsx;
(function (jsx) {
})(jsx = exports.jsx || (exports.jsx = {}));
