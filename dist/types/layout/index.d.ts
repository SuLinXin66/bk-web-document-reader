import { UpdateViewInterface } from "..";
import { VNode } from "../snabbdom";
import { RenderInterface } from "../types";
/**
 * 容器位置渲染区域参数
 */
export interface PositionRenderAreaParam {
    /**
     * className.
     */
    className?: string;
    /**
     * 内容.
     */
    content?: RenderInterface;
    /**
     * 是否隐藏
     */
    hide?: boolean;
}
/**
 * 布局参数
 */
export interface LayoutContructor {
    /**
     * 顶部容器内容
     */
    top?: PositionRenderAreaParam;
    /**
     * 底部容器内容
     */
    bottom?: PositionRenderAreaParam;
    /**
     * 左侧容器内容
     */
    left?: PositionRenderAreaParam;
    /**
     * 右侧容器内容
     */
    right?: PositionRenderAreaParam;
    /**
     * 中间容器内容
     */
    center?: PositionRenderAreaParam;
    /**
     * 布局的className
     */
    className?: string;
}
/**
 * 阅读器布局类
 */
export declare class Layout implements RenderInterface, UpdateViewInterface<LayoutContructor> {
    private _param;
    /**
     * 顶部容器
     * @ignore
     */
    private _topContainer;
    /**
     * 底部容器.
     * @ignore
     */
    private _bottomContainer;
    /**
     * 左侧容器.
     * @ignore
     */
    private _leftContainer;
    /**
     * 右侧容器.
     * @ignore
     */
    private _rightContainer;
    /**
     * 中部容器.
     * @ignore
     */
    private _centerContainer;
    /**
     * 渲染的容器元素.
     * @ignore
     */
    private _renderContainerEle;
    /**
     * 构造布局对象
     * @param _param 布局参数
     */
    constructor(_param: LayoutContructor);
    /**
     * 渲染布局内容到HTML元素或虚拟节点
     * @param ele 渲染到的HTML元素或虚拟节点
     */
    renderTo(ele: HTMLElement | VNode): void;
    /**
     * 更新布局内视图
     * @param data 要更新的内容参数
     */
    updateView(data: LayoutContructor): void;
}
