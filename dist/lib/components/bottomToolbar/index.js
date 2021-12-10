"use strict";
exports.__esModule = true;
exports.BottomToolbar = void 0;
var snabbdom_1 = require("../../snabbdom");
var utils_1 = require("../../utils");
var BottomToolbar = /** @class */ (function () {
    function BottomToolbar(_param) {
        var _this = this;
        this._param = _param;
        this._styles = {};
        this._className = ".bk-reader-bottom-tool-toolbars";
        this._views = function () {
            var className = _this._className;
            return (0, snabbdom_1.h)("div" + className);
        };
        if (_param) {
            if (_param.className) {
                this._className = "." + _param.className.split(" ").join(".");
            }
            if (_param.styles) {
                this._styles = _param.styles;
            }
        }
        this._vm_node = this._views();
        this._vm_patch = (0, snabbdom_1.init)([
            snabbdom_1.propsModule,
            snabbdom_1.styleModule,
            snabbdom_1.eventListenersModule,
            snabbdom_1.classModule,
            snabbdom_1.attributesModule,
            snabbdom_1.datasetModule,
        ]);
    }
    BottomToolbar.prototype.renderTo = function (ele) {
        if (ele instanceof HTMLElement) {
            var tmpEle = (0, utils_1.createElement)("div");
            ele.appendChild(tmpEle);
            this._vm_node = this._vm_patch(tmpEle, this._vm_node);
            return;
        }
        throw new Error("Method not implemented.");
    };
    return BottomToolbar;
}());
exports.BottomToolbar = BottomToolbar;
