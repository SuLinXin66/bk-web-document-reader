"use strict";
exports.__esModule = true;
exports.Zoom = void 0;
var snabbdom_1 = require("../../../../snabbdom");
var Zoom = /** @class */ (function () {
    function Zoom(_reader) {
        var _this = this;
        this._reader = _reader;
        // 当前百分比, 默认百分之百
        this._currentPercentage = 100;
        this.prcentageRestore = function (num) {
            return num / (_this._currentPercentage / 100);
        };
        this.calcPercentage = function (num) {
            return num * (_this._currentPercentage / 100);
        };
        this.getNode = function () {
            return (0, snabbdom_1.h)("div.bk-reader-content-tool-zoom", [
                // 缩小
                (0, snabbdom_1.h)("div.tool-zoom-shrink", {
                    on: {
                        click: function () {
                            _this._currentPercentage -= 1;
                            if (_this._currentPercentage <= 1) {
                                _this._currentPercentage = 1;
                            }
                            _this._reader.updateView();
                        },
                        mousedown: function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            clearInterval(_this._intervalId);
                            _this._intervalId = setInterval(function () {
                                _this._currentPercentage -= 1;
                                _this._reader.updateView();
                            }, 100);
                        }
                    }
                }, "-"),
                // 放大
                (0, snabbdom_1.h)("div.tool-zoom-enlarge", {
                    on: {
                        click: function () {
                            _this._currentPercentage += 1;
                            _this._reader.updateView();
                        },
                        mousedown: function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            clearInterval(_this._intervalId);
                            _this._intervalId = setInterval(function () {
                                _this._currentPercentage += 1;
                                _this._reader.updateView();
                            }, 100);
                        }
                    }
                }, "+"),
                // 当前百分比
                (0, snabbdom_1.h)("div.tool-zoom-current-percentage", [
                    (0, snabbdom_1.h)("input", {
                        on: {
                            keydown: function (event) {
                                var key = parseInt(event.key);
                                var keyStr = event.key.toLowerCase();
                                var isAllowKey = keyStr === "arrowleft" ||
                                    keyStr === "backspace" ||
                                    keyStr === "arrowright" ||
                                    keyStr === "delete";
                                //   console.log(isAllowKey);
                                if (isNaN(key)) {
                                    if (!isAllowKey) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        return;
                                    }
                                    // if (keyStr === "backspace") {
                                    //   if ((event.target as any).value.length <= 1) {
                                    //     event.preventDefault();
                                    //     event.stopPropagation();
                                    //     (event.target as any).value = "1";
                                    //   }
                                    // }
                                    return;
                                }
                            },
                            keyup: function (event) {
                                event.preventDefault();
                                event.stopPropagation();
                                var val = event.target.value;
                                if (val === "") {
                                    return;
                                    //     this._currentPercentage = 1;
                                    //     (event.target as any).value = "1";
                                    //     this._reader.updateReaderView();
                                    //     return;
                                }
                                var numVal = parseInt(val);
                                if (isNaN(numVal)) {
                                    return;
                                }
                                if (_this._currentPercentage !== numVal) {
                                    _this._currentPercentage = numVal;
                                    _this._reader.updateView();
                                }
                            }
                        },
                        props: {
                            value: _this._currentPercentage
                        }
                    }),
                    (0, snabbdom_1.h)("span", "%"),
                ]),
            ]);
        };
        document.addEventListener("mouseup", function () {
            clearInterval(_this._intervalId);
        });
    }
    return Zoom;
}());
exports.Zoom = Zoom;
