"use strict";
exports.__esModule = true;
exports.ContextMenu = void 0;
var utils_1 = require("../../utils");
var ContextMenu = /** @class */ (function () {
    function ContextMenu(param) {
        this._contextMenuDiv = (0, utils_1.createElement)("div");
        var menuUl = (0, utils_1.createElement)("ul");
        menuUl.style.width = "128px";
        menuUl.style.background = "#fff";
        menuUl.style.border = "1px solid #6e6e6e";
        menuUl.style.boxShadow = "0 0 8px #6e6e6e";
        menuUl.style.listStyle = "none";
        menuUl.style.margin = "0";
        menuUl.style.padding = "0";
        menuUl.style.borderRadius = "5px";
        var _loop_1 = function (i) {
            var menuItem = param.menuItems[i];
            var li = (0, utils_1.createElement)("li");
            try {
                if (menuItem.type === "separator") {
                    return "continue";
                }
                li.style.padding = "5px 2px 5px 12px";
                li.style.cursor = "pointer";
                li.onmouseout = function () {
                    li.style.color = "#000";
                    li.style.background = "none";
                };
                li.onmouseover = function () {
                    li.style.background = "#6e6e6e";
                    li.style.color = "#fff";
                };
                li.innerText = menuItem.text || "";
                if (menuItem.onClick) {
                    li.onclick = menuItem.onClick;
                }
            }
            finally {
                menuUl.appendChild(li);
            }
        };
        for (var i = 0; i < param.menuItems.length; i++) {
            _loop_1(i);
        }
        this._contextMenuDiv.appendChild(menuUl);
    }
    ContextMenu.prototype.renderTo = function (ele) {
        if (!(ele instanceof HTMLElement)) {
            throw "不接受非HTMLElement元素";
        }
        ele.appendChild(this._contextMenuDiv);
    };
    return ContextMenu;
}());
exports.ContextMenu = ContextMenu;
