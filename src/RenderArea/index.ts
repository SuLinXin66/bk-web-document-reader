// import {
//   h,
//   init,
//   styleModule,
//   eventListenersModule,
//   VNode,
//   propsModule,
// } from "../snabbdom";

import { UpdateViewInterface } from "..";
import { VNode } from "../snabbdom";
import { RenderInterface } from "../types";
import { createElement } from "../utils";

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
export class RenderArea
  implements
    RenderInterface,
    UpdateViewInterface<PositionRenderAreaConstructor> {
  // 渲染到的目标元素
  private renderEle: HTMLElement | undefined;
  // 渲染到的目标元素原始html
  private renderEleSrcHtml: string | undefined;
  // 容器元素
  private _container: HTMLElement;
  // 虚拟Dom节点
  // private _vm_dom: VNode;
  // private _vm_patch: (oldVnode: VNode | Element, vnode: VNode) => VNode;
  // 样式
  private _style: CSSStyleDeclaration = {} as any;
  // 子元素列表
  // private _childEles: HTMLElement[] = [];

  /**
   * 创建对象
   * @ignore
   * @param _param 渲染区域参数
   */
  constructor(private _param: PositionRenderAreaConstructor) {
    this._container = createElement("div");
    this._updateView();
  }

  private _updateView() {
    if (this._param.styles) {
      this._style = {
        ...this._param.styles,
      };
    }

    if (this._param.className) {
      this._container.className = this._param.className;
    }

    if (this._param.hide) {
      this._container.style.display = "none";
    } else {
      this._container.style.display = "block";
    }

    for (let key in this._style) {
      this._container.style[key] = this._style[key];
    }
  }

  public updateView = (data: PositionRenderAreaConstructor) => {
    this._param = data;
    this._updateView();
  };

  public renderTo(ele: HTMLElement | VNode): void {
    if (ele instanceof HTMLElement) {
      if (this.renderEle) {
        this.renderEle.innerHTML = this.renderEleSrcHtml!;
        this.renderEle = undefined;
      }

      this.renderEle = ele;
      this.renderEleSrcHtml = this.renderEle.innerHTML;
      ele.appendChild(this._container);

      // if (!this._vm_dom) {
      //   return;
      // }

      // this._vm_patch(ele, this._vm_dom);
      return;
    }
    throw new Error("Method not implemented.");
  }

  /**
   * 渲染区域
   * @param renderInterface 渲染接口
   */
  public renderArea = (renderInterface: RenderInterface) => {
    renderInterface.renderTo(this._container);
  };
}
