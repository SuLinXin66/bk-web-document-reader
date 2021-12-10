import { RenderInterface } from "../..";
import { VNode } from "../../snabbdom";
export interface BottomToolbarConstructor {
    className?: string;
    styles?: CSSStyleDeclaration;
}
export declare class BottomToolbar implements RenderInterface {
    private _param?;
    private _vm_node;
    private _vm_patch;
    private _styles;
    private _className;
    constructor(_param?: BottomToolbarConstructor | undefined);
    private _views;
    renderTo(ele: HTMLElement | VNode): void;
}
