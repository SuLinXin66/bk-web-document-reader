"use strict";
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
