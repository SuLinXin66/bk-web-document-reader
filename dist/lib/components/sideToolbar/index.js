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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SideToolbar = void 0;
var snabbdom_1 = require("../../snabbdom");
var utils_1 = require("../../utils");
/**
 * 侧边栏
 */
var SideToolbar = /** @class */ (function () {
    /**
     * 构造一个侧边栏对象
     * @param params 构造参数
     */
    function SideToolbar(params) {
        var _this = this;
        /**
         * className
         * @ignore
         */
        this._className = ".bk-reader-side-tool-toolbars";
        /**
         * 样式
         * @ignore
         */
        this._styles = {};
        /**
         * 工具条元素
         * @ignore
         */
        this._toolNodes = [];
        /**
         * 更新侧边栏内容
         */
        this.updateView = function () {
            _this._vm_node = _this._vm_patch(_this._vm_node, _this._views());
        };
        if (params) {
            if (params.className) {
                this._className = "." + params.className.split(" ").join(".");
            }
            if (params.styles) {
                this._styles = params.styles;
            }
            if (params.nodes) {
                this._toolNodes = params.nodes;
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
    /**
     * 将侧边栏渲染到指定的HTML元素中
     * @param ele 要渲染到的元素
     */
    SideToolbar.prototype.renderTo = function (ele) {
        if (ele instanceof HTMLElement) {
            var tmpEle = (0, utils_1.createElement)("div");
            ele.appendChild(tmpEle);
            this._vm_node = this._vm_patch(tmpEle, this._vm_node);
            return;
        }
        throw new Error("Method not implemented.");
    };
    /**
     * 侧边栏内容视图
     * @returns 虚拟节点
     * @ignore
     */
    SideToolbar.prototype._views = function () {
        var _this = this;
        var eleName = "div" +
            this._className +
            (typeof this._activeContentIndex !== "undefined" ? ".active" : "");
        var btnNodes = [];
        var contentNodes = [];
        var _loop_1 = function (i) {
            var info = this_1._toolNodes[i];
            var btnVnode = null;
            if (info.node) {
                if (info.node instanceof HTMLElement) {
                    btnVnode = (0, utils_1.htmlElementConvertToVNode)(info.node);
                }
                else {
                    btnVnode = info.node;
                }
            }
            else if (info.imageUrl) {
                btnVnode = (0, snabbdom_1.h)("img", {
                    props: {
                        src: info.imageUrl,
                        alt: info.text,
                        width: "38",
                        height: "38",
                        title: info.text
                    },
                    style: {
                        display: "inline-block",
                        borderRadius: "5px",
                        boxShadow: "0 0 6px #6e6e6e",
                        border: "1px solid #6e6e6e",
                        cursor: "pointer"
                    }
                });
            }
            else if (info.text) {
                btnVnode = (0, snabbdom_1.h)("div.side-toolbar-btn-ele", info.text);
            }
            btnNodes.push((0, snabbdom_1.h)("li" + (this_1._activeContentIndex === i ? ".active" : ""), [
                (0, snabbdom_1.h)("div.side-toolbar-btn", {
                    style: {
                        display: "block",
                        height: "38px",
                        textAlign: "center",
                        padding: "16px 0"
                    },
                    on: __assign(__assign({}, info.on), { click: function (event) { return __awaiter(_this, void 0, void 0, function () {
                            var activeContentIndex, clickRestult, result, e_1;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (this._activeContentIndex === i) {
                                            activeContentIndex = undefined;
                                        }
                                        else {
                                            activeContentIndex = i;
                                        }
                                        if (!((_a = info.on) === null || _a === void 0 ? void 0 : _a.click)) return [3 /*break*/, 6];
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 5, , 6]);
                                        clickRestult = info.on.click(event, typeof activeContentIndex !== "undefined");
                                        if (!(clickRestult instanceof Promise)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, clickRestult];
                                    case 2:
                                        result = _b.sent();
                                        if (typeof result === "boolean" && !result) {
                                            return [2 /*return*/];
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        if (typeof clickRestult === "boolean" &&
                                            !clickRestult) {
                                            return [2 /*return*/];
                                        }
                                        _b.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        e_1 = _b.sent();
                                        console.log("自定义单击事件执行失败: ", e_1.message);
                                        return [2 /*return*/];
                                    case 6:
                                        this._activeContentIndex = activeContentIndex;
                                        this.updateView();
                                        return [2 /*return*/];
                                }
                            });
                        }); } })
                }, btnVnode),
            ]));
            if (!info.contents) {
                return "continue";
            }
            info.contents.forEach(function (content) {
                var vnode;
                if (content.ele instanceof HTMLElement) {
                    vnode = (0, utils_1.htmlElementConvertToVNode)(content.ele, content.on);
                }
                else {
                    vnode = (0, utils_1.vnodeConvert)(content.ele);
                }
                contentNodes.push((0, snabbdom_1.h)("li", {
                    style: {
                        display: _this._activeContentIndex === i ? "block" : "none"
                    }
                }, vnode));
            });
        };
        var this_1 = this;
        for (var i = 0; i < this._toolNodes.length; i++) {
            _loop_1(i);
        }
        return (0, snabbdom_1.h)(eleName, {
            style: __assign({}, this._styles)
        }, [
            (0, snabbdom_1.h)("ul.bk-reader-side-toolbars-btn-group", btnNodes),
            (0, snabbdom_1.h)("ul.bk-reader-side-toobars-content-group", {
                style: {}
            }, contentNodes),
        ]);
    };
    return SideToolbar;
}());
exports.SideToolbar = SideToolbar;
