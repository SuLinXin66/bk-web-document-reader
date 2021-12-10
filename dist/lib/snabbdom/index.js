"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.jsx = exports.styleModule = exports.propsModule = exports.eventListenersModule = exports.datasetModule = exports.classModule = exports.attributesModule = exports.h = exports.toVNode = exports.primitive = exports.array = exports.attachTo = exports.vnode = exports.thunk = exports.init = exports.htmlDomApi = void 0;
// core
var htmldomapi_1 = require("./htmldomapi");
__createBinding(exports, htmldomapi_1, "htmlDomApi");
var init_1 = require("./init");
__createBinding(exports, init_1, "init");
var thunk_1 = require("./thunk");
__createBinding(exports, thunk_1, "thunk");
var vnode_1 = require("./vnode");
__createBinding(exports, vnode_1, "vnode");
// helpers
var attachto_1 = require("./helpers/attachto");
__createBinding(exports, attachto_1, "attachTo");
var is_1 = require("./is");
__createBinding(exports, is_1, "array");
__createBinding(exports, is_1, "primitive");
var tovnode_1 = require("./tovnode");
__createBinding(exports, tovnode_1, "toVNode");
var h_1 = require("./h");
__createBinding(exports, h_1, "h");
// types
__exportStar(require("./hooks"), exports);
// modules
var attributes_1 = require("./modules/attributes");
__createBinding(exports, attributes_1, "attributesModule");
var class_1 = require("./modules/class");
__createBinding(exports, class_1, "classModule");
var dataset_1 = require("./modules/dataset");
__createBinding(exports, dataset_1, "datasetModule");
var eventlisteners_1 = require("./modules/eventlisteners");
__createBinding(exports, eventlisteners_1, "eventListenersModule");
var props_1 = require("./modules/props");
__createBinding(exports, props_1, "propsModule");
var style_1 = require("./modules/style");
__createBinding(exports, style_1, "styleModule");
// JSX
var jsx_1 = require("./jsx");
__createBinding(exports, jsx_1, "jsx");
