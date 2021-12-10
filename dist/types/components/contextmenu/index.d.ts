import { VNode } from "../../snabbdom";
import { RenderInterface } from "../../types";
export interface MenuItem {
    type: "separator" | "text";
    text?: string;
    onClick?: (event: MouseEvent) => void;
}
export interface ContextMenuConstructor {
    menuItems: MenuItem[];
}
export declare class ContextMenu implements RenderInterface {
    private _contextMenuDiv;
    constructor(param: ContextMenuConstructor);
    renderTo(ele: HTMLElement | VNode): void;
}
