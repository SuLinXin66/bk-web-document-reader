import { Layout, LayoutContructor } from "../../layout";
import { Reader, ReaderConstructor } from "../../components/reader";
import { SideToolbarsContructor } from "../../components/sideToolbar";
import { ToolbarConstructor } from "../../components/toolbars";
import { Toolbars } from "../../components/toolbars";
import { SideToolbar } from "../../components/sideToolbar";
import { UpdateViewInterface } from "../..";
import { ReaderSealInterface, SealInfo } from "../../action/interface";
import {
  BottomToolbarConstructor,
  BottomToolbar,
} from "../../components/bottomToolbar";

/**
 * 阅读器参数.
 */
export interface ReaderParams {
  /**
   * 顶部工具栏配置.
   */
  toolbars?: ToolbarConstructor & {
    /**
     * className.
     */
    className?: string;

    /**
     * 是否隐藏, 默认显示.
     */
    hide?: boolean;
  };
  /**
   * 侧边工具栏.
   */
  sideTollbars?: SideToolbarsContructor & {
    /**
     * className.
     */
    className?: string;
    /**
     * 是否隐藏, 默认显示.
     */
    hide?: boolean;
  };
  /**
   * 底部工具栏.
   */
  bottomToolbars?: BottomToolbarConstructor & {
    /**
     * className.
     */
    className?: string;
    /**
     * 是否显示, 默认隐藏.
     */
    show?: boolean;
  };
  /**
   * 阅读器相关参数.
   */
  reader: ReaderConstructor;
}

/**
 * 默认参数.
 */
const defaultReaderParams: ReaderParams = {
  toolbars: {
    btns: [
      {
        text: "测试",
      },
    ],
  },
  sideTollbars: {},
  reader: {
    action: {
      loadFileInterface: {
        fileBase64Convert: () => {
          throw new Error("未实现的方法");
        },

        filePathConvert: () => {
          throw new Error("未实现的方法");
        },
        fileReaderConvert: () => {
          throw new Error("未实现的方法");
        },
        getPageInfo: () => {
          throw new Error("未实现的方法");
        },
      },
    },
  },
};

/**
 * 自动布局阅读器.
 */
export class AutoRender
  implements UpdateViewInterface<ReaderParams>, ReaderSealInterface {
  /**
   * 布局对象.
   * @ignore
   */
  private _layout: Layout | undefined;

  /**
   * 阅读器对象.
   * @ignore
   */
  private _reader: Reader | undefined;

  /**
   * 布局对象构造参数.
   * @ignore
   */
  private _layoutContent: LayoutContructor | undefined;

  // constructor(layout: Layout, reader: Reader) {
  /**
   * 构造阅读器
   * @param _ele 要绑定到的元素
   */
  constructor(private _ele: HTMLElement) {}

  /**
   * 初始化布局视图
   * @param params 参数
   */
  public initView = (params: ReaderParams = defaultReaderParams) => {
    this._layoutContent = {};

    // if (!params.toolbars.hide) {
    const toolbars = new Toolbars(params.toolbars);

    this._layoutContent.top = {
      ...params.toolbars,
      content: toolbars,
    };
    // }

    // if (!params.sideTollbars.hide) {
    const sideToobars = new SideToolbar(params.sideTollbars);
    this._layoutContent.left = {
      ...params.sideTollbars,
      content: sideToobars,
    };
    // }

    const botttomToolBars = new BottomToolbar(params.bottomToolbars);
    this._layoutContent.bottom = {
      ...params.bottomToolbars,
      hide: !params.bottomToolbars?.show,
      content: botttomToolBars,
    };

    const reader = new Reader(params.reader);
    this._layoutContent.center = {
      content: reader,
    };
    this._layout = new Layout(this._layoutContent);
    this._reader = reader;

    this._layout.renderTo(this._ele);
  };

  /**
   * 更新布局
   * @param data 要更新的数据
   */
  updateView(data?: ReaderParams) {
    if (!data) {
      data = {} as ReaderParams;
    }

    if (!this._layout || !this._reader) {
      this.initView(data);
      return;
    }
    if (!this._layoutContent) {
      this._layoutContent = {};
    }

    if (data.sideTollbars) {
      this._layoutContent.left = {
        ...this._layoutContent.left,
        ...data.sideTollbars,
      };
    }

    if (data.toolbars) {
      this._layoutContent.top = {
        ...this._layoutContent.top,
      };
    }

    this._layout.updateView(this._layoutContent);
    this._reader.updateView(data.reader);
  }

  /**
   * 加载文件到阅读器中.
   * @param file
   * > 将要加载的文件<br />
   * > 传入字符串:
   * > 1. 浏览器环境 <br />
   * > &nbsp;&nbsp;调用顺序如下(**命中一个终止查找**):<br />
   * > &nbsp;&nbsp;1. {@link ReaderLoadInterface.fileBase64ConvertPng} <br />
   * > &nbsp;&nbsp;2. {@link ReaderLoadInterface.filePathConvertPng} <br />
   * > &nbsp;&nbsp;3. `throw new Error("未被实现的文件获取方式");`
   * > 2. Electron环境<br />
   * > &nbsp;&nbsp;调用顺序如下(**命中一个终止查找**):<br />
   * > &nbsp;&nbsp;1. {@link ReaderLoadInterface.filePathConvertPng} <br />
   * > &nbsp;&nbsp;2. {@link ReaderLoadInterface.fileBase64ConvertPng} <br />
   * > &nbsp;&nbsp;3. `throw new Error("未被实现的文件获取方式");`
   * > 传入File对象:
   * > 1. 当前环境中具有`FileReader`对象.<br/>
   * > &nbsp;&nbsp;调用顺序如下(**命中一个终止查找**):<br />
   * > &nbsp;&nbsp;1. {@link ReaderLoadInterface.fileReaderConvert}
   * > &nbsp;&nbsp;2. {@link ReaderLoadInterface.fileConvertPng}
   * > &nbsp;&nbsp;3. `throw new Error("没有环境可用的文件获取方式");`
   * > 2. 当前环境中不具有`FileReader`对于下部分<br />
   * > &nbsp;&nbsp;调用顺序如下(**命中一个终止查找**):<br />
   * > &nbsp;&nbsp;1. {@link ReaderLoadInterface.fileConvertPng}<br />
   * > &nbsp;&nbsp;2. `throw new Error("没有环境可用的文件获取方式");`
   * @returns 等待加载完成
   */
  public loadFile(file: string | File): Promise<void> {
    if (!this._reader) {
      throw "请先初始化布局";
    }
    return this._reader.loadFile(file);
  }

  public dragSeal(sealInfo: SealInfo) {
    if (!this._reader) {
      throw "请先初始化布局";
    }
    this._reader.dragSeal(sealInfo);
  }

  public cancelDragSeal() {
    if (!this._reader) {
      throw "请先初始化布局";
    }
    this._reader.cancelDragSeal();
  }

  // renderTo = (ele: HTMLElement) => {
  //   this._layout.renderTo(ele);
  // };
}
