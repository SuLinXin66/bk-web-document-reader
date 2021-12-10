import { ReaderConstructor } from "../../components/reader";
import { SideToolbarsContructor } from "../../components/sideToolbar";
import { ToolbarConstructor } from "../../components/toolbars";
import { UpdateViewInterface } from "../..";
import { ReaderSealInterface, SealInfo } from "../../action/interface";
import { BottomToolbarConstructor } from "../../components/bottomToolbar";
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
 * 自动布局阅读器.
 */
export declare class AutoRender implements UpdateViewInterface<ReaderParams>, ReaderSealInterface {
    private _ele;
    /**
     * 布局对象.
     * @ignore
     */
    private _layout;
    /**
     * 阅读器对象.
     * @ignore
     */
    private _reader;
    /**
     * 布局对象构造参数.
     * @ignore
     */
    private _layoutContent;
    /**
     * 构造阅读器
     * @param _ele 要绑定到的元素
     */
    constructor(_ele: HTMLElement);
    /**
     * 初始化布局视图
     * @param params 参数
     */
    initView: (params?: ReaderParams) => void;
    /**
     * 更新布局
     * @param data 要更新的数据
     */
    updateView(data?: ReaderParams): void;
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
    loadFile(file: string | File): Promise<void>;
    dragSeal(sealInfo: SealInfo): void;
    cancelDragSeal(): void;
}
