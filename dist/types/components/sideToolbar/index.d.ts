import { UpdateViewInterface } from "../..";
import { VNode, On } from "../../snabbdom";
import { RenderInterface } from "../../types";
/**
 * 侧边栏信息
 */
export interface SideToolbarInfo {
    /**
     * 使用自定义元素覆盖默认
     */
    node?: VNode | HTMLElement;
    /**
     * 显示文本
     */
    text?: string;
    /**
     * 图片地址
     */
    imageUrl?: string;
    /**
     * className
     */
    className?: string;
    /**
     * 事件
     */
    on?: On | {
        click: (event: MouseEvent, isOpen: boolean) => void;
    };
    /**
     * 内容
     */
    contents?: {
        /**
         * 元素
         */
        ele: VNode | HTMLElement;
        /**
         * 事件
         */
        on?: On;
    }[];
    /**
     * 是否选中
     */
    active?: boolean;
}
/**
 * 侧边栏构造参数
 */
export interface SideToolbarsContructor {
    /**
     * 侧边栏className
     */
    className?: string;
    /**
     * 样式
     */
    styles?: CSSStyleDeclaration;
    /**
     * 节点信息
     */
    nodes?: SideToolbarInfo[];
}
/**
 * 侧边栏
 */
export declare class SideToolbar implements RenderInterface, UpdateViewInterface<void> {
    /**
     * 虚拟dom元素
     * @ignore
     */
    private _vm_node;
    /**
     * 虚拟节点派发函数
     * @ignore
     */
    private _vm_patch;
    /**
     * className
     * @ignore
     */
    private _className;
    /**
     * 样式
     * @ignore
     */
    private _styles;
    /**
     * 激活的内容索引
     * @ignore
     */
    private _activeContentIndex?;
    /**
     * 工具条元素
     * @ignore
     */
    private _toolNodes;
    /**
     * 构造一个侧边栏对象
     * @param params 构造参数
     */
    constructor(params?: SideToolbarsContructor);
    /**
     * 将侧边栏渲染到指定的HTML元素中
     * @param ele 要渲染到的元素
     */
    renderTo(ele: HTMLElement | VNode): void;
    /**
     * 侧边栏内容视图
     * @returns 虚拟节点
     * @ignore
     */
    private _views;
    /**
     * 更新侧边栏内容
     */
    updateView: () => void;
}
