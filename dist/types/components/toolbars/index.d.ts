import { UpdateViewInterface } from "../..";
import { VNode, On } from "../../snabbdom";
import { RenderInterface } from "../../types";
/**
 * 工具栏参数.
 */
export interface ToolbarConstructor {
    /**
     * className.
     */
    className?: string;
    /**
     * style样式
     */
    styles?: CSSStyleDeclaration;
    /**
     * 按钮列表
     */
    btns?: (ToolbarBtn | HTMLElement)[];
}
/**
 * 工具栏按钮属性
 */
export interface ToolbarBtn {
    /**
     * 类型。
     */
    type?: "text" | "text-icon" | "icon" | "ele";
    /**
     * 元素。
     */
    ele?: HTMLElement;
    /**
     * class名称。
     */
    className?: string;
    /**
     * 显示文本.
     */
    text?: string;
    /**
     * 图标.
     */
    icon?: string;
    /**
     * 事件.
     */
    on?: On;
}
/**
 * 工具栏.
 */
export declare class Toolbars implements RenderInterface, UpdateViewInterface<void> {
    /**
     * 虚拟dom元素.
     * @ignore
     */
    private _vm_node;
    /**
     * 虚拟dom更新派发
     * @ignore
     */
    private _vm_patch;
    /**
     * 按钮组.
     * @ignore
     */
    private _btns;
    /**
     * className.
     * @ignore
     */
    private _className;
    /**
     * 工具条样式
     * @ignore
     */
    private _styles;
    /**
     * 构造工具条
     * @param params 工具条构造属性
     */
    constructor(params?: ToolbarConstructor);
    /**
     * 更新视图
     */
    updateView(): void;
    /**
     * 渲染工具条到HTML元素或虚拟节点上
     * @param ele 要渲染到的HTML元素或虚拟节点
     */
    renderTo(ele: HTMLElement | VNode): void;
    /**
     * 获取工具条的虚拟节点
     * @returns 虚拟节点
     * @ignore
     */
    private viewsWithBtns;
}
