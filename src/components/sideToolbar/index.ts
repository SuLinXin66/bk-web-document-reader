import { UpdateViewInterface } from "../..";
import {
  init,
  propsModule,
  styleModule,
  eventListenersModule,
  classModule,
  attributesModule,
  datasetModule,
  VNode,
  h,
  On,
} from "../../snabbdom";
import { RenderInterface } from "../../types";
import {
  createElement,
  htmlElementConvertToVNode,
  vnodeConvert,
} from "../../utils";

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
  on?:
    | On
    | {
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
export class SideToolbar implements RenderInterface, UpdateViewInterface<void> {
  /**
   * 虚拟dom元素
   * @ignore
   */
  private _vm_node: VNode;
  /**
   * 虚拟节点派发函数
   * @ignore
   */
  private _vm_patch: (oldNode: Element | VNode, newNode: VNode) => VNode;
  /**
   * className
   * @ignore
   */
  private _className: string = ".bk-reader-side-tool-toolbars";
  /**
   * 样式
   * @ignore
   */
  private _styles: CSSStyleDeclaration = {} as any;
  /**
   * 激活的内容索引
   * @ignore
   */
  private _activeContentIndex?: number;

  /**
   * 工具条元素
   * @ignore
   */
  private _toolNodes: SideToolbarInfo[] = [];
  /**
   * 构造一个侧边栏对象
   * @param params 构造参数
   */
  constructor(params?: SideToolbarsContructor) {
    if (params) {
      if (params.className) {
        this._className = "." + params.className.split(" ").join(".");
      }
      if (params.styles) {
        this._styles = params.styles;
      }

      if (params.nodes) {
        this._toolNodes = params.nodes;
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

  /**
   * 将侧边栏渲染到指定的HTML元素中
   * @param ele 要渲染到的元素
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

  /**
   * 侧边栏内容视图
   * @returns 虚拟节点
   * @ignore
   */
  private _views() {
    const eleName =
      "div" +
      this._className +
      (typeof this._activeContentIndex !== "undefined" ? ".active" : "");

    const btnNodes: VNode[] = [];
    const contentNodes: VNode[] = [];
    for (let i = 0; i < this._toolNodes.length; i++) {
      const info = this._toolNodes[i];
      let btnVnode: VNode | null = null;
      if (info.node) {
        if (info.node instanceof HTMLElement) {
          btnVnode = htmlElementConvertToVNode(info.node);
        } else {
          btnVnode = info.node;
        }
      } else if (info.imageUrl) {
        btnVnode = h("img", {
          props: {
            src: info.imageUrl,
            alt: info.text,
            width: "38",
            height: "38",
            title: info.text,
          },
          style: {
            display: "inline-block",
            borderRadius: "5px",
            boxShadow: "0 0 6px #6e6e6e",
            border: "1px solid #6e6e6e",
            cursor: "pointer",
          },
        });
      } else if (info.text) {
        btnVnode = h("div.side-toolbar-btn-ele", info.text);
      }

      btnNodes.push(
        h("li" + (this._activeContentIndex === i ? ".active" : ""), [
          h(
            "div.side-toolbar-btn",
            {
              style: {
                display: "block",
                height: "38px",
                textAlign: "center",
                padding: "16px 0",
              },
              on: {
                ...info.on,
                click: async (event: MouseEvent) => {
                  let activeContentIndex;
                  if (this._activeContentIndex === i) {
                    activeContentIndex = undefined;
                  } else {
                    activeContentIndex = i;
                  }
                  if (info.on?.click) {
                    try {
                      const clickRestult = (info.on as any).click(
                        event,
                        typeof activeContentIndex !== "undefined"
                      );
                      if (clickRestult instanceof Promise) {
                        const result = await clickRestult;
                        if (typeof result === "boolean" && !result) {
                          return;
                        }
                      } else if (
                        typeof clickRestult === "boolean" &&
                        !clickRestult
                      ) {
                        return;
                      }
                    } catch (e) {
                      console.log(
                        "自定义单击事件执行失败: ",
                        (e as any).message
                      );
                      return;
                    }
                  }
                  this._activeContentIndex = activeContentIndex;
                  this.updateView();
                },
              },
            },
            btnVnode
          ),
        ])
      );

      if (!info.contents) {
        continue;
      }

      info.contents.forEach((content) => {
        let vnode: VNode;
        if (content.ele instanceof HTMLElement) {
          vnode = htmlElementConvertToVNode(content.ele, content.on);
        } else {
          vnode = vnodeConvert(content.ele);
        }
        contentNodes.push(
          h(
            "li",
            {
              style: {
                display: this._activeContentIndex === i ? "block" : "none",
              },
            },
            vnode
          )
        );
      });
    }

    return h(
      eleName,
      {
        style: {
          ...(this._styles as any),
        },
      },
      [
        h("ul.bk-reader-side-toolbars-btn-group", btnNodes),
        h(
          "ul.bk-reader-side-toobars-content-group",
          {
            style: {},
          },
          contentNodes
        ),
      ]
    );
  }

  /**
   * 更新侧边栏内容
   */
  public updateView = () => {
    this._vm_node = this._vm_patch(this._vm_node, this._views());
  };
}
