import { UpdateViewInterface } from "../..";
import {
  init,
  h,
  propsModule,
  styleModule,
  eventListenersModule,
  classModule,
  attributesModule,
  datasetModule,
  VNode,
  On,
} from "../../snabbdom";
import { RenderInterface } from "../../types";
import { createElement, htmlElementConvertToVNode } from "../../utils";

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
export class Toolbars implements RenderInterface, UpdateViewInterface<void> {
  /**
   * 虚拟dom元素.
   * @ignore
   */
  private _vm_node: VNode;
  /**
   * 虚拟dom更新派发
   * @ignore
   */
  private _vm_patch: (oldNode: Element | VNode, newNode: VNode) => VNode;
  /**
   * 按钮组.
   * @ignore
   */
  private _btns: ToolbarBtn[] = [];
  /**
   * className.
   * @ignore
   */
  private _className: string = ".bk-reader-tool-toolbars";
  /**
   * 工具条样式
   * @ignore
   */
  private _styles: CSSStyleDeclaration = {} as any;

  /**
   * 构造工具条
   * @param params 工具条构造属性
   */
  constructor(params?: ToolbarConstructor) {
    if (params) {
      if (params.className) {
        this._className = "." + params.className.split(" ").join(".");
      }
      if (params.styles) {
        this._styles = params.styles;
      }
      if (params.btns && params.btns.length > 0) {
        this._btns = params.btns;
      }
    }
    this._vm_node = this.viewsWithBtns();
    this._vm_patch = init([
      propsModule,
      styleModule,
      eventListenersModule,
      classModule,
      attributesModule,
      datasetModule,
    ]);
  }
  /**
   * 更新视图
   */
  updateView(): void {
    this._vm_node = this._vm_patch(this._vm_node, this.viewsWithBtns());
  }
  /**
   * 渲染工具条到HTML元素或虚拟节点上
   * @param ele 要渲染到的HTML元素或虚拟节点
   */
  renderTo(ele: HTMLElement | VNode): void {
    if (ele instanceof HTMLElement) {
      const tmpEle = createElement("div");
      ele.appendChild(tmpEle);
      this._vm_node = this._vm_patch(tmpEle, this._vm_node);
      return;
    }
    throw new Error("Method not implemented.");
  }

  // renderTo(ele: HTMLElement): void {
  //   const tmpEle = createElement("div");
  //   ele.appendChild(tmpEle);
  //   this._vm_node = this._vm_patch(tmpEle, this._vm_node);
  // }

  /**
   * 获取工具条的虚拟节点
   * @returns 虚拟节点
   * @ignore
   */
  private viewsWithBtns(): VNode {
    const eleName = "div" + this._className;
    return h(
      eleName,
      {
        style: this._styles as any,
      },
      [
        h(
          "ul",
          this._btns.map((btn) => {
            if (btn.type === "ele") {
              if (btn.ele) {
                return htmlElementConvertToVNode(btn.ele, btn.on);
              }
              return h("div");
            }
            let btnClassName = "radius.bk-reader-tool-btn-text";
            if (btn.type) {
              switch (btn.type) {
                case "icon":
                  btnClassName = "radius.bk-reader-tool-btn-icon";
                  break;
                case "text-icon":
                  btnClassName = "bk-reader-tool-btn-text-icon";
                  break;
              }
            }
            return h(
              "li.bk-reader-tool-btn",
              {
                key: btn.text,
              },
              [
                h(
                  "button." + btnClassName,
                  {
                    props: {
                      title: btn.text,
                    },
                    on: btn.on,
                  },
                  btn.text
                ),
              ]
            );
          })
        ),
      ]
    );
  }
}
