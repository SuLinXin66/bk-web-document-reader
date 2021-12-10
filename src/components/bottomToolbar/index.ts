import { RenderInterface } from "../..";
import {
  attributesModule,
  classModule,
  datasetModule,
  eventListenersModule,
  h,
  init,
  propsModule,
  styleModule,
  VNode,
} from "../../snabbdom";
import { createElement } from "../../utils";

export interface BottomToolbarConstructor {
  className?: string;
  styles?: CSSStyleDeclaration;
}

export class BottomToolbar implements RenderInterface {
  // 虚拟dom元素
  private _vm_node: VNode;
  private _vm_patch: (oldNode: Element | VNode, newNode: VNode) => VNode;

  private _styles: CSSStyleDeclaration = {} as any;

  private _className: string = ".bk-reader-bottom-tool-toolbars";
  constructor(private _param?: BottomToolbarConstructor) {
    if (_param) {
      if (_param.className) {
        this._className = "." + _param.className.split(" ").join(".");
      }
      if (_param.styles) {
        this._styles = _param.styles;
      }
    }
    this._vm_node = this._views();
    this._vm_patch = init([
      propsModule,
      styleModule,
      eventListenersModule,
      classModule,
      attributesModule,
      datasetModule,
    ]);
  }

  private _views = () => {
    let className = this._className;
    return h("div" + className);
  };

  public renderTo(ele: HTMLElement | VNode): void {
    if (ele instanceof HTMLElement) {
      const tmpEle = createElement("div");
      ele.appendChild(tmpEle);
      this._vm_node = this._vm_patch(tmpEle, this._vm_node);
      return;
    }
    throw new Error("Method not implemented.");
  }
}
