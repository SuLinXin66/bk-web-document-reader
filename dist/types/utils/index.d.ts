import { On, VNode } from "../snabbdom";
/**
 * 判断是否为IE浏览器.
 * @returns 是/否为IE浏览器
 */
export declare function isIE(): boolean;
/**
 * 创建节点元素
 * @param targetName 标签名称
 * @returns HTML元素
 */
export declare function createElement(targetName: string): HTMLElement;
/**
 * Ie不支持通过className获取标签,以此扩展.
 * @param className class名称
 * @returns HTML元素
 */
export declare function getElementsByClassName(className: string): Array<HTMLElement>;
/**
 * 添加事件,兼容IE.
 * @param ele HTML元素
 * @param eventName 事件名称
 * @param handle 事件处理器
 */
export declare function elementAddEvent(ele: HTMLElement | Window | Document, eventName: string, handle: (e?: Event) => void): void;
/**
 * 解除事件,要解除的事件必须通过elementAddEvent进行绑定.
 * @param ele HTML元素
 * @param event 事件名称
 */
export declare function elementRemoveEvent(ele: HTMLElement | Window | Document, event: string): void;
/**
 * 通过元素名称移除元素.
 * @param name 名称
 */
export declare function removeElementsByName(name: string): void;
/**
 * 虚拟节点转换，为解决外部构造虚拟节点不生效问题.
 * @param vnode 虚拟节点
 * @returns 虚拟节点
 */
export declare function vnodeConvert(vnode: VNode): VNode;
/**
 * HTML元素转换为虚拟节点.
 * @param ele HTML元素
 * @param on 事件
 * @returns 虚拟节点
 */
export declare function htmlElementConvertToVNode(ele: HTMLElement, on?: On): VNode;
