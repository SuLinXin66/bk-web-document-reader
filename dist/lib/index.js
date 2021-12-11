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
exports.render = exports.utils = exports.snabbdom = exports.reader = exports.sideToolbar = exports.toolbar = exports.layout = exports.actions = exports.newReader = void 0;
var AutoRender_1 = require("./render/AutoRender");
require("./style");
require("./compatible");
/**
 * 创建阅读器
 * @param ele 要绑定的元素
 * @returns 阅读器对外工作对象
 */
function newReader(ele) {
    return new AutoRender_1.AutoRender(ele);
}
exports.newReader = newReader;
exports.actions = require("./action/interface");
exports.layout = require("./layout");
exports.toolbar = require("./components/toolbars");
exports.sideToolbar = require("./components/sideToolbar");
exports.reader = require("./components/reader");
exports.snabbdom = require("./snabbdom");
exports.utils = require("./utils");
exports.render = require("./render/AutoRender");
__exportStar(require("./render/AutoRender"), exports);
