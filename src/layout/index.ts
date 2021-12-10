import { UpdateViewInterface } from "..";
import { RenderArea } from "../RenderArea";
import { VNode } from "../snabbdom";
import { RenderInterface } from "../types";
import { createElement } from "../utils";

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
export class Layout
  implements RenderInterface, UpdateViewInterface<LayoutContructor> {
  /**
   * 顶部容器
   * @ignore
   */
  private _topContainer: RenderArea | undefined;
  /**
   * 底部容器.
   * @ignore
   */
  private _bottomContainer: RenderArea | undefined;
  /**
   * 左侧容器.
   * @ignore
   */
  private _leftContainer: RenderArea | undefined;
  /**
   * 右侧容器.
   * @ignore
   */
  private _rightContainer: RenderArea | undefined;
  /**
   * 中部容器.
   * @ignore
   */
  private _centerContainer: RenderArea | undefined;
  /**
   * 渲染的容器元素.
   * @ignore
   */
  private _renderContainerEle: HTMLElement;

  /**
   * 构造布局对象
   * @param _param 布局参数
   */
  constructor(private _param: LayoutContructor) {
    document.oncontextmenu = (event) => {
      event.stopPropagation();
      event.preventDefault();
    };
    this._renderContainerEle = createElement("div");
    this._renderContainerEle.className =
      _param.className || "bk-reader-container";
    if (_param.top) {
      this._topContainer = new RenderArea({
        ..._param.top,
        className: _param.top.className || "bk-reader-container-top",
      });
      if (_param.top.content) {
        this._topContainer.renderArea(_param.top.content);
      }
    }
    if (_param.bottom) {
      this._bottomContainer = new RenderArea({
        ..._param.bottom,
        className: _param.bottom.className || "bk-reader-container-bottom",
      });
      if (_param.bottom.content) {
        this._bottomContainer.renderArea(_param.bottom.content);
      }
    }
    if (_param.left) {
      this._leftContainer = new RenderArea({
        ..._param.left,
        className: _param.left.className || "bk-reader-container-left",
      });
      if (_param.left.content) {
        this._leftContainer.renderArea(_param.left.content);
      }
    }
    if (_param.right) {
      this._rightContainer = new RenderArea({
        ..._param.right,
        className: _param.right.className || "bk-reader-container-right",
      });

      if (_param.right.content) {
        this._rightContainer.renderArea(_param.right.content);
      }
    }
    if (_param.center) {
      this._centerContainer = new RenderArea({
        ..._param.center,
        className: _param.center.className || "bk-reader-container-center",
      });
      if (_param.center.content) {
        this._centerContainer.renderArea(_param.center.content);
      }
    }
  }

  /**
   * 渲染布局内容到HTML元素或虚拟节点
   * @param ele 渲染到的HTML元素或虚拟节点
   */
  public renderTo(ele: HTMLElement | VNode): void {
    if (ele instanceof HTMLElement) {
      this._topContainer?.renderTo(this._renderContainerEle);
      const centerContainer = createElement("div");
      let defaultClassName = "bk-reader-container-center-container";
      if (
        !this._bottomContainer ||
        (this._param.bottom && this._param.bottom.hide)
      ) {
        defaultClassName += " no-bottom";
      }
      centerContainer.className = defaultClassName;
      centerContainer.style.width = "100%";

      this._renderContainerEle.appendChild(centerContainer);
      this._leftContainer?.renderTo(centerContainer);
      this._rightContainer?.renderTo(centerContainer);
      this._centerContainer?.renderTo(centerContainer);
      this._bottomContainer?.renderTo(this._renderContainerEle);

      ele.innerHTML = "";
      ele.appendChild(this._renderContainerEle);
      return;
    }
    throw new Error("Method not implemented.");
  }

  /**
   * 更新布局内视图
   * @param data 要更新的内容参数
   */
  public updateView(data: LayoutContructor) {
    const _data = {
      ...this._param,
      ...data,
    };

    if (this._topContainer && data.top) {
      this._topContainer.updateView(data.top);
    }

    if (this._bottomContainer && data.bottom) {
      this._bottomContainer.updateView(data.bottom);
    }

    if (this._leftContainer && data.left) {
      this._leftContainer.updateView(data.left);
    }

    if (this._rightContainer && data.right) {
      this._rightContainer.updateView(data.right);
    }
  };
}
