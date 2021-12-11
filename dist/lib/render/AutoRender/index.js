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
exports.AutoRender = void 0;
var layout_1 = require("../../layout");
var reader_1 = require("../../components/reader");
var toolbars_1 = require("../../components/toolbars");
var sideToolbar_1 = require("../../components/sideToolbar");
var bottomToolbar_1 = require("../../components/bottomToolbar");
/**
 * 默认参数.
 */
var defaultReaderParams = {
    toolbars: {
        btns: [
            {
                text: "测试"
            },
        ]
    },
    sideToolbars: {},
    reader: {
        action: {
            loadFileInterface: {
                fileBase64Convert: function () {
                    throw new Error("未实现的方法");
                },
                filePathConvert: function () {
                    throw new Error("未实现的方法");
                },
                fileReaderConvert: function () {
                    throw new Error("未实现的方法");
                },
                getPageInfo: function () {
                    throw new Error("未实现的方法");
                }
            }
        }
    }
};
/**
 * 自动布局阅读器.
 */
var AutoRender = /** @class */ (function () {
    // constructor(layout: Layout, reader: Reader) {
    /**
     * 构造阅读器
     * @param _ele 要绑定到的元素
     */
    function AutoRender(_ele) {
        var _this = this;
        this._ele = _ele;
        /**
         * 初始化布局视图
         * @param params 参数
         */
        this.initView = function (params) {
            var _a;
            if (params === void 0) { params = defaultReaderParams; }
            _this._layoutContent = {};
            // if (!params.toolbars.hide) {
            var toolbars = new toolbars_1.Toolbars(params.toolbars);
            _this._layoutContent.top = __assign(__assign({}, params.toolbars), { content: toolbars });
            // }
            // if (!params.sideTollbars.hide) {
            var sideToobars = new sideToolbar_1.SideToolbar(params.sideToolbars);
            _this._layoutContent.left = __assign(__assign({}, params.sideToolbars), { content: sideToobars });
            // }
            var botttomToolBars = new bottomToolbar_1.BottomToolbar(params.bottomToolbars);
            _this._layoutContent.bottom = __assign(__assign({}, params.bottomToolbars), { hide: !((_a = params.bottomToolbars) === null || _a === void 0 ? void 0 : _a.show), content: botttomToolBars });
            var reader = new reader_1.Reader(params.reader);
            _this._layoutContent.center = {
                content: reader
            };
            _this._layout = new layout_1.Layout(_this._layoutContent);
            _this._reader = reader;
            _this._layout.renderTo(_this._ele);
        };
    }
    /**
     * 更新布局
     * @param data 要更新的数据
     */
    AutoRender.prototype.updateView = function (data) {
        if (!data) {
            data = {};
        }
        if (!this._layout || !this._reader) {
            this.initView(data);
            return;
        }
        if (!this._layoutContent) {
            this._layoutContent = {};
        }
        if (data.sideToolbars) {
            this._layoutContent.left = __assign(__assign({}, this._layoutContent.left), data.sideToolbars);
        }
        if (data.toolbars) {
            this._layoutContent.top = __assign({}, this._layoutContent.top);
        }
        this._layout.updateView(this._layoutContent);
        this._reader.updateView(data.reader);
    };
    /**
     * 加载文件到阅读器中.
     * @param file
     * > 将要加载的文件<br />
     * > 传入字符串:
     * > 1. 浏览器环境 <br />
     * > &nbsp;&nbsp;调用顺序如下(**命中一个终止查找**):<br />
     * > &nbsp;&nbsp;1. {@link ReaderLoadInterface.fileBase64ConvertPng} <br />
     * > &nbsp;&nbsp;2. {@link ReaderLoadInterface.filePathConvertPng} <br />
     * > &nbsp;&nbsp;3. `throw new Error("未被实现的文件获取方式");`
     * > 2. Electron环境<br />
     * > &nbsp;&nbsp;调用顺序如下(**命中一个终止查找**):<br />
     * > &nbsp;&nbsp;1. {@link ReaderLoadInterface.filePathConvertPng} <br />
     * > &nbsp;&nbsp;2. {@link ReaderLoadInterface.fileBase64ConvertPng} <br />
     * > &nbsp;&nbsp;3. `throw new Error("未被实现的文件获取方式");`
     * > 传入File对象:
     * > 1. 当前环境中具有`FileReader`对象.<br/>
     * > &nbsp;&nbsp;调用顺序如下(**命中一个终止查找**):<br />
     * > &nbsp;&nbsp;1. {@link ReaderLoadInterface.fileReaderConvert}
     * > &nbsp;&nbsp;2. {@link ReaderLoadInterface.fileConvertPng}
     * > &nbsp;&nbsp;3. `throw new Error("没有环境可用的文件获取方式");`
     * > 2. 当前环境中不具有`FileReader`对于下部分<br />
     * > &nbsp;&nbsp;调用顺序如下(**命中一个终止查找**):<br />
     * > &nbsp;&nbsp;1. {@link ReaderLoadInterface.fileConvertPng}<br />
     * > &nbsp;&nbsp;2. `throw new Error("没有环境可用的文件获取方式");`
     * @returns 等待加载完成
     */
    AutoRender.prototype.loadFile = function (file) {
        if (!this._reader) {
            throw "请先初始化布局";
        }
        return this._reader.loadFile(file);
    };
    AutoRender.prototype.dragSeal = function (sealInfo) {
        if (!this._reader) {
            throw "请先初始化布局";
        }
        this._reader.dragSeal(sealInfo);
    };
    AutoRender.prototype.cancelDragSeal = function () {
        if (!this._reader) {
            throw "请先初始化布局";
        }
        this._reader.cancelDragSeal();
    };
    return AutoRender;
}());
exports.AutoRender = AutoRender;
