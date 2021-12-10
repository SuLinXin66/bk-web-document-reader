import { RenderInterface } from "../../types";
import { ReaderLoadInterface, ReaderSealSignatureInterface, ReaderSealInterface, SealInfo } from "../../action/interface";
import { VNode } from "../../snabbdom";
import { ZoomInterface } from "./types";
import { MenuItem } from "../contextmenu";
import { UpdateViewInterface } from "../..";
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
export declare enum ReaderType {
    /**
     * 竖着展示所有
     */
    VerticalAll = 0,
    /**
     * 横着展示所有
     */
    HorizontalAll = 1,
    /**
     * 单页
     */
    Single = 2
}
/**
 * 阅读器
 */
export declare class Reader implements ReaderSealInterface, SignleActionInterface, RenderInterface, ReaderActionInterface, UpdateViewInterface<ReaderConstructor> {
    private _params;
    /**
     * 虚拟节点
     * @ignore
     */
    private _vm_node;
    /**
     * 虚拟节点派发函数
     * @ignore
     */
    private _vm_patch;
    /**
     * 文件加载动作
     * @ignore
     */
    private _actionLoadInterface;
    /**
     * 印章操作动作
     * @ignore
     */
    private _actionSealInterface;
    /**
     * className
     * @ignore
     */
    private _className;
    /**
     * style样式
     * @ignore
     */
    private _styles?;
    /**
     * 图片信息
     * @ignore
     */
    private _imgFile?;
    /**
     * 图片列表
     * @ignore
     */
    private _imgs;
    /**
     * 当前页面的图片
     * @ignore
     */
    private _currentImg?;
    /**
     * 当前页面索引
     * @ignore
     */
    private _currentIndex;
    /**
     * 是否显示缩放
     * @ignore
     */
    private _showZoom;
    /**
     * 缩放接口
     * @ignore
     */
    private _zoom;
    /**
     * 阅读器类型
     * @ignore
     */
    private _type;
    /**
     * 内容移动是否开始
     * @ignore
     */
    private _contentPositionMoveStart;
    /**
     * 内容移动x坐标
     * @ignore
     */
    private _contentPositionMovePrevX;
    /**
     * 内容移动y坐标
     * @ignore
     */
    private _contentPositionMovePrevY;
    /**
     * 内容滚动条左侧边距
     * @ignore
     */
    private _contentPositionMoveScrollLeft;
    /**
     * 内容滚动条顶部边距
     * @ignore
     */
    private _contentPositionMoveScrollTop;
    /**
     * 内容是否等待加载
     * @ignore
     */
    private _contentLoading;
    /**
     * 内容是否执行过加载
     * @ignore
     */
    private _contentLoadingExecOk;
    /**
     * 内容加载是否已经开始
     * @ignore
     */
    private _contentLoadStart;
    /**
     * 内容加载框是否自动关闭
     * @ignore
     */
    private _contentLoadingAutoClose;
    /**
     * 拖拽是否开始
     * @ignore
     */
    private _dragSealStart;
    /**
     * 拖拽信息
     * @ignore
     */
    private _dragSealInfo;
    /**
     * 拖拽坐标信息
     * @ignore
     */
    private _drageSealPositionInfo;
    /**
     * 拖拽当前页信息
     * @ignore
     */
    private _drageSealCurrentPage;
    /**
     * 拖拽确认中
     * @ignore
     */
    private _drageSealAddConfim;
    /**
     * 印章右键上下文信息
     * @ignore
     */
    private _sealContextParam;
    /**
     * 内部更新视图
     * @ignore
     */
    private _updateView;
    /**
     * 加载页面信息
     * @param fileId 文件ID
     * @param currentPage 当前加载页
     * @ignore
     */
    private _loadPngInfo;
    /**
     * 加载所有页面
     * @ignore
     */
    private _loadPngAllInfo;
    /**
     * 构造阅读器虚拟视图节点
     * @returns 阅读器虚拟节点
     * @ignore
     */
    private _viewReader;
    /**
     * 渲染阅读器内容节点
     * @returns 虚拟节点
     * @ignore
     */
    private _renderReaderContent;
    /**
     * 构造页面信息显示节点
     * @param param 参数
     * @param isHorizontalAll 是否垂直显示所有
     * @returns 页面信息节点
     * @ignore
     */
    private _generateImgVnode;
    /**
     * 检测页面上的印章信息
     * @returns 页面上的印章信息
     * @ignore
     */
    private _checkSealNode;
    /**
     * 鼠标移动事件
     * @ignore
     */
    private _documentMouseMoveEvent;
    /**
     * 是否可以进行页面操作
     * @returns 是/否
     * @ignore
     */
    private _canPageOperation;
    /**
     * 构造一个阅读器
     * @param _params 构造参数
     */
    constructor(_params: ReaderConstructor);
    /**
     * 让一个印章跟随鼠标在阅读器内显示
     * @param sealInfo 印章信息
     */
    dragSeal(sealInfo: SealInfo): void;
    /**
     * 取消印章的鼠标跟随效果.
     */
    cancelDragSeal(): void;
    /**
     * 更新阅读器内容
     * @param data 更新参数
     */
    updateView: (data?: ReaderConstructor | undefined) => void;
    /**
     * 将阅读器内容渲染到HTML节点上
     * @param ele 要渲染到的元素
     */
    renderTo(ele: HTMLElement | VNode): void;
    /**
     * 加载文件
     * @param file 要加载的文件信息
     */
    loadFile(file: File | string): Promise<void>;
    /**
     * 下一页(`type=ReaderType.Signle 时生效`)
     */
    nextPage(): void;
    /**
     * 上一页(`type=ReaderType.Signle 时生效`)
     */
    prevPage(): void;
    /**
     * 是否有下一页(`type=ReaderType.Signle 时生效`)
     * @returns 是/否
     */
    canNextPage(): boolean;
    /**
     * 是否有上一页(`type=ReaderType.Signle 时生效`)
     * @returns 是/否
     */
    canPrevPage(): boolean;
    /**
     * 是否可以进行分页切换操作(`type=ReaderType.Signle 时生效`)
     * @returns 是/否
     */
    canPage(): boolean;
    /**
     * 跳转到指定页码(`type=ReaderType.Signle 时生效`)
     * @param page 要跳转的页面
     */
    breakPage(page: number): void;
    /**
     * 当前页码(`type=ReaderType.Signle 时生效`)
     * @returns 页码
     */
    currentPage(): number;
    /**
     * 总页数(`type=ReaderType.Signle 时生效`)
     * @returns 总页数
     */
    totalPageSize(): number;
}
