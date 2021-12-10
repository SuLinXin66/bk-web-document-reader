import { UpdateViewInterface } from "..";
import { VNode } from "../snabbdom";
import { RenderInterface } from "../types";
/**
 * 位置渲染区域参数.
 * @ignore
 */
export interface PositionRenderAreaConstructor {
    className?: string;
    styles?: CSSStyleDeclaration;
    hide?: boolean;
}
/**
 * 渲染区域.
 * @ignore
 */
export declare class RenderArea implements RenderInterface, UpdateViewInterface<PositionRenderAreaConstructor> {
    private _param;
    private renderEle;
    private renderEleSrcHtml;
    private _container;
    private _style;
    /**
     * 创建对象
     * @ignore
     * @param _param 渲染区域参数
     */
    constructor(_param: PositionRenderAreaConstructor);
    private _updateView;
    updateView: (data: PositionRenderAreaConstructor) => void;
    renderTo(ele: HTMLElement | VNode): void;
    /**
     * 渲染区域
     * @param renderInterface 渲染接口
     */
    renderArea: (renderInterface: RenderInterface) => void;
}
