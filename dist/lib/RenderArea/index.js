"use strict";
// import {
//   h,
//   init,
//   styleModule,
//   eventListenersModule,
//   VNode,
//   propsModule,
// } from "../snabbdom";
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
exports.RenderArea = void 0;
var utils_1 = require("../utils");
/**
 * 渲染区域.
 * @ignore
 */
var RenderArea = /** @class */ (function () {
    // 子元素列表
    // private _childEles: HTMLElement[] = [];
    /**
     * 创建对象
     * @ignore
     * @param _param 渲染区域参数
     */
    function RenderArea(_param) {
        var _this = this;
        this._param = _param;
        // 虚拟Dom节点
        // private _vm_dom: VNode;
        // private _vm_patch: (oldVnode: VNode | Element, vnode: VNode) => VNode;
        // 样式
        this._style = {};
        this.updateView = function (data) {
            _this._param = data;
            _this._updateView();
        };
        /**
         * 渲染区域
         * @param renderInterface 渲染接口
         */
        this.renderArea = function (renderInterface) {
            renderInterface.renderTo(_this._container);
        };
        this._container = (0, utils_1.createElement)("div");
        this._updateView();
    }
    RenderArea.prototype._updateView = function () {
        if (this._param.styles) {
            this._style = __assign({}, this._param.styles);
        }
        if (this._param.className) {
            this._container.className = this._param.className;
        }
        if (this._param.hide) {
            this._container.style.display = "none";
        }
        else {
            this._container.style.display = "block";
        }
        for (var key in this._style) {
            this._container.style[key] = this._style[key];
        }
    };
    RenderArea.prototype.renderTo = function (ele) {
        if (ele instanceof HTMLElement) {
            if (this.renderEle) {
                this.renderEle.innerHTML = this.renderEleSrcHtml;
                this.renderEle = undefined;
            }
            this.renderEle = ele;
            this.renderEleSrcHtml = this.renderEle.innerHTML;
            ele.appendChild(this._container);
            // if (!this._vm_dom) {
            //   return;
            // }
            // this._vm_patch(ele, this._vm_dom);
            return;
        }
        throw new Error("Method not implemented.");
    };
    return RenderArea;
}());
exports.RenderArea = RenderArea;
