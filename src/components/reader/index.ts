import { RenderInterface } from "../../types";
import {
  FileInfo,
  PngInfo,
  ReaderLoadInterface,
  ReaderSealSignatureInterface,
  ReaderSealInterface,
  SealInfo,
} from "../../action/interface";

import { createElement } from "../../utils";
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
import { Zoom } from "./tools/zoom";
import { ZoomInterface } from "./types";
import AsyncLock from "../../asyncLock";
import { ContextMenu as ContextMenuEle, MenuItem } from "../contextmenu";
import { loadingGif, pageNextImg, pagePrevImg } from "../../consts";
import { UpdateViewInterface } from "../..";
const lock = new (AsyncLock as any)();

/**
 * 单页动作.
 */
export interface SignleActionInterface {
  /**
   * 下一页.
   */
  nextPage(): void;

  /**
   * 下一页.
   */
  prevPage(): void;

  /**
   * 是否可以进行下一页.
   */
  canNextPage(): boolean;

  /**
   * 是否可以跳转上一页.
   */
  canPrevPage(): boolean;

  /**
   * 是否可以支持分页跳转.
   */
  canPage(): boolean;

  /**
   * 跳转到指定页.
   * @param page 页码
   */
  breakPage(page: number): void;

  /**
   * 当前页.
   */
  currentPage(): number;

  /**
   * 总页数.
   */
  totalPageSize(): number;
}

/**
 * 阅读器构造参数
 */
export interface ReaderConstructor {
  /**
   * 动作
   */
  action: {
    /**
     * 文件加载接口
     */
    loadFileInterface: ReaderLoadInterface;
    /**
     * 印章操作接口
     */
    sealInterface?: ReaderSealSignatureInterface;
  };
  /**
   * className名称多个以空格隔开如`a b`, 默认className: `bk-reader-tools-reader`
   */
  className?: string;
  /**
   * style样式
   */
  styles?: CSSStyleDeclaration;
  /**
   * 阅读器类型
   */
  type?: ReaderType;
  /**
   * 缩放信息
   */
  zoom?: {
    /**
     * 是否显示
     */
    show?: boolean;
    /**
     * 缩放接口
     */
    zoomInterface?: ZoomInterface;
  };
  /**
   * 是否显示上一页和下一页按钮, 此参数只在{@link type}为{@link ReaderType.Signle}时生效
   */
  page?: boolean;
  /**
   * 在印上上右键时的菜单.
   */
  sealContextMenu?: {
    /**
     * 覆盖默认的右键事件, 配置此项{@link menuItems}将失效
     */
    event?: (event: MouseEvent) => void;
    /**
     * 菜单项
     */
    menuItems?: MenuItem[];
  };
}

/**
 * 阅读器动作接口
 */
export interface ReaderActionInterface {
  loadFile(file: File | string): Promise<void>;
}

/**
 * 阅读器类型
 */
export enum ReaderType {
  /**
   * 竖着展示所有
   */
  VerticalAll,
  /**
   * 横着展示所有
   */
  HorizontalAll,
  /**
   * 单页
   */
  Single,
}

/**
 * 页面上的印章信息
 * @ignore
 */
interface PageSealInfo {
  [key: string]: VNode[];
}

/**
 * 图片信息
 * @ignore
 */
interface PngInfoMap {
  [key: string]: PngInfo;
}

/**
 * 阅读器
 */
export class Reader
  implements
    ReaderSealInterface,
    SignleActionInterface,
    RenderInterface,
    ReaderActionInterface,
    UpdateViewInterface<ReaderConstructor> {
  /**
   * 虚拟节点
   * @ignore
   */
  private _vm_node: VNode;
  /**
   * 虚拟节点派发函数
   * @ignore
   */
  private _vm_patch: (oldNode: Element | VNode, newNode: VNode) => VNode;
  /**
   * 文件加载动作
   * @ignore
   */
  private _actionLoadInterface: ReaderLoadInterface;
  /**
   * 印章操作动作
   * @ignore
   */
  private _actionSealInterface: ReaderSealSignatureInterface | undefined;

  /**
   * className
   * @ignore
   */
  private _className: string = ".bk-reader-tools-reader";
  /**
   * style样式
   * @ignore
   */
  private _styles?: CSSStyleDeclaration;
  /**
   * 图片信息
   * @ignore
   */
  private _imgFile?: FileInfo;
  /**
   * 图片列表
   * @ignore
   */
  private _imgs: PngInfoMap = {};
  /**
   * 当前页面的图片
   * @ignore
   */
  private _currentImg?: PngInfo;
  /**
   * 当前页面索引
   * @ignore
   */
  private _currentIndex: number = 1;
  /**
   * 是否显示缩放
   * @ignore
   */
  private _showZoom: boolean = false;

  /**
   * 缩放接口
   * @ignore
   */
  private _zoom: ZoomInterface | undefined;

  /**
   * 阅读器类型
   * @ignore
   */
  private _type: ReaderType = ReaderType.VerticalAll;

  /**
   * 内容移动是否开始
   * @ignore
   */
  private _contentPositionMoveStart: boolean = false;
  /**
   * 内容移动x坐标
   * @ignore
   */
  private _contentPositionMovePrevX: number = 0;
  /**
   * 内容移动y坐标
   * @ignore
   */
  private _contentPositionMovePrevY: number = 0;
  /**
   * 内容滚动条左侧边距
   * @ignore
   */
  private _contentPositionMoveScrollLeft: number = 0;
  /**
   * 内容滚动条顶部边距
   * @ignore
   */
  private _contentPositionMoveScrollTop: number = 0;

  /**
   * 内容是否等待加载
   * @ignore
   */
  private _contentLoading: boolean = false;
  /**
   * 内容是否执行过加载
   * @ignore
   */
  private _contentLoadingExecOk: boolean = false;
  /**
   * 内容加载是否已经开始
   * @ignore
   */
  private _contentLoadStart: boolean = false;
  /**
   * 内容加载框是否自动关闭
   * @ignore
   */
  private _contentLoadingAutoClose: boolean = true;
  // private _contentLoadOne: boolean = false;

  /**
   * 拖拽是否开始
   * @ignore
   */
  private _dragSealStart: boolean = false;
  /**
   * 拖拽信息
   * @ignore
   */
  private _dragSealInfo: SealInfo | undefined;
  /**
   * 拖拽坐标信息
   * @ignore
   */
  private _drageSealPositionInfo: { x: number; y: number } | undefined;
  /**
   * 拖拽当前页信息
   * @ignore
   */
  private _drageSealCurrentPage: string | undefined;
  /**
   * 拖拽确认中
   * @ignore
   */
  private _drageSealAddConfim: boolean | undefined;

  /**
   * 印章右键上下文信息
   * @ignore
   */
  private _sealContextParam:
    | {
        event?: (event: MouseEvent) => void;
        menuItems?: MenuItem[];
      }
    | undefined = undefined;

  /**
   * 内部更新视图
   * @ignore
   */
  private _updateView = () => {
    lock.acquire("updateView", (done: any) => {
      try {
        this._vm_node = this._vm_patch(this._vm_node, this._viewReader());
      } finally {
        done();
      }
    });
  };

  /**
   * 加载页面信息
   * @param fileId 文件ID
   * @param currentPage 当前加载页
   * @ignore
   */
  private _loadPngInfo = async (fileId: string, currentPage: number) => {
    this._currentIndex = currentPage;
    if (!this._actionLoadInterface.getPageInfo) {
      throw new Error("为定义获取方法");
    }

    const pageName = "page-" + currentPage;
    let imgInfo = this._imgs[pageName];
    if (!imgInfo) {
      imgInfo = await this._actionLoadInterface.getPageInfo(
        fileId,
        currentPage
      );
      this._imgs[pageName] = imgInfo;
    }

    this._currentImg = imgInfo;

    this._contentLoading = false;
    if (this._actionLoadInterface.loadingOk) {
      this._actionLoadInterface.loadingOk(true, 1);
    }
    this._updateView();
    // await new Promise<void>((resolve) => {
    //   if (this._contentLoadOne) {
    //     resolve();
    //     return;
    //   }
    //   const intervalId = setInterval(() => {
    //     if (this._contentLoadOne) {
    //       clearInterval(intervalId);
    //       resolve();
    //       return;
    //     }
    //   }, 100);
    // // });
    // this._contentLoading = false;
    // if (this._actionLoadInterface.loadingOk) {
    //   this._actionLoadInterface.loadingOk(true, 1);
    // }
  };

  /**
   * 加载所有页面
   * @ignore
   */
  private _loadPngAllInfo = async () => {
    if (!this._actionLoadInterface.getPageInfo) {
      throw new Error("为定义获取方法");
    }

    if (!this._imgFile) {
      return;
    }

    const imgFileId = this._imgFile.id;

    this._imgs = {};
    const id = this._imgFile.id;
    for (let i = 0; i < this._imgFile.totalSize; i++) {
      const imgInfo = await this._actionLoadInterface.getPageInfo(id, i + 1);
      if (!this._imgFile || this._imgFile.id !== imgFileId) {
        this._imgFile = undefined;
        this._contentLoading = false;
        this._imgs = {};
        this._currentImg = undefined;
        this._updateView();
        return;
      }
      this._imgs["page-" + (i + 1)] = imgInfo;
      // this._imgs.push(imgInfo);
      this._contentLoading = false;
      if (this._actionLoadInterface.loadingOk) {
        this._actionLoadInterface.loadingOk(false, i + 1);
      }
      this._updateView();
      // await new Promise<void>((resolve) => {
      //   if (this._contentLoadOne) {
      //     resolve();
      //     return;
      //   }
      //   const intervalId = setInterval(() => {
      //     if (this._contentLoadOne) {
      //       clearInterval(intervalId);
      //       resolve();
      //       return;
      //     }
      //   }, 100);
      // });
      // this._contentLoading = false;
      // if (this._actionLoadInterface.loadingOk) {
      //   this._actionLoadInterface.loadingOk(true, 1);
      // }
    }
    if (this._actionLoadInterface.loadingOk) {
      this._actionLoadInterface.loadingOk(true, this._imgFile.totalSize);
    }
  };

  /**
   * 构造阅读器虚拟视图节点
   * @returns 阅读器虚拟节点
   * @ignore
   */
  private _viewReader: () => VNode = () => {
    const eleName = "div" + this._className;
    const style: any = {
      padding: "18px 5px",
    };
    if (this._type === ReaderType.HorizontalAll) {
      style.whiteSpace = "nowrap";
    }
    return h(
      eleName,
      {
        style: this._styles as any,
      },
      [
        h(
          "div",
          h(
            "div.bk-reader-content",
            {
              style,
              on: {
                mousedown: (event) => {
                  if (
                    (this._dragSealStart &&
                      this._actionSealInterface?.addSeal) ||
                    this._drageSealAddConfim
                  ) {
                    return;
                  }

                  const currentEle = event.target as HTMLElement;
                  if (
                    currentEle.tagName.toLocaleLowerCase() !== "img" ||
                    !currentEle.className.includes("page")
                  ) {
                    return;
                  }

                  const scrollEle = currentEle.parentElement!.parentElement!
                    .parentElement!;
                  const canScrollLeft =
                    currentEle.scrollWidth - scrollEle.clientWidth;
                  const canScrollTop =
                    currentEle.scrollHeight - scrollEle.clientHeight;
                  if (canScrollTop > 0 || canScrollLeft > 0) {
                    this._contentPositionMoveStart = true;
                    this._contentPositionMoveScrollLeft = scrollEle.scrollLeft;
                    this._contentPositionMoveScrollTop = scrollEle.scrollTop;

                    event.preventDefault();
                    event.stopPropagation();
                  } else {
                    this._contentPositionMoveStart = false;
                  }
                  this._contentPositionMovePrevX = event.clientX;
                  this._contentPositionMovePrevY = event.clientY;
                  this._updateView();
                },
              },
            },
            this._renderReaderContent()
          )
        ),
      ]
    );
  };

  /**
   * 渲染阅读器内容节点
   * @returns 虚拟节点
   * @ignore
   */
  private _renderReaderContent: () => VNode[] | null = () => {
    const vnodes: VNode[] = [];

    const insideLoadingNode = h(
      "div.bk-reader-content-loading",
      {
        style: {
          display: this._contentLoading ? "block" : "none",
          position: "absolute",
          left: "0",
          top: "0",
          bottom: "0",
          right: "0",
        },
      },
      h("img", {
        props: {
          width: "120",
          src: loadingGif,
        },
        style: {
          margin: "0 auto",
          display: "block",
        },
      })
    );
    if (
      this._actionLoadInterface.loading &&
      this._contentLoading &&
      !this._contentLoadingExecOk &&
      Object.keys(this._imgs).length === 0
      // this._imgs.length === 0
    ) {
      this._contentLoadingExecOk = true;
      const result = this._actionLoadInterface.loading();
      if (!(typeof result === "boolean" && !result)) {
        vnodes.push(insideLoadingNode);
      } else {
        this._contentLoadingAutoClose = false;
      }
    } else if (this._contentLoadingAutoClose) {
      vnodes.push(insideLoadingNode);
    }

    if (!this._imgFile || this._imgFile.totalSize === 0) {
      return vnodes;
    }

    if (this._showZoom) {
      if (!this._zoom) {
        this._zoom = new Zoom(this);
      }
    }

    const haveZoom = this._showZoom && !!this._zoom;

    vnodes.push(
      h("div.mask", {
        style: {
          cursor: this._contentPositionMoveStart ? "move" : "default",
          display: this._contentPositionMoveStart ? "block" : "none",
        },
        on: {
          mouseup: (event) => {
            this._contentPositionMoveStart = false;
            this._updateView();
          },
          mousemove: (event) => {
            if (!this._contentPositionMoveStart) {
              return;
            }
            const currentX = event.clientX;
            const currentY = event.clientY;
            const moveX = this._contentPositionMovePrevX - currentX;
            const moveY = this._contentPositionMovePrevY - currentY;

            const currentEle = event.target as HTMLElement;
            const scrollEle = currentEle.parentElement!;

            scrollEle!.scrollTop = this._contentPositionMoveScrollTop + moveY;
            scrollEle!.scrollLeft = this._contentPositionMoveScrollLeft + moveX;
          },
        },
      })
    );

    switch (this._type) {
      case ReaderType.HorizontalAll:
        if (Object.keys(this._imgs).length === 0 && !this._contentLoadStart) {
          this._contentLoadStart = true;
          this._loadPngAllInfo();
          return vnodes;
        } else {
          // for (let i = 0; i < this._imgs.length; i++) {
          for (let i in this._imgs) {
            const currentPage = parseInt(i.split("-")[1]);
            const img = this._imgs[i];
            vnodes.push(
              this._generateImgVnode(
                {
                  currentPage: currentPage,
                  totalPage: this._imgFile.totalSize,
                  haveZoom,
                  imgInfo: img,
                },
                true
              )
            );
          }
        }
        break;
      case ReaderType.VerticalAll:
        if (Object.keys(this._imgs).length === 0 && !this._contentLoadStart) {
          this._contentLoadStart = true;
          this._loadPngAllInfo();
          return vnodes;
        } else {
          // for (let i = 0; i < this._imgs.length; i++) {
          for (let i in this._imgs) {
            const currentPage = parseInt(i.split("-")[1]);
            const img = this._imgs[i];
            vnodes.push(
              this._generateImgVnode({
                currentPage: currentPage,
                totalPage: this._imgFile.totalSize,
                haveZoom,
                imgInfo: img,
              })
            );
          }
        }
        break;
      case ReaderType.Single:
        if (!this._currentImg) {
          this._loadPngInfo(this._imgFile.id, this._currentIndex);
          return vnodes;
        }
        vnodes.push(
          this._generateImgVnode({
            currentPage: this._currentIndex,
            totalPage: this._imgFile.totalSize,
            haveZoom,
            imgInfo: this._currentImg,
          })
        );

        if (!this._params.page) {
          break;
        }

        if (this.canPrevPage()) {
          vnodes.push(
            h(
              "div",
              {
                style: {
                  position: "fixed",
                  left: "308px",
                  bottom: "58px",
                  cursor: "pointer",
                  zIndex: "999",
                  userSelect: "none",
                },
                on: {
                  click: (event) => {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    event.preventDefault();

                    this.prevPage();
                  },
                },
              },
              h("img", {
                props: {
                  src: pagePrevImg,
                  width: "58",
                },
              })
            )
          );
        }

        if (this.canNextPage()) {
          vnodes.push(
            h(
              "div",
              {
                style: {
                  position: "fixed",
                  right: "248px",
                  bottom: "58px",
                  cursor: "pointer",
                  zIndex: "999",
                  userSelect: "none",
                },
                on: {
                  click: (event) => {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    this.nextPage();
                  },
                },
              },
              h("img", {
                props: {
                  src: pageNextImg,
                  width: "58",
                },
              })
            )
          );
        }

        break;
      default:
        return vnodes;
    }

    if (this._showZoom && this._zoom && (this._zoom as any).getNode) {
      vnodes.push((this._zoom as any).getNode());
    }

    return vnodes;
  };

  /**
   * 构造页面信息显示节点
   * @param param 参数
   * @param isHorizontalAll 是否垂直显示所有
   * @returns 页面信息节点
   * @ignore
   */
  private _generateImgVnode: (
    param: {
      // 当前页
      currentPage: number;
      // 总页数
      totalPage: number;
      // 是否需要缩放
      haveZoom: boolean;
      // 图片信息
      imgInfo: PngInfo;
    },
    isHorizontalAll?: boolean
  ) => VNode = (param, isHorizontalAll) => {
    const className = isHorizontalAll ? ".horizontal" : "";
    const pageName = "page-" + param.currentPage;
    const sealInfos = this._checkSealNode() || {};
    const seals = sealInfos[pageName] || [];

    const width = param.haveZoom
      ? this._zoom!.calcPercentage(param.imgInfo.width)
      : param.imgInfo.width;

    const height = param.haveZoom
      ? this._zoom!.calcPercentage(param.imgInfo.height)
      : param.imgInfo.height;

    let sealNode = null;

    if (
      this._dragSealStart &&
      this._dragSealInfo &&
      pageName === this._drageSealCurrentPage &&
      this._actionSealInterface?.addSeal
    ) {
      const sealWidth = param.haveZoom
        ? this._zoom!.calcPercentage(this._dragSealInfo.width)
        : this._dragSealInfo.width;
      const sealHegith = param.haveZoom
        ? this._zoom!.calcPercentage(this._dragSealInfo.height)
        : this._dragSealInfo.height;
      const left =
        ((this._drageSealPositionInfo && this._drageSealPositionInfo.x) || 0) -
        sealWidth / 2;
      const top =
        ((this._drageSealPositionInfo && this._drageSealPositionInfo.y) || 0) -
        sealHegith / 2;
      sealNode = h(
        "div",
        {
          style: {
            position: "absolute",
            left: "0",
            top: "0",
            right: "0",
            bottom: "28px",
            zIndex: "8",
            overflow: "hidden",
          },
          on: {
            mousemove: (event) => {
              if (
                !this._dragSealStart ||
                !this._dragSealInfo ||
                this._drageSealAddConfim
              ) {
                return;
              }
              event.preventDefault();
              event.stopPropagation();

              let currentEle = event.target as HTMLElement;
              if (currentEle.tagName.toLocaleLowerCase() === "img") {
                currentEle = currentEle.parentElement!;
              }
              const eleRect = currentEle.getBoundingClientRect();
              const x = event.clientX - eleRect.left;
              const y = event.clientY - eleRect.top;
              if (x <= 0 || y <= 0) {
                this._drageSealCurrentPage = undefined;
              }
              this._drageSealPositionInfo = {
                x,
                y,
              };
              this._updateView();
            },
          },
        },
        h("img", {
          props: {
            src: this._dragSealInfo.sealImgUrl,
            width: sealWidth,
            height: sealHegith,
          },
          style: {
            display: this._drageSealPositionInfo ? "block" : "none",
            position: "absolute",
            left: left + "px",
            top: top + "px",
            zIndex: "29",
          },
          on: {
            click: async (event) => {
              if (
                !this._drageSealCurrentPage ||
                !this._dragSealInfo ||
                !this._drageSealPositionInfo ||
                !this._actionSealInterface?.addSeal ||
                !this._actionLoadInterface.getPageInfo
              ) {
                this._updateView();
                return;
              }

              const pageNum = parseInt(
                this._drageSealCurrentPage.split("-")[1]
              );
              if (isNaN(pageNum)) {
                return;
              }
              event.stopPropagation();
              event.preventDefault();

              const sealInfo = this._dragSealInfo;

              this._drageSealAddConfim = true;
              this._updateView();

              const haveZoom = this._showZoom && !!this._zoom;

              let { x, y } = this._drageSealPositionInfo;
              if (haveZoom) {
                x = this._zoom!.prcentageRestore(x);
                y = this._zoom!.prcentageRestore(y);
              }

              const widthHalf = this._dragSealInfo.width / 2;
              const heightHalf = this._dragSealInfo.height / 2;

              let pageInfo = this._currentImg!;
              if (
                this._type === ReaderType.HorizontalAll ||
                this._type === ReaderType.VerticalAll
              ) {
                pageInfo = this._imgs[pageNum - 1];
              }
              y = pageInfo.height - y;

              switch (this._dragSealInfo.positionBase) {
                case "leftBottom":
                  x -= widthHalf;
                  y -= heightHalf;
                  break;
                case "leftTop":
                  x -= widthHalf;
                  y += heightHalf;
                  break;
              }

              const signSealInfo = {
                x,
                y,
                pageNum,
                sealInfo,
              };

              let confimEle: HTMLElement | undefined;
              if (this._actionSealInterface?.addSealConfim) {
                try {
                  const result = this._actionSealInterface.addSealConfim(
                    signSealInfo
                  );
                  let backData;
                  if (result instanceof Promise) {
                    backData = await result;
                  } else {
                    backData = result === true;
                  }
                  if (!backData) {
                    this._drageSealAddConfim = undefined;
                    this._updateView();
                    return;
                  }
                } catch (e) {
                  this._drageSealAddConfim = undefined;
                  this._updateView();
                  throw e;
                }
              } else {
                confimEle = await new Promise<HTMLElement | undefined>(
                  (resolve) => {
                    const mask = createElement("div");
                    mask.style.position = "absolute";
                    mask.style.top = "0";
                    mask.style.bottom = "0";
                    mask.style.right = "0";
                    mask.style.left = "0";
                    mask.style.zIndex = "999";
                    mask.style.userSelect = "none";

                    const textDiv = createElement("div");
                    textDiv.style.height = "28px";
                    textDiv.style.lineHeight = "28px";
                    textDiv.style.textAlign = "center";
                    textDiv.style.fontSize = "16px";
                    textDiv.innerText = "是否确认在此加盖印章!?";

                    const btnGroupEle = createElement("div");
                    btnGroupEle.style.lineHeight = "40px";
                    btnGroupEle.style.textAlign = "center";

                    const okBtn = createElement("button");
                    okBtn.innerHTML = "确&nbsp;&nbsp;认";
                    okBtn.style.display = "inline-block";
                    okBtn.style.marginRight = "8px";
                    okBtn.style.background = "rgb(46,113,245)";
                    okBtn.style.color = "#fff";
                    okBtn.onclick = () => {
                      okBtn.setAttribute("disabled", "true");
                      cancelBtn.setAttribute("disabled", "true");
                      textDiv.innerText = "正在加盖印章中...";
                      resolve(mask);
                    };
                    btnGroupEle.appendChild(okBtn);

                    const cancelBtn = createElement("button");
                    okBtn.style.display = "inline-block";
                    cancelBtn.innerHTML = "取&nbsp;&nbsp;消";
                    cancelBtn.onclick = () => {
                      mask.remove();
                      resolve(undefined);
                    };
                    btnGroupEle.appendChild(cancelBtn);

                    const triangleEle = createElement("div");
                    triangleEle.style.borderLeft = "12px solid transparent";
                    triangleEle.style.borderRight = "12px solid transparent";
                    triangleEle.style.borderTop = "12px solid #888";
                    triangleEle.style.borderBottom = "12px solid transparent";
                    triangleEle.style.position = "absolute";
                    triangleEle.style.bottom = "-25px";
                    triangleEle.style.left = "65px";

                    const promptDivEle = createElement("div");
                    promptDivEle.style.position = "absolute";
                    promptDivEle.style.width = "198px";
                    promptDivEle.style.height = "68px";
                    promptDivEle.style.border = "2px solid #888";
                    promptDivEle.style.boxShadow = "0 0 8px #888";
                    promptDivEle.style.borderRadius = "5px";
                    promptDivEle.style.background = "#fff";
                    promptDivEle.style.zIndex = "39";

                    let y = event.clientY - 68 - 15;
                    if (y < 0) {
                      y = 0;
                    }

                    let x = event.clientX - 78;
                    if (x < 0) {
                      x = 0;
                    }

                    promptDivEle.style.top = y + "px";
                    promptDivEle.style.left = x + "px";

                    promptDivEle.appendChild(textDiv);
                    promptDivEle.appendChild(btnGroupEle);
                    promptDivEle.appendChild(triangleEle);
                    mask.appendChild(promptDivEle);
                    document.body.appendChild(mask);
                  }
                );
                if (!confimEle) {
                  this._drageSealAddConfim = false;
                  this._updateView();
                  return;
                }
              }
              let signFileInfo: FileInfo;
              try {
                const r = this._actionSealInterface.addSeal(signSealInfo);
                if (r instanceof Promise) {
                  signFileInfo = await r;
                } else {
                  signFileInfo = r;
                }
              } catch (e) {
                console.warn(
                  "调用签章方法出错, 签章终止,错误信息: ",
                  (e as any).message
                );
                if (confimEle) {
                  confimEle.remove();
                }
                this._drageSealAddConfim = false;
                this._updateView();
                return;
              }

              this._imgFile = signFileInfo;

              if (!signFileInfo) {
                if (confimEle) {
                  confimEle.remove();
                }
                this._drageSealAddConfim = false;
                this._updateView();
                return;
              }

              console.log("文件信息: ", signFileInfo);
              try {
                const imgInfo = await this._actionLoadInterface.getPageInfo(
                  signFileInfo.id,
                  pageNum
                );
                if (
                  this._type === ReaderType.HorizontalAll ||
                  this._type === ReaderType.VerticalAll
                ) {
                  this._imgs[pageNum - 1] = imgInfo;
                } else {
                  this._currentImg = imgInfo;
                }
                if (confimEle) {
                  confimEle.remove();
                }
                // this.cancelDragSeal();
              } catch (e) {
                console.warn("获取签章之后的文件失败: ", (e as any).message);
              } finally {
                if (confimEle) {
                  confimEle.remove();
                }
                this._drageSealAddConfim = false;
                this._updateView();
              }
            },
          },
        })
      );
    }

    const style: any = {
      position: "relative",
    };

    if (isHorizontalAll) {
      style.marginLeft = "28px";
      // style.float = "left";
      style.display = "inline-block";
    }

    return h(
      "div.file-img" + className,
      {
        style,
      },
      [
        h(
          "div",
          {
            style: {
              position: "absolute",
              bottom: isHorizontalAll ? "28px" : "8px",
              left: "49%",
              color: "#888",
            },
          },
          `${param.currentPage} / ${param.totalPage}页`
        ),
        h(
          "div.bk-rdear-content-img",
          {
            style: {
              width: width + "px",
              height: height + "px",
              border: "1px solid #888",
              boxShadow: "0 0 8px #888",
              paddingBottom: "28px",
              position: "relative",
              overflow: "hidden",
            },
          },
          [
            ...seals,
            sealNode,
            h("img." + pageName, {
              props: {
                width: width,
                height: height,
                src: param.imgInfo.url,
              },
              on: {
                mousedown: (event) => {
                  event.preventDefault();

                  if (
                    this._dragSealStart &&
                    this._dragSealInfo &&
                    this._actionSealInterface?.addSeal
                  ) {
                    event.stopPropagation();
                    return;
                  }

                  this.cancelDragSeal();
                },
                mousemove: (event) => {
                  if (
                    !this._dragSealStart ||
                    !this._dragSealInfo ||
                    !this._actionSealInterface?.addSeal
                  ) {
                    return;
                  }
                  event.stopPropagation();
                  event.preventDefault();
                  this._drageSealCurrentPage = (event.target as any).className;
                  this._updateView();
                },
                // mouseover: (event) => {
                //   if (!this._dragSealStart || !this._dragSealInfo) {
                //     return;
                //   }
                //   console.log("鼠标进入...");
                //   this._drageSealCurrentPage = (event.target as HTMLElement).className;
                // },
                // mouseleave: (event) => {
                //   if (typeof this._drageSealCurrentPage === "undefined") {
                //     return;
                //   }
                //   this._drageSealCurrentPage = undefined;
                //   this._updateView();
                // },
                // mousemove: (event) => {
                //   if (!this._dragSealStart || !this._dragSealInfo) {
                //     return;
                //   }
                //   event.preventDefault();
                //   event.stopPropagation();

                //   const currentEle = event.target as HTMLElement;
                //   const eleRect = currentEle.getBoundingClientRect();
                //   const x = event.clientX - eleRect.left;
                //   const y = event.clientY - eleRect.top;
                //   if (x <= 0 || y <= 0) {
                //     this._drageSealCurrentPage = undefined;
                //   }
                //   console.log("pdf img mouse move => x: ", x, ", y: ", y);
                //   this._updateView();
                // },
              },
            }),
          ]
        ),
      ]
    );
  };

  /**
   * 检测页面上的印章信息
   * @returns 页面上的印章信息
   * @ignore
   */
  private _checkSealNode: () => PageSealInfo | null = () => {
    if (!this._imgFile || !this._imgFile.signatures) {
      return null;
    }

    if (
      !this._sealContextParam ||
      (!this._sealContextParam.event && !this._sealContextParam.menuItems)
    ) {
      return null;
    }

    const sealInfos: PageSealInfo = {};
    for (let i = 0; i < this._imgFile.signatures.length; i++) {
      const signature = this._imgFile.signatures[i];
      const pageName = "page-" + signature.page;
      let pageSeals = sealInfos[pageName];
      if (!pageSeals) {
        pageSeals = [];
        sealInfos[pageName] = pageSeals;
      }

      const haveZoom = this._showZoom && !!this._zoom;

      let { x1, x2, y1, y2 } = signature.position;

      if (haveZoom) {
        x1 = this._zoom!.calcPercentage(x1);
        x2 = this._zoom!.calcPercentage(x2);
        y1 = this._zoom!.calcPercentage(y1);
        y2 = this._zoom!.calcPercentage(y2);
      }

      // 28是阅读器的padding-bottom
      // 2 是边框大小
      const bottom = y1 + 28 - 2 + "px";
      const left = x1 - 2 + "px";

      const width = x2 - x1 + "px";
      const height = y2 - y1 + "px";

      pageSeals.push(
        h("div.seal-node", {
          on: {
            contextmenu:
              this._sealContextParam.event ||
              ((event) => {
                event.stopPropagation();
                event.preventDefault();
                document.body.click();
                const currentEle = event.target as HTMLElement;
                currentEle.style.border = "2px solid red";
                currentEle.style.background = "rgba(255, 0,0,.2)";

                const contextMenuDiv = createElement("div");
                contextMenuDiv.style.position = "absolute";
                contextMenuDiv.style.top = event.clientY + "px";
                contextMenuDiv.style.left = event.clientX + "px";
                const menuItems = this._sealContextParam!.menuItems!;
                const contextMenu = new ContextMenuEle({
                  menuItems,
                });
                contextMenu.renderTo(contextMenuDiv);
                document.body.appendChild(contextMenuDiv);

                const documentClick = () => {
                  contextMenuDiv.remove();
                  currentEle.style.border = "";
                  currentEle.style.background = "";
                  document.removeEventListener("click", documentClick);
                };

                document.addEventListener("click", documentClick);
              }),
          },
          style: {
            position: "absolute",
            bottom,
            left,
            width,
            height,
          },
        })
      );
    }
    return sealInfos;
  };

  /**
   * 鼠标移动事件
   * @ignore
   */
  private _documentMouseMoveEvent = () => {
    if (
      !this._dragSealStart ||
      !this._dragSealInfo ||
      !this._drageSealCurrentPage ||
      this._drageSealAddConfim
    ) {
      return;
    }
    this._drageSealCurrentPage = undefined;
    this._updateView();
  };

  /**
   * 是否可以进行页面操作
   * @returns 是/否
   * @ignore
   */
  private _canPageOperation: () => boolean = () => {
    return (this._type === ReaderType.Single &&
      this._imgFile &&
      this._imgFile.totalSize > 1) as any;
  };

  /**
   * 构造一个阅读器
   * @param _params 构造参数
   */
  constructor(private _params: ReaderConstructor) {
    document.addEventListener("mousemove", this._documentMouseMoveEvent);
    this._sealContextParam = _params.sealContextMenu;
    this._actionLoadInterface = _params.action.loadFileInterface;

    if (_params.action.sealInterface) {
      this._actionSealInterface = _params.action.sealInterface;
    }

    if (_params.className) {
      this._className = _params.className;
    }
    this._styles = _params.styles;

    if (_params.type) {
      this._type = _params.type;
    }

    if (_params.zoom) {
      if (_params.zoom.show) {
        this._showZoom = true;
      } else {
        this._showZoom = false;
      }

      if (_params.zoom.zoomInterface) {
        this._zoom = _params.zoom.zoomInterface;
      }
    }

    this._vm_node = this._viewReader();
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
   * 让一个印章跟随鼠标在阅读器内显示
   * @param sealInfo 印章信息
   */
  public dragSeal(sealInfo: SealInfo): void {
    if (!this._actionSealInterface) {
      console.warn("没有可用的盖章动作，拖拽盖章事件被忽略");
      this.cancelDragSeal();
      return;
    }
    if (!sealInfo.positionBase) {
      sealInfo.positionBase = "center";
    }
    this._dragSealStart = true;
    this._dragSealInfo = sealInfo;
    this._drageSealPositionInfo = undefined;
    this._updateView();
  }

  /**
   * 取消印章的鼠标跟随效果.
   */
  public cancelDragSeal(): void {
    this._dragSealStart = false;
    this._dragSealInfo = undefined;
    this._drageSealPositionInfo = undefined;
    this._drageSealCurrentPage = undefined;
    this._updateView();
  }

  /**
   * 更新阅读器内容
   * @param data 更新参数
   */
  public updateView = (data?: ReaderConstructor) => {
    if (data) {
      if (data.sealContextMenu) {
        this._sealContextParam = {
          ...this._sealContextParam,
          ...data.sealContextMenu,
        };
      }

      if (data.action && data.action.loadFileInterface) {
        this._actionLoadInterface = {
          ...this._actionLoadInterface,
          ...data.action.loadFileInterface,
        };
      }

      if (data.type) {
        this._type = data.type;
      }

      if (data.zoom) {
        if (data.zoom.show) {
          this._showZoom = true;
        } else {
          this._showZoom = false;
        }

        if (data.zoom.zoomInterface) {
          this._zoom = data.zoom.zoomInterface;
        }
      }
    }
    this._updateView();
  };

  /**
   * 将阅读器内容渲染到HTML节点上
   * @param ele 要渲染到的元素
   */
  public renderTo(ele: HTMLElement | VNode): void {
    if (ele instanceof HTMLElement) {
      const tmpEle = createElement("div");
      ele.appendChild(tmpEle);
      this._vm_node = this._vm_patch(tmpEle, this._vm_node);
      return;
    }

    throw new Error("Method not implemented.");
  }

  /**
   * 加载文件
   * @param file 要加载的文件信息
   */
  public async loadFile(file: File | string): Promise<void> {
    this._contentLoading = true;
    this._contentLoadingExecOk = false;
    this._contentLoadStart = false;
    this._imgFile = undefined;
    this._contentLoadingAutoClose = true;
    this._currentIndex = 1;
    this._currentImg = undefined;
    // this._contentLoadOne = false;
    this._updateView();

    const haveElectron = !!window.require;
    try {
      if (file instanceof File) {
        const haveReader = (window as any).FileReader;

        if (
          !this._actionLoadInterface.filePathConvert &&
          !this._actionLoadInterface.fileReaderConvert &&
          !this._actionLoadInterface.fileConvertPng
        ) {
          throw new Error("未能找到可用的文件获取方式");
        }
        if (haveReader && this._actionLoadInterface.fileReaderConvert) {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          this._imgFile = await this._actionLoadInterface.fileReaderConvert(
            fileReader
          );
        } else if (this._actionLoadInterface.fileConvertPng) {
          this._imgFile = await this._actionLoadInterface.fileConvertPng(file);
        } else {
          throw new Error("没有环境可用的文件获取方式");
        }
      } else {
        if (haveElectron && this._actionLoadInterface.filePathConvert) {
          this._imgFile = await this._actionLoadInterface.filePathConvert(file);
        } else if (this._actionLoadInterface.fileBase64Convert) {
          this._imgFile = await this._actionLoadInterface.fileBase64Convert(
            file
          );
        } else {
          throw new Error("未被实现的文件获取方式");
        }
      }
    } catch (e) {
      this._contentLoading = false;
      this._updateView();
      throw e;
    }

    if (!this._imgFile) {
      this._contentLoading = false;
      this.updateView();
      throw new Error("文件信息加载失败");
    }

    this._currentImg = undefined;
    this._imgs = {};
    this._updateView();
  }

  /**
   * 下一页(`type=ReaderType.Signle 时生效`)
   */
  nextPage(): void {
    if (!this.canNextPage()) {
      console.warn("不支持分页操作或已加载至末尾");
      return;
    }

    this._currentIndex += 1;
    this._currentImg = undefined;

    this._contentLoading = true;
    this._contentLoadingExecOk = false;
    this._contentLoadStart = false;
    this._contentLoadingAutoClose = true;
    this._updateView();
  }
  /**
   * 上一页(`type=ReaderType.Signle 时生效`)
   */
  prevPage(): void {
    if (!this.canPrevPage()) {
      console.warn("不支持分页操作或已加载至顶端");
      return;
    }
    this._currentIndex -= 1;
    this._currentImg = undefined;

    this._contentLoading = true;
    this._contentLoadingExecOk = false;
    this._contentLoadStart = false;
    this._contentLoadingAutoClose = true;
    this._updateView();
  }
  /**
   * 是否有下一页(`type=ReaderType.Signle 时生效`)
   * @returns 是/否
   */
  canNextPage(): boolean {
    return (
      this._canPageOperation() && this._currentIndex < this._imgFile!.totalSize
    );
  }
  /**
   * 是否有上一页(`type=ReaderType.Signle 时生效`)
   * @returns 是/否
   */
  canPrevPage(): boolean {
    return this._canPageOperation() && this._currentIndex > 1;
  }
  /**
   * 是否可以进行分页切换操作(`type=ReaderType.Signle 时生效`)
   * @returns 是/否
   */
  canPage(): boolean {
    return this._canPageOperation();
  }
  /**
   * 跳转到指定页码(`type=ReaderType.Signle 时生效`)
   * @param page 要跳转的页面
   */
  breakPage(page: number): void {
    if (!this.canPage()) {
      console.warn("不支持分页操作");
      return;
    }
    if (page < 1 || page > this._imgFile!.totalSize) {
      console.warn(
        "要跳转的页面范围不正确, 应大于等于1并且小于等于" +
          this._imgFile!.totalSize
      );
      return;
    }
    this._currentIndex = page;
    this._currentImg = undefined;

    this._contentLoading = true;
    this._contentLoadingExecOk = false;
    this._contentLoadStart = false;
    this._contentLoadingAutoClose = true;
    this._updateView();
  }
  /**
   * 当前页码(`type=ReaderType.Signle 时生效`)
   * @returns 页码
   */
  currentPage(): number {
    if (!this.canPage()) {
      throw new Error("不支持分页操作无法获取当前页");
    }
    return this._currentIndex;
  }
  /**
   * 总页数(`type=ReaderType.Signle 时生效`)
   * @returns 总页数
   */
  totalPageSize(): number {
    if (!this.canPage()) {
      throw new Error("不支持分页操作无法获取当前页");
    }
    return this._imgFile!.totalSize;
  }
}
