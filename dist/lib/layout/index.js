"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Layout = void 0;
var RenderArea_1 = require("../RenderArea");
var utils_1 = require("../utils");
/**
 * 阅读器布局类
 */
var Layout = /** @class */ (function () {
    /**
     * 构造布局对象
     * @param _param 布局参数
     */
    function Layout(_param) {
        this._param = _param;
        document.oncontextmenu = function (event) {
            event.stopPropagation();
            event.preventDefault();
        };
        this._renderContainerEle = (0, utils_1.createElement)("div");
        this._renderContainerEle.className =
            _param.className || "bk-reader-container";
        if (_param.top) {
            this._topContainer = new RenderArea_1.RenderArea(__assign(__assign({}, _param.top), { className: _param.top.className || "bk-reader-container-top" }));
            if (_param.top.content) {
                this._topContainer.renderArea(_param.top.content);
            }
        }
        if (_param.bottom) {
            this._bottomContainer = new RenderArea_1.RenderArea(__assign(__assign({}, _param.bottom), { className: _param.bottom.className || "bk-reader-container-bottom" }));
            if (_param.bottom.content) {
                this._bottomContainer.renderArea(_param.bottom.content);
            }
        }
        if (_param.left) {
            this._leftContainer = new RenderArea_1.RenderArea(__assign(__assign({}, _param.left), { className: _param.left.className || "bk-reader-container-left" }));
            if (_param.left.content) {
                this._leftContainer.renderArea(_param.left.content);
            }
        }
        if (_param.right) {
            this._rightContainer = new RenderArea_1.RenderArea(__assign(__assign({}, _param.right), { className: _param.right.className || "bk-reader-container-right" }));
            if (_param.right.content) {
                this._rightContainer.renderArea(_param.right.content);
            }
        }
        if (_param.center) {
            this._centerContainer = new RenderArea_1.RenderArea(__assign(__assign({}, _param.center), { className: _param.center.className || "bk-reader-container-center" }));
            if (_param.center.content) {
                this._centerContainer.renderArea(_param.center.content);
            }
        }
    }
    /**
     * 渲染布局内容到HTML元素或虚拟节点
     * @param ele 渲染到的HTML元素或虚拟节点
     */
    Layout.prototype.renderTo = function (ele) {
        var _a, _b, _c, _d, _e;
        if (ele instanceof HTMLElement) {
            (_a = this._topContainer) === null || _a === void 0 ? void 0 : _a.renderTo(this._renderContainerEle);
            var centerContainer = (0, utils_1.createElement)("div");
            var defaultClassName = "bk-reader-container-center-container";
            if (!this._bottomContainer ||
                (this._param.bottom && this._param.bottom.hide)) {
                defaultClassName += " no-bottom";
            }
            centerContainer.className = defaultClassName;
            centerContainer.style.width = "100%";
            this._renderContainerEle.appendChild(centerContainer);
            (_b = this._leftContainer) === null || _b === void 0 ? void 0 : _b.renderTo(centerContainer);
            (_c = this._rightContainer) === null || _c === void 0 ? void 0 : _c.renderTo(centerContainer);
            (_d = this._centerContainer) === null || _d === void 0 ? void 0 : _d.renderTo(centerContainer);
            (_e = this._bottomContainer) === null || _e === void 0 ? void 0 : _e.renderTo(this._renderContainerEle);
            ele.innerHTML = "";
            ele.appendChild(this._renderContainerEle);
            return;
        }
        throw new Error("Method not implemented.");
    };
    /**
     * 更新布局内视图
     * @param data 要更新的内容参数
     */
    Layout.prototype.updateView = function (data) {
        var _data = __assign(__assign({}, this._param), data);
        if (this._topContainer && data.top) {
            this._topContainer.updateView(data.top);
        }
        if (this._bottomContainer && data.bottom) {
            this._bottomContainer.updateView(data.bottom);
        }
        if (this._leftContainer && data.left) {
            this._leftContainer.updateView(data.left);
        }
        if (this._rightContainer && data.right) {
            this._rightContainer.updateView(data.right);
        }
    };
    ;
    return Layout;
}());
exports.Layout = Layout;
