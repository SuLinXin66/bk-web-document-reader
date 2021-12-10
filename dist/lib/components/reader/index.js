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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Reader = exports.ReaderType = void 0;
var utils_1 = require("../../utils");
var snabbdom_1 = require("../../snabbdom");
var zoom_1 = require("./tools/zoom");
var asyncLock_1 = require("../../asyncLock");
var contextmenu_1 = require("../contextmenu");
var consts_1 = require("../../consts");
var lock = new asyncLock_1["default"]();
/**
 * 阅读器类型
 */
var ReaderType;
(function (ReaderType) {
    /**
     * 竖着展示所有
     */
    ReaderType[ReaderType["VerticalAll"] = 0] = "VerticalAll";
    /**
     * 横着展示所有
     */
    ReaderType[ReaderType["HorizontalAll"] = 1] = "HorizontalAll";
    /**
     * 单页
     */
    ReaderType[ReaderType["Single"] = 2] = "Single";
})(ReaderType = exports.ReaderType || (exports.ReaderType = {}));
/**
 * 阅读器
 */
var Reader = /** @class */ (function () {
    /**
     * 构造一个阅读器
     * @param _params 构造参数
     */
    function Reader(_params) {
        var _this = this;
        this._params = _params;
        /**
         * className
         * @ignore
         */
        this._className = ".bk-reader-tools-reader";
        /**
         * 图片列表
         * @ignore
         */
        this._imgs = {};
        /**
         * 当前页面索引
         * @ignore
         */
        this._currentIndex = 1;
        /**
         * 是否显示缩放
         * @ignore
         */
        this._showZoom = false;
        /**
         * 阅读器类型
         * @ignore
         */
        this._type = ReaderType.VerticalAll;
        /**
         * 内容移动是否开始
         * @ignore
         */
        this._contentPositionMoveStart = false;
        /**
         * 内容移动x坐标
         * @ignore
         */
        this._contentPositionMovePrevX = 0;
        /**
         * 内容移动y坐标
         * @ignore
         */
        this._contentPositionMovePrevY = 0;
        /**
         * 内容滚动条左侧边距
         * @ignore
         */
        this._contentPositionMoveScrollLeft = 0;
        /**
         * 内容滚动条顶部边距
         * @ignore
         */
        this._contentPositionMoveScrollTop = 0;
        /**
         * 内容是否等待加载
         * @ignore
         */
        this._contentLoading = false;
        /**
         * 内容是否执行过加载
         * @ignore
         */
        this._contentLoadingExecOk = false;
        /**
         * 内容加载是否已经开始
         * @ignore
         */
        this._contentLoadStart = false;
        /**
         * 内容加载框是否自动关闭
         * @ignore
         */
        this._contentLoadingAutoClose = true;
        // private _contentLoadOne: boolean = false;
        /**
         * 拖拽是否开始
         * @ignore
         */
        this._dragSealStart = false;
        /**
         * 印章右键上下文信息
         * @ignore
         */
        this._sealContextParam = undefined;
        /**
         * 内部更新视图
         * @ignore
         */
        this._updateView = function () {
            lock.acquire("updateView", function (done) {
                try {
                    _this._vm_node = _this._vm_patch(_this._vm_node, _this._viewReader());
                }
                finally {
                    done();
                }
            });
        };
        /**
         * 加载页面信息
         * @param fileId 文件ID
         * @param currentPage 当前加载页
         * @ignore
         */
        this._loadPngInfo = function (fileId, currentPage) { return __awaiter(_this, void 0, void 0, function () {
            var pageName, imgInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._currentIndex = currentPage;
                        if (!this._actionLoadInterface.getPageInfo) {
                            throw new Error("为定义获取方法");
                        }
                        pageName = "page-" + currentPage;
                        imgInfo = this._imgs[pageName];
                        if (!!imgInfo) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._actionLoadInterface.getPageInfo(fileId, currentPage)];
                    case 1:
                        imgInfo = _a.sent();
                        this._imgs[pageName] = imgInfo;
                        _a.label = 2;
                    case 2:
                        this._currentImg = imgInfo;
                        this._contentLoading = false;
                        if (this._actionLoadInterface.loadingOk) {
                            this._actionLoadInterface.loadingOk(true, 1);
                        }
                        this._updateView();
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * 加载所有页面
         * @ignore
         */
        this._loadPngAllInfo = function () { return __awaiter(_this, void 0, void 0, function () {
            var imgFileId, id, i, imgInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._actionLoadInterface.getPageInfo) {
                            throw new Error("为定义获取方法");
                        }
                        if (!this._imgFile) {
                            return [2 /*return*/];
                        }
                        imgFileId = this._imgFile.id;
                        this._imgs = {};
                        id = this._imgFile.id;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this._imgFile.totalSize)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._actionLoadInterface.getPageInfo(id, i + 1)];
                    case 2:
                        imgInfo = _a.sent();
                        if (!this._imgFile || this._imgFile.id !== imgFileId) {
                            this._imgFile = undefined;
                            this._contentLoading = false;
                            this._imgs = {};
                            this._currentImg = undefined;
                            this._updateView();
                            return [2 /*return*/];
                        }
                        this._imgs["page-" + (i + 1)] = imgInfo;
                        // this._imgs.push(imgInfo);
                        this._contentLoading = false;
                        if (this._actionLoadInterface.loadingOk) {
                            this._actionLoadInterface.loadingOk(false, i + 1);
                        }
                        this._updateView();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (this._actionLoadInterface.loadingOk) {
                            this._actionLoadInterface.loadingOk(true, this._imgFile.totalSize);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * 构造阅读器虚拟视图节点
         * @returns 阅读器虚拟节点
         * @ignore
         */
        this._viewReader = function () {
            var eleName = "div" + _this._className;
            var style = {
                padding: "18px 5px"
            };
            if (_this._type === ReaderType.HorizontalAll) {
                style.whiteSpace = "nowrap";
            }
            return (0, snabbdom_1.h)(eleName, {
                style: _this._styles
            }, [
                (0, snabbdom_1.h)("div", (0, snabbdom_1.h)("div.bk-reader-content", {
                    style: style,
                    on: {
                        mousedown: function (event) {
                            var _a;
                            if ((_this._dragSealStart &&
                                ((_a = _this._actionSealInterface) === null || _a === void 0 ? void 0 : _a.addSeal)) ||
                                _this._drageSealAddConfim) {
                                return;
                            }
                            var currentEle = event.target;
                            if (currentEle.tagName.toLocaleLowerCase() !== "img" ||
                                !currentEle.className.includes("page")) {
                                return;
                            }
                            var scrollEle = currentEle.parentElement.parentElement
                                .parentElement;
                            var canScrollLeft = currentEle.scrollWidth - scrollEle.clientWidth;
                            var canScrollTop = currentEle.scrollHeight - scrollEle.clientHeight;
                            if (canScrollTop > 0 || canScrollLeft > 0) {
                                _this._contentPositionMoveStart = true;
                                _this._contentPositionMoveScrollLeft = scrollEle.scrollLeft;
                                _this._contentPositionMoveScrollTop = scrollEle.scrollTop;
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            else {
                                _this._contentPositionMoveStart = false;
                            }
                            _this._contentPositionMovePrevX = event.clientX;
                            _this._contentPositionMovePrevY = event.clientY;
                            _this._updateView();
                        }
                    }
                }, _this._renderReaderContent())),
            ]);
        };
        /**
         * 渲染阅读器内容节点
         * @returns 虚拟节点
         * @ignore
         */
        this._renderReaderContent = function () {
            var vnodes = [];
            var insideLoadingNode = (0, snabbdom_1.h)("div.bk-reader-content-loading", {
                style: {
                    display: _this._contentLoading ? "block" : "none",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    bottom: "0",
                    right: "0"
                }
            }, (0, snabbdom_1.h)("img", {
                props: {
                    width: "120",
                    src: consts_1.loadingGif
                },
                style: {
                    margin: "0 auto",
                    display: "block"
                }
            }));
            if (_this._actionLoadInterface.loading &&
                _this._contentLoading &&
                !_this._contentLoadingExecOk &&
                Object.keys(_this._imgs).length === 0
            // this._imgs.length === 0
            ) {
                _this._contentLoadingExecOk = true;
                var result = _this._actionLoadInterface.loading();
                if (!(typeof result === "boolean" && !result)) {
                    vnodes.push(insideLoadingNode);
                }
                else {
                    _this._contentLoadingAutoClose = false;
                }
            }
            else if (_this._contentLoadingAutoClose) {
                vnodes.push(insideLoadingNode);
            }
            if (!_this._imgFile || _this._imgFile.totalSize === 0) {
                return vnodes;
            }
            if (_this._showZoom) {
                if (!_this._zoom) {
                    _this._zoom = new zoom_1.Zoom(_this);
                }
            }
            var haveZoom = _this._showZoom && !!_this._zoom;
            vnodes.push((0, snabbdom_1.h)("div.mask", {
                style: {
                    cursor: _this._contentPositionMoveStart ? "move" : "default",
                    display: _this._contentPositionMoveStart ? "block" : "none"
                },
                on: {
                    mouseup: function (event) {
                        _this._contentPositionMoveStart = false;
                        _this._updateView();
                    },
                    mousemove: function (event) {
                        if (!_this._contentPositionMoveStart) {
                            return;
                        }
                        var currentX = event.clientX;
                        var currentY = event.clientY;
                        var moveX = _this._contentPositionMovePrevX - currentX;
                        var moveY = _this._contentPositionMovePrevY - currentY;
                        var currentEle = event.target;
                        var scrollEle = currentEle.parentElement;
                        scrollEle.scrollTop = _this._contentPositionMoveScrollTop + moveY;
                        scrollEle.scrollLeft = _this._contentPositionMoveScrollLeft + moveX;
                    }
                }
            }));
            switch (_this._type) {
                case ReaderType.HorizontalAll:
                    if (Object.keys(_this._imgs).length === 0 && !_this._contentLoadStart) {
                        _this._contentLoadStart = true;
                        _this._loadPngAllInfo();
                        return vnodes;
                    }
                    else {
                        // for (let i = 0; i < this._imgs.length; i++) {
                        for (var i in _this._imgs) {
                            var currentPage = parseInt(i.split("-")[1]);
                            var img = _this._imgs[i];
                            vnodes.push(_this._generateImgVnode({
                                currentPage: currentPage,
                                totalPage: _this._imgFile.totalSize,
                                haveZoom: haveZoom,
                                imgInfo: img
                            }, true));
                        }
                    }
                    break;
                case ReaderType.VerticalAll:
                    if (Object.keys(_this._imgs).length === 0 && !_this._contentLoadStart) {
                        _this._contentLoadStart = true;
                        _this._loadPngAllInfo();
                        return vnodes;
                    }
                    else {
                        // for (let i = 0; i < this._imgs.length; i++) {
                        for (var i in _this._imgs) {
                            var currentPage = parseInt(i.split("-")[1]);
                            var img = _this._imgs[i];
                            vnodes.push(_this._generateImgVnode({
                                currentPage: currentPage,
                                totalPage: _this._imgFile.totalSize,
                                haveZoom: haveZoom,
                                imgInfo: img
                            }));
                        }
                    }
                    break;
                case ReaderType.Single:
                    if (!_this._currentImg) {
                        _this._loadPngInfo(_this._imgFile.id, _this._currentIndex);
                        return vnodes;
                    }
                    vnodes.push(_this._generateImgVnode({
                        currentPage: _this._currentIndex,
                        totalPage: _this._imgFile.totalSize,
                        haveZoom: haveZoom,
                        imgInfo: _this._currentImg
                    }));
                    if (!_this._params.page) {
                        break;
                    }
                    if (_this.canPrevPage()) {
                        vnodes.push((0, snabbdom_1.h)("div", {
                            style: {
                                position: "fixed",
                                left: "308px",
                                bottom: "58px",
                                cursor: "pointer",
                                zIndex: "999",
                                userSelect: "none"
                            },
                            on: {
                                click: function (event) {
                                    event.stopPropagation();
                                    event.stopImmediatePropagation();
                                    event.preventDefault();
                                    _this.prevPage();
                                }
                            }
                        }, (0, snabbdom_1.h)("img", {
                            props: {
                                src: consts_1.pagePrevImg,
                                width: "58"
                            }
                        })));
                    }
                    if (_this.canNextPage()) {
                        vnodes.push((0, snabbdom_1.h)("div", {
                            style: {
                                position: "fixed",
                                right: "248px",
                                bottom: "58px",
                                cursor: "pointer",
                                zIndex: "999",
                                userSelect: "none"
                            },
                            on: {
                                click: function (event) {
                                    event.stopPropagation();
                                    event.stopImmediatePropagation();
                                    event.preventDefault();
                                    _this.nextPage();
                                }
                            }
                        }, (0, snabbdom_1.h)("img", {
                            props: {
                                src: consts_1.pageNextImg,
                                width: "58"
                            }
                        })));
                    }
                    break;
                default:
                    return vnodes;
            }
            if (_this._showZoom && _this._zoom && _this._zoom.getNode) {
                vnodes.push(_this._zoom.getNode());
            }
            return vnodes;
        };
        /**
         * 构造页面信息显示节点
         * @param param 参数
         * @param isHorizontalAll 是否垂直显示所有
         * @returns 页面信息节点
         * @ignore
         */
        this._generateImgVnode = function (param, isHorizontalAll) {
            var _a;
            var className = isHorizontalAll ? ".horizontal" : "";
            var pageName = "page-" + param.currentPage;
            var sealInfos = _this._checkSealNode() || {};
            var seals = sealInfos[pageName] || [];
            var width = param.haveZoom
                ? _this._zoom.calcPercentage(param.imgInfo.width)
                : param.imgInfo.width;
            var height = param.haveZoom
                ? _this._zoom.calcPercentage(param.imgInfo.height)
                : param.imgInfo.height;
            var sealNode = null;
            if (_this._dragSealStart &&
                _this._dragSealInfo &&
                pageName === _this._drageSealCurrentPage &&
                ((_a = _this._actionSealInterface) === null || _a === void 0 ? void 0 : _a.addSeal)) {
                var sealWidth = param.haveZoom
                    ? _this._zoom.calcPercentage(_this._dragSealInfo.width)
                    : _this._dragSealInfo.width;
                var sealHegith = param.haveZoom
                    ? _this._zoom.calcPercentage(_this._dragSealInfo.height)
                    : _this._dragSealInfo.height;
                var left = ((_this._drageSealPositionInfo && _this._drageSealPositionInfo.x) || 0) -
                    sealWidth / 2;
                var top_1 = ((_this._drageSealPositionInfo && _this._drageSealPositionInfo.y) || 0) -
                    sealHegith / 2;
                sealNode = (0, snabbdom_1.h)("div", {
                    style: {
                        position: "absolute",
                        left: "0",
                        top: "0",
                        right: "0",
                        bottom: "28px",
                        zIndex: "8",
                        overflow: "hidden"
                    },
                    on: {
                        mousemove: function (event) {
                            if (!_this._dragSealStart ||
                                !_this._dragSealInfo ||
                                _this._drageSealAddConfim) {
                                return;
                            }
                            event.preventDefault();
                            event.stopPropagation();
                            var currentEle = event.target;
                            if (currentEle.tagName.toLocaleLowerCase() === "img") {
                                currentEle = currentEle.parentElement;
                            }
                            var eleRect = currentEle.getBoundingClientRect();
                            var x = event.clientX - eleRect.left;
                            var y = event.clientY - eleRect.top;
                            if (x <= 0 || y <= 0) {
                                _this._drageSealCurrentPage = undefined;
                            }
                            _this._drageSealPositionInfo = {
                                x: x,
                                y: y
                            };
                            _this._updateView();
                        }
                    }
                }, (0, snabbdom_1.h)("img", {
                    props: {
                        src: _this._dragSealInfo.sealImgUrl,
                        width: sealWidth,
                        height: sealHegith
                    },
                    style: {
                        display: _this._drageSealPositionInfo ? "block" : "none",
                        position: "absolute",
                        left: left + "px",
                        top: top_1 + "px",
                        zIndex: "29"
                    },
                    on: {
                        click: function (event) { return __awaiter(_this, void 0, void 0, function () {
                            var pageNum, sealInfo, haveZoom, _a, x, y, widthHalf, heightHalf, pageInfo, signSealInfo, confimEle, result, backData, e_1, signFileInfo, r, e_2, imgInfo, e_3;
                            var _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!this._drageSealCurrentPage ||
                                            !this._dragSealInfo ||
                                            !this._drageSealPositionInfo ||
                                            !((_b = this._actionSealInterface) === null || _b === void 0 ? void 0 : _b.addSeal) ||
                                            !this._actionLoadInterface.getPageInfo) {
                                            this._updateView();
                                            return [2 /*return*/];
                                        }
                                        pageNum = parseInt(this._drageSealCurrentPage.split("-")[1]);
                                        if (isNaN(pageNum)) {
                                            return [2 /*return*/];
                                        }
                                        event.stopPropagation();
                                        event.preventDefault();
                                        sealInfo = this._dragSealInfo;
                                        this._drageSealAddConfim = true;
                                        this._updateView();
                                        haveZoom = this._showZoom && !!this._zoom;
                                        _a = this._drageSealPositionInfo, x = _a.x, y = _a.y;
                                        if (haveZoom) {
                                            x = this._zoom.prcentageRestore(x);
                                            y = this._zoom.prcentageRestore(y);
                                        }
                                        widthHalf = this._dragSealInfo.width / 2;
                                        heightHalf = this._dragSealInfo.height / 2;
                                        pageInfo = this._currentImg;
                                        if (this._type === ReaderType.HorizontalAll ||
                                            this._type === ReaderType.VerticalAll) {
                                            pageInfo = this._imgs[pageNum - 1];
                                        }
                                        y = pageInfo.height - y;
                                        switch (this._dragSealInfo.positionBase) {
                                            case "leftBottom":
                                                x -= widthHalf;
                                                y -= heightHalf;
                                                break;
                                            case "leftTop":
                                                x -= widthHalf;
                                                y += heightHalf;
                                                break;
                                        }
                                        signSealInfo = {
                                            x: x,
                                            y: y,
                                            pageNum: pageNum,
                                            sealInfo: sealInfo
                                        };
                                        if (!((_c = this._actionSealInterface) === null || _c === void 0 ? void 0 : _c.addSealConfim)) return [3 /*break*/, 7];
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 5, , 6]);
                                        result = this._actionSealInterface.addSealConfim(signSealInfo);
                                        backData = void 0;
                                        if (!(result instanceof Promise)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, result];
                                    case 2:
                                        backData = _d.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        backData = result === true;
                                        _d.label = 4;
                                    case 4:
                                        if (!backData) {
                                            this._drageSealAddConfim = undefined;
                                            this._updateView();
                                            return [2 /*return*/];
                                        }
                                        return [3 /*break*/, 6];
                                    case 5:
                                        e_1 = _d.sent();
                                        this._drageSealAddConfim = undefined;
                                        this._updateView();
                                        throw e_1;
                                    case 6: return [3 /*break*/, 9];
                                    case 7: return [4 /*yield*/, new Promise(function (resolve) {
                                            var mask = (0, utils_1.createElement)("div");
                                            mask.style.position = "absolute";
                                            mask.style.top = "0";
                                            mask.style.bottom = "0";
                                            mask.style.right = "0";
                                            mask.style.left = "0";
                                            mask.style.zIndex = "999";
                                            mask.style.userSelect = "none";
                                            var textDiv = (0, utils_1.createElement)("div");
                                            textDiv.style.height = "28px";
                                            textDiv.style.lineHeight = "28px";
                                            textDiv.style.textAlign = "center";
                                            textDiv.style.fontSize = "16px";
                                            textDiv.innerText = "是否确认在此加盖印章!?";
                                            var btnGroupEle = (0, utils_1.createElement)("div");
                                            btnGroupEle.style.lineHeight = "40px";
                                            btnGroupEle.style.textAlign = "center";
                                            var okBtn = (0, utils_1.createElement)("button");
                                            okBtn.innerHTML = "确&nbsp;&nbsp;认";
                                            okBtn.style.display = "inline-block";
                                            okBtn.style.marginRight = "8px";
                                            okBtn.style.background = "rgb(46,113,245)";
                                            okBtn.style.color = "#fff";
                                            okBtn.onclick = function () {
                                                okBtn.setAttribute("disabled", "true");
                                                cancelBtn.setAttribute("disabled", "true");
                                                textDiv.innerText = "正在加盖印章中...";
                                                resolve(mask);
                                            };
                                            btnGroupEle.appendChild(okBtn);
                                            var cancelBtn = (0, utils_1.createElement)("button");
                                            okBtn.style.display = "inline-block";
                                            cancelBtn.innerHTML = "取&nbsp;&nbsp;消";
                                            cancelBtn.onclick = function () {
                                                mask.remove();
                                                resolve(undefined);
                                            };
                                            btnGroupEle.appendChild(cancelBtn);
                                            var triangleEle = (0, utils_1.createElement)("div");
                                            triangleEle.style.borderLeft = "12px solid transparent";
                                            triangleEle.style.borderRight = "12px solid transparent";
                                            triangleEle.style.borderTop = "12px solid #888";
                                            triangleEle.style.borderBottom = "12px solid transparent";
                                            triangleEle.style.position = "absolute";
                                            triangleEle.style.bottom = "-25px";
                                            triangleEle.style.left = "65px";
                                            var promptDivEle = (0, utils_1.createElement)("div");
                                            promptDivEle.style.position = "absolute";
                                            promptDivEle.style.width = "198px";
                                            promptDivEle.style.height = "68px";
                                            promptDivEle.style.border = "2px solid #888";
                                            promptDivEle.style.boxShadow = "0 0 8px #888";
                                            promptDivEle.style.borderRadius = "5px";
                                            promptDivEle.style.background = "#fff";
                                            promptDivEle.style.zIndex = "39";
                                            var y = event.clientY - 68 - 15;
                                            if (y < 0) {
                                                y = 0;
                                            }
                                            var x = event.clientX - 78;
                                            if (x < 0) {
                                                x = 0;
                                            }
                                            promptDivEle.style.top = y + "px";
                                            promptDivEle.style.left = x + "px";
                                            promptDivEle.appendChild(textDiv);
                                            promptDivEle.appendChild(btnGroupEle);
                                            promptDivEle.appendChild(triangleEle);
                                            mask.appendChild(promptDivEle);
                                            document.body.appendChild(mask);
                                        })];
                                    case 8:
                                        confimEle = _d.sent();
                                        if (!confimEle) {
                                            this._drageSealAddConfim = false;
                                            this._updateView();
                                            return [2 /*return*/];
                                        }
                                        _d.label = 9;
                                    case 9:
                                        _d.trys.push([9, 13, , 14]);
                                        r = this._actionSealInterface.addSeal(signSealInfo);
                                        if (!(r instanceof Promise)) return [3 /*break*/, 11];
                                        return [4 /*yield*/, r];
                                    case 10:
                                        signFileInfo = _d.sent();
                                        return [3 /*break*/, 12];
                                    case 11:
                                        signFileInfo = r;
                                        _d.label = 12;
                                    case 12: return [3 /*break*/, 14];
                                    case 13:
                                        e_2 = _d.sent();
                                        console.warn("调用签章方法出错, 签章终止,错误信息: ", e_2.message);
                                        if (confimEle) {
                                            confimEle.remove();
                                        }
                                        this._drageSealAddConfim = false;
                                        this._updateView();
                                        return [2 /*return*/];
                                    case 14:
                                        this._imgFile = signFileInfo;
                                        if (!signFileInfo) {
                                            if (confimEle) {
                                                confimEle.remove();
                                            }
                                            this._drageSealAddConfim = false;
                                            this._updateView();
                                            return [2 /*return*/];
                                        }
                                        console.log("文件信息: ", signFileInfo);
                                        _d.label = 15;
                                    case 15:
                                        _d.trys.push([15, 17, 18, 19]);
                                        return [4 /*yield*/, this._actionLoadInterface.getPageInfo(signFileInfo.id, pageNum)];
                                    case 16:
                                        imgInfo = _d.sent();
                                        if (this._type === ReaderType.HorizontalAll ||
                                            this._type === ReaderType.VerticalAll) {
                                            this._imgs[pageNum - 1] = imgInfo;
                                        }
                                        else {
                                            this._currentImg = imgInfo;
                                        }
                                        if (confimEle) {
                                            confimEle.remove();
                                        }
                                        return [3 /*break*/, 19];
                                    case 17:
                                        e_3 = _d.sent();
                                        console.warn("获取签章之后的文件失败: ", e_3.message);
                                        return [3 /*break*/, 19];
                                    case 18:
                                        if (confimEle) {
                                            confimEle.remove();
                                        }
                                        this._drageSealAddConfim = false;
                                        this._updateView();
                                        return [7 /*endfinally*/];
                                    case 19: return [2 /*return*/];
                                }
                            });
                        }); }
                    }
                }));
            }
            var style = {
                position: "relative"
            };
            if (isHorizontalAll) {
                style.marginLeft = "28px";
                // style.float = "left";
                style.display = "inline-block";
            }
            return (0, snabbdom_1.h)("div.file-img" + className, {
                style: style
            }, [
                (0, snabbdom_1.h)("div", {
                    style: {
                        position: "absolute",
                        bottom: isHorizontalAll ? "28px" : "8px",
                        left: "49%",
                        color: "#888"
                    }
                }, param.currentPage + " / " + param.totalPage + "\u9875"),
                (0, snabbdom_1.h)("div.bk-rdear-content-img", {
                    style: {
                        width: width + "px",
                        height: height + "px",
                        border: "1px solid #888",
                        boxShadow: "0 0 8px #888",
                        paddingBottom: "28px",
                        position: "relative",
                        overflow: "hidden"
                    }
                }, __spreadArray(__spreadArray([], seals, true), [
                    sealNode,
                    (0, snabbdom_1.h)("img." + pageName, {
                        props: {
                            width: width,
                            height: height,
                            src: param.imgInfo.url
                        },
                        on: {
                            mousedown: function (event) {
                                var _a;
                                event.preventDefault();
                                if (_this._dragSealStart &&
                                    _this._dragSealInfo &&
                                    ((_a = _this._actionSealInterface) === null || _a === void 0 ? void 0 : _a.addSeal)) {
                                    event.stopPropagation();
                                    return;
                                }
                                _this.cancelDragSeal();
                            },
                            mousemove: function (event) {
                                var _a;
                                if (!_this._dragSealStart ||
                                    !_this._dragSealInfo ||
                                    !((_a = _this._actionSealInterface) === null || _a === void 0 ? void 0 : _a.addSeal)) {
                                    return;
                                }
                                event.stopPropagation();
                                event.preventDefault();
                                _this._drageSealCurrentPage = event.target.className;
                                _this._updateView();
                            }
                        }
                    }),
                ], false)),
            ]);
        };
        /**
         * 检测页面上的印章信息
         * @returns 页面上的印章信息
         * @ignore
         */
        this._checkSealNode = function () {
            if (!_this._imgFile || !_this._imgFile.signatures) {
                return null;
            }
            if (!_this._sealContextParam ||
                (!_this._sealContextParam.event && !_this._sealContextParam.menuItems)) {
                return null;
            }
            var sealInfos = {};
            for (var i = 0; i < _this._imgFile.signatures.length; i++) {
                var signature = _this._imgFile.signatures[i];
                var pageName = "page-" + signature.page;
                var pageSeals = sealInfos[pageName];
                if (!pageSeals) {
                    pageSeals = [];
                    sealInfos[pageName] = pageSeals;
                }
                var haveZoom = _this._showZoom && !!_this._zoom;
                var _a = signature.position, x1 = _a.x1, x2 = _a.x2, y1 = _a.y1, y2 = _a.y2;
                if (haveZoom) {
                    x1 = _this._zoom.calcPercentage(x1);
                    x2 = _this._zoom.calcPercentage(x2);
                    y1 = _this._zoom.calcPercentage(y1);
                    y2 = _this._zoom.calcPercentage(y2);
                }
                // 28是阅读器的padding-bottom
                // 2 是边框大小
                var bottom = y1 + 28 - 2 + "px";
                var left = x1 - 2 + "px";
                var width = x2 - x1 + "px";
                var height = y2 - y1 + "px";
                pageSeals.push((0, snabbdom_1.h)("div.seal-node", {
                    on: {
                        contextmenu: _this._sealContextParam.event ||
                            (function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                document.body.click();
                                var currentEle = event.target;
                                currentEle.style.border = "2px solid red";
                                currentEle.style.background = "rgba(255, 0,0,.2)";
                                var contextMenuDiv = (0, utils_1.createElement)("div");
                                contextMenuDiv.style.position = "absolute";
                                contextMenuDiv.style.top = event.clientY + "px";
                                contextMenuDiv.style.left = event.clientX + "px";
                                var menuItems = _this._sealContextParam.menuItems;
                                var contextMenu = new contextmenu_1.ContextMenu({
                                    menuItems: menuItems
                                });
                                contextMenu.renderTo(contextMenuDiv);
                                document.body.appendChild(contextMenuDiv);
                                var documentClick = function () {
                                    contextMenuDiv.remove();
                                    currentEle.style.border = "";
                                    currentEle.style.background = "";
                                    document.removeEventListener("click", documentClick);
                                };
                                document.addEventListener("click", documentClick);
                            })
                    },
                    style: {
                        position: "absolute",
                        bottom: bottom,
                        left: left,
                        width: width,
                        height: height
                    }
                }));
            }
            return sealInfos;
        };
        /**
         * 鼠标移动事件
         * @ignore
         */
        this._documentMouseMoveEvent = function () {
            if (!_this._dragSealStart ||
                !_this._dragSealInfo ||
                !_this._drageSealCurrentPage ||
                _this._drageSealAddConfim) {
                return;
            }
            _this._drageSealCurrentPage = undefined;
            _this._updateView();
        };
        /**
         * 是否可以进行页面操作
         * @returns 是/否
         * @ignore
         */
        this._canPageOperation = function () {
            return (_this._type === ReaderType.Single &&
                _this._imgFile &&
                _this._imgFile.totalSize > 1);
        };
        /**
         * 更新阅读器内容
         * @param data 更新参数
         */
        this.updateView = function (data) {
            if (data) {
                if (data.sealContextMenu) {
                    _this._sealContextParam = __assign(__assign({}, _this._sealContextParam), data.sealContextMenu);
                }
                if (data.action && data.action.loadFileInterface) {
                    _this._actionLoadInterface = __assign(__assign({}, _this._actionLoadInterface), data.action.loadFileInterface);
                }
                if (data.type) {
                    _this._type = data.type;
                }
                if (data.zoom) {
                    if (data.zoom.show) {
                        _this._showZoom = true;
                    }
                    else {
                        _this._showZoom = false;
                    }
                    if (data.zoom.zoomInterface) {
                        _this._zoom = data.zoom.zoomInterface;
                    }
                }
            }
            _this._updateView();
        };
        document.addEventListener("mousemove", this._documentMouseMoveEvent);
        this._sealContextParam = _params.sealContextMenu;
        this._actionLoadInterface = _params.action.loadFileInterface;
        if (_params.action.sealInterface) {
            this._actionSealInterface = _params.action.sealInterface;
        }
        if (_params.className) {
            this._className = _params.className;
        }
        this._styles = _params.styles;
        if (_params.type) {
            this._type = _params.type;
        }
        if (_params.zoom) {
            if (_params.zoom.show) {
                this._showZoom = true;
            }
            else {
                this._showZoom = false;
            }
            if (_params.zoom.zoomInterface) {
                this._zoom = _params.zoom.zoomInterface;
            }
        }
        this._vm_node = this._viewReader();
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
     * 让一个印章跟随鼠标在阅读器内显示
     * @param sealInfo 印章信息
     */
    Reader.prototype.dragSeal = function (sealInfo) {
        if (!this._actionSealInterface) {
            console.warn("没有可用的盖章动作，拖拽盖章事件被忽略");
            this.cancelDragSeal();
            return;
        }
        if (!sealInfo.positionBase) {
            sealInfo.positionBase = "center";
        }
        this._dragSealStart = true;
        this._dragSealInfo = sealInfo;
        this._drageSealPositionInfo = undefined;
        this._updateView();
    };
    /**
     * 取消印章的鼠标跟随效果.
     */
    Reader.prototype.cancelDragSeal = function () {
        this._dragSealStart = false;
        this._dragSealInfo = undefined;
        this._drageSealPositionInfo = undefined;
        this._drageSealCurrentPage = undefined;
        this._updateView();
    };
    /**
     * 将阅读器内容渲染到HTML节点上
     * @param ele 要渲染到的元素
     */
    Reader.prototype.renderTo = function (ele) {
        if (ele instanceof HTMLElement) {
            var tmpEle = (0, utils_1.createElement)("div");
            ele.appendChild(tmpEle);
            this._vm_node = this._vm_patch(tmpEle, this._vm_node);
            return;
        }
        throw new Error("Method not implemented.");
    };
    /**
     * 加载文件
     * @param file 要加载的文件信息
     */
    Reader.prototype.loadFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var haveElectron, haveReader, fileReader, _a, _b, _c, _d, e_4;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this._contentLoading = true;
                        this._contentLoadingExecOk = false;
                        this._contentLoadStart = false;
                        this._imgFile = undefined;
                        this._contentLoadingAutoClose = true;
                        this._currentIndex = 1;
                        this._currentImg = undefined;
                        // this._contentLoadOne = false;
                        this._updateView();
                        haveElectron = !!window.require;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 13, , 14]);
                        if (!(file instanceof File)) return [3 /*break*/, 7];
                        haveReader = window.FileReader;
                        if (!this._actionLoadInterface.filePathConvert &&
                            !this._actionLoadInterface.fileReaderConvert &&
                            !this._actionLoadInterface.fileConvertPng) {
                            throw new Error("未能找到可用的文件获取方式");
                        }
                        if (!(haveReader && this._actionLoadInterface.fileReaderConvert)) return [3 /*break*/, 3];
                        fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        _a = this;
                        return [4 /*yield*/, this._actionLoadInterface.fileReaderConvert(fileReader)];
                    case 2:
                        _a._imgFile = _e.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!this._actionLoadInterface.fileConvertPng) return [3 /*break*/, 5];
                        _b = this;
                        return [4 /*yield*/, this._actionLoadInterface.fileConvertPng(file)];
                    case 4:
                        _b._imgFile = _e.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new Error("没有环境可用的文件获取方式");
                    case 6: return [3 /*break*/, 12];
                    case 7:
                        if (!(haveElectron && this._actionLoadInterface.filePathConvert)) return [3 /*break*/, 9];
                        _c = this;
                        return [4 /*yield*/, this._actionLoadInterface.filePathConvert(file)];
                    case 8:
                        _c._imgFile = _e.sent();
                        return [3 /*break*/, 12];
                    case 9:
                        if (!this._actionLoadInterface.fileBase64Convert) return [3 /*break*/, 11];
                        _d = this;
                        return [4 /*yield*/, this._actionLoadInterface.fileBase64Convert(file)];
                    case 10:
                        _d._imgFile = _e.sent();
                        return [3 /*break*/, 12];
                    case 11: throw new Error("未被实现的文件获取方式");
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        e_4 = _e.sent();
                        this._contentLoading = false;
                        this._updateView();
                        throw e_4;
                    case 14:
                        if (!this._imgFile) {
                            this._contentLoading = false;
                            this.updateView();
                            throw new Error("文件信息加载失败");
                        }
                        this._currentImg = undefined;
                        this._imgs = {};
                        this._updateView();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 下一页(`type=ReaderType.Signle 时生效`)
     */
    Reader.prototype.nextPage = function () {
        if (!this.canNextPage()) {
            console.warn("不支持分页操作或已加载至末尾");
            return;
        }
        this._currentIndex += 1;
        this._currentImg = undefined;
        this._contentLoading = true;
        this._contentLoadingExecOk = false;
        this._contentLoadStart = false;
        this._contentLoadingAutoClose = true;
        this._updateView();
    };
    /**
     * 上一页(`type=ReaderType.Signle 时生效`)
     */
    Reader.prototype.prevPage = function () {
        if (!this.canPrevPage()) {
            console.warn("不支持分页操作或已加载至顶端");
            return;
        }
        this._currentIndex -= 1;
        this._currentImg = undefined;
        this._contentLoading = true;
        this._contentLoadingExecOk = false;
        this._contentLoadStart = false;
        this._contentLoadingAutoClose = true;
        this._updateView();
    };
    /**
     * 是否有下一页(`type=ReaderType.Signle 时生效`)
     * @returns 是/否
     */
    Reader.prototype.canNextPage = function () {
        return (this._canPageOperation() && this._currentIndex < this._imgFile.totalSize);
    };
    /**
     * 是否有上一页(`type=ReaderType.Signle 时生效`)
     * @returns 是/否
     */
    Reader.prototype.canPrevPage = function () {
        return this._canPageOperation() && this._currentIndex > 1;
    };
    /**
     * 是否可以进行分页切换操作(`type=ReaderType.Signle 时生效`)
     * @returns 是/否
     */
    Reader.prototype.canPage = function () {
        return this._canPageOperation();
    };
    /**
     * 跳转到指定页码(`type=ReaderType.Signle 时生效`)
     * @param page 要跳转的页面
     */
    Reader.prototype.breakPage = function (page) {
        if (!this.canPage()) {
            console.warn("不支持分页操作");
            return;
        }
        if (page < 1 || page > this._imgFile.totalSize) {
            console.warn("要跳转的页面范围不正确, 应大于等于1并且小于等于" +
                this._imgFile.totalSize);
            return;
        }
        this._currentIndex = page;
        this._currentImg = undefined;
        this._contentLoading = true;
        this._contentLoadingExecOk = false;
        this._contentLoadStart = false;
        this._contentLoadingAutoClose = true;
        this._updateView();
    };
    /**
     * 当前页码(`type=ReaderType.Signle 时生效`)
     * @returns 页码
     */
    Reader.prototype.currentPage = function () {
        if (!this.canPage()) {
            throw new Error("不支持分页操作无法获取当前页");
        }
        return this._currentIndex;
    };
    /**
     * 总页数(`type=ReaderType.Signle 时生效`)
     * @returns 总页数
     */
    Reader.prototype.totalPageSize = function () {
        if (!this.canPage()) {
            throw new Error("不支持分页操作无法获取当前页");
        }
        return this._imgFile.totalSize;
    };
    return Reader;
}());
exports.Reader = Reader;
