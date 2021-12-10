import { VNode } from "./snabbdom";

// 渲染接口
export interface RenderInterface {
  // 渲染到元素
  renderTo(ele: HTMLElement | VNode): void;
}

export interface UpdateViewInterface<T> {
  // 更新视图
  updateView(param?: T): void;
}
