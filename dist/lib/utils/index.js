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
exports.addStyleTagToHead = exports.htmlElementConvertToVNode = exports.vnodeConvert = exports.removeElementsByName = exports.elementRemoveEvent = exports.elementAddEvent = exports.getElementsByClassName = exports.createElement = exports.isIE = void 0;
var snabbdom_1 = require("../snabbdom");
/**
 * 判断是否为IE浏览器.
 * @returns 是/否为IE浏览器
 */
function isIE() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("msie") > -1;
}
exports.isIE = isIE;
/**
 * 创建节点元素
 * @param targetName 标签名称
 * @returns HTML元素
 */
function createElement(targetName) {
    if (isIE()) {
        try {
            return document.createElement("<" + targetName + '"></' + targetName + ">");
        }
        catch (e) { }
    }
    return document.createElement(targetName);
}
exports.createElement = createElement;
/**
 * Ie不支持通过className获取标签,以此扩展.
 * @param className class名称
 * @returns HTML元素
 */
function getElementsByClassName(className) {
    var eles = document.getElementsByTagName("*");
    var eleLength = eles.length;
    var elements = [];
    for (var i = 0; i < eleLength; i++) {
        var oCls = eles[i].className || "";
        if (oCls.indexOf(className) < 0) {
            continue;
        }
        var oClsArr = oCls.split(/\s+/);
        var oClsArrLength = oClsArr.length;
        for (var j = 0; j < oClsArrLength; j++) {
            if (className == oClsArr[j]) {
                elements.push(eles[i]);
            }
        }
    }
    return elements;
}
exports.getElementsByClassName = getElementsByClassName;
/**
 * 添加事件,兼容IE.
 * @param ele HTML元素
 * @param eventName 事件名称
 * @param handle 事件处理器
 */
function elementAddEvent(ele, eventName, handle) {
    // @ts-ignore
    if (!ele.saveEventHandle) {
        // @ts-ignore
        ele.saveEventHandle = [];
    }
    // @ts-ignore
    ele.saveEventHandle[eventName] = handle;
    // @ts-ignore
    if (window.addEventListener) {
        // @ts-ignore
        ele.addEventListener(eventName, ele.saveEventHandle[eventName], false);
        // @ts-ignore
    }
    else if (window.attachEvent) {
        // @ts-ignore
        ele.attachEvent("on" + eventName, ele.saveEventHandle[eventName]);
    }
    else {
        // @ts-ignore
        ele["on" + eventName] = ele.saveEventHandle[eventName];
    }
}
exports.elementAddEvent = elementAddEvent;
/**
 * 解除事件,要解除的事件必须通过elementAddEvent进行绑定.
 * @param ele HTML元素
 * @param event 事件名称
 */
function elementRemoveEvent(ele, event) {
    // @ts-ignore
    var handle = ele.saveEventHandle ? ele.saveEventHandle[event] : undefined;
    if (!handle) {
        return;
    }
    // @ts-ignore
    if (window.addEventListener) {
        ele.removeEventListener(event, handle, false);
        // @ts-ignore
    }
    else if (window.detachEvent) {
        // @ts-ignore
        ele.detachEvent("on" + event, handle);
    }
    else {
        // @ts-ignore
        ele["on" + event] = "";
    }
}
exports.elementRemoveEvent = elementRemoveEvent;
/**
 * 通过元素名称移除元素.
 * @param name 名称
 */
function removeElementsByName(name) {
    var forms = document.getElementsByName(name);
    for (var i = forms.length - 1; i >= 0; i--) {
        try {
            document.body.removeChild(forms[i]);
        }
        catch (e) { }
    }
}
exports.removeElementsByName = removeElementsByName;
/**
 * 虚拟节点转换，为解决外部构造虚拟节点不生效问题.
 * @param vnode 虚拟节点
 * @returns 虚拟节点
 */
function vnodeConvert(vnode) {
    var children = [];
    if (vnode.children && vnode.children.length > 0) {
        vnode.children.forEach(function (v) {
            if (!v) {
                return;
            }
            if (typeof v === "string") {
                children.push((0, snabbdom_1.h)(v));
                return;
            }
            children.push(vnodeConvert(v));
        });
    }
    return (0, snabbdom_1.h)(vnode.sel, __assign({}, vnode.data), children);
}
exports.vnodeConvert = vnodeConvert;
/**
 * HTML元素转换为虚拟节点.
 * @param ele HTML元素
 * @param on 事件
 * @returns 虚拟节点
 */
function htmlElementConvertToVNode(ele, on) {
    var id = ele.id ? "#" + ele.id : "";
    var classes = ele.getAttribute("class");
    var c = classes ? "." + classes.split(" ").join(".") : "";
    var eleName = ele.tagName.toLowerCase() + id + c;
    var props = {};
    var attrs = ele.getAttributeNames();
    for (var i = 0; i < attrs.length; i++) {
        var attrName = attrs[i];
        if (attrName.toLowerCase() === "class" ||
            attrName.toLowerCase() === "id" ||
            attrName.toLowerCase() === "styles") {
            continue;
        }
        var attrVal = ele.getAttribute(attrName);
        props[attrName] = attrVal;
    }
    var childrenVnodes = [];
    var textVal = "";
    var childNodes = ele.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];
        var nodeType = node.nodeType;
        switch (nodeType) {
            case 1:
                childrenVnodes.push(htmlElementConvertToVNode(node));
                break;
            case 3:
                textVal = document.body.childNodes[1].childNodes[0].nodeValue || "";
                break;
            default:
                continue;
        }
    }
    return (0, snabbdom_1.h)(eleName, {
        style: __assign({}, ele.style),
        props: props
    }, childNodes.length > 0 ? [] : textVal);
}
exports.htmlElementConvertToVNode = htmlElementConvertToVNode;
/**
 * 添加style样式到head标签中
 * @param id styleId
 * @param styleStr style标签内的内容
 * @ignore
 */
function addStyleTagToHead(id, styleStr) {
    var styleTag = document.getElementById(id);
    if (styleTag) {
        return;
    }
    styleTag = createElement("style");
    styleTag.id = id;
    styleTag.innerHTML = styleStr;
    var headTag = document.getElementsByTagName("head")[0];
    headTag.appendChild(styleTag);
}
exports.addStyleTagToHead = addStyleTagToHead;
