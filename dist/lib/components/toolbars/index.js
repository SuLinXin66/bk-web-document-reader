"use strict";
exports.__esModule = true;
exports.Toolbars = void 0;
var snabbdom_1 = require("../../snabbdom");
var utils_1 = require("../../utils");
/**
 * 工具栏.
 */
var Toolbars = /** @class */ (function () {
    /**
     * 构造工具条
     * @param params 工具条构造属性
     */
    function Toolbars(params) {
        /**
         * 按钮组.
         * @ignore
         */
        this._btns = [];
        /**
         * className.
         * @ignore
         */
        this._className = ".bk-reader-tool-toolbars";
        /**
         * 工具条样式
         * @ignore
         */
        this._styles = {};
        if (params) {
            if (params.className) {
                this._className = "." + params.className.split(" ").join(".");
            }
            if (params.styles) {
                this._styles = params.styles;
            }
            if (params.btns && params.btns.length > 0) {
                this._btns = params.btns;
            }
        }
        this._vm_node = this.viewsWithBtns();
        this._vm_patch = (0, snabbdom_1.init)([
            snabbdom_1.propsModule,
            snabbdom_1.styleModule,
            snabbdom_1.eventListenersModule,
            snabbdom_1.classModule,
            snabbdom_1.attributesModule,
            snabbdom_1.datasetModule,
        ]);
    }
    /**
     * 更新视图
     */
    Toolbars.prototype.updateView = function () {
        this._vm_node = this._vm_patch(this._vm_node, this.viewsWithBtns());
    };
    /**
     * 渲染工具条到HTML元素或虚拟节点上
     * @param ele 要渲染到的HTML元素或虚拟节点
     */
    Toolbars.prototype.renderTo = function (ele) {
        if (ele instanceof HTMLElement) {
            var tmpEle = (0, utils_1.createElement)("div");
            ele.appendChild(tmpEle);
            this._vm_node = this._vm_patch(tmpEle, this._vm_node);
            return;
        }
        throw new Error("Method not implemented.");
    };
    // renderTo(ele: HTMLElement): void {
    //   const tmpEle = createElement("div");
    //   ele.appendChild(tmpEle);
    //   this._vm_node = this._vm_patch(tmpEle, this._vm_node);
    // }
    /**
     * 获取工具条的虚拟节点
     * @returns 虚拟节点
     * @ignore
     */
    Toolbars.prototype.viewsWithBtns = function () {
        var eleName = "div" + this._className;
        return (0, snabbdom_1.h)(eleName, {
            style: this._styles
        }, [
            (0, snabbdom_1.h)("ul", this._btns.map(function (btn) {
                if (btn.type === "ele") {
                    if (btn.ele) {
                        return (0, utils_1.htmlElementConvertToVNode)(btn.ele, btn.on);
                    }
                    return (0, snabbdom_1.h)("div");
                }
                var btnClassName = "radius.bk-reader-tool-btn-text";
                if (btn.type) {
                    switch (btn.type) {
                        case "icon":
                            btnClassName = "radius.bk-reader-tool-btn-icon";
                            break;
                        case "text-icon":
                            btnClassName = "bk-reader-tool-btn-text-icon";
                            break;
                    }
                }
                return (0, snabbdom_1.h)("li.bk-reader-tool-btn", {
                    key: btn.text
                }, [
                    (0, snabbdom_1.h)("button." + btnClassName, {
                        props: {
                            title: btn.text
                        },
                        on: btn.on
                    }, btn.text),
                ]);
            })),
        ]);
    };
    return Toolbars;
}());
exports.Toolbars = Toolbars;
