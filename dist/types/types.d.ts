import { VNode } from "./snabbdom";
export interface RenderInterface {
    renderTo(ele: HTMLElement | VNode): void;
}
export interface UpdateViewInterface<T> {
    updateView(param?: T): void;
}
