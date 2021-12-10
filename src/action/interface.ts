/**
 * 文件信息
 */
export interface FileInfo {
  /**
   * 文件唯一标识
   */
  id: string;
  /**
   * 文件名称
   */
  name: string;
  /**
   * 总页数
   */
  totalSize: number;
  /**
   * 签章信息
   */
  signatures?: SignatureInfo[];
}

/**
 * 签章信息
 */
export interface SignatureInfo {
  /**
   * id.
   */
  id: string;
  /**
   * 页码
   */
  page: number;
  /**
   * 位置信息
   * ```typescript
   * // 坐标系以pdf坐标系为准, 左下角为起始点
   * // x1+y1 左下点
   * // x2+y2 右上点
   * ```
   */
  position: {
    /**
     * 左下x
     */
    x1: number;
    /**
     * 左下y
     */
    y1: number;

    /**
     * 右上x
     */
    x2: number;
    /**
     * 右上y
     */
    y2: number;
  };
}

/**
 * 图片信息.
 */
export interface PngInfo {
  /**
   * 图片访问地址
   */
  url: string;
  /**
   * 宽度（px）
   */
  width: number;
  /**
   * 高度（px）
   */
  height: number;
}

/**
 * 阅读器加载业务接口,需要调用方自行实现
 */
export interface ReaderLoadInterface {
  /**
   * base64文件转换文件信息
   * @param base64Str 待转换的base64文件
   * @returns 文件信息
   */
  fileBase64Convert?(base64Str: string): Promise<FileInfo>;
  /**
   * 文件路径转换文件信息
   * @param path 文件路径
   * @returns 文件信息
   */
  filePathConvert?(path: string): Promise<FileInfo>;
  /**
   * 文件读取流转换文件信息( 通用浏览器的方案 )
   * @param reader 文件读取流
   * @returns 文件信息
   */
  fileReaderConvert?(reader: FileReader): Promise<FileInfo>;
  /**
   * 文件转换成图片.
   */
  /**
   * 文件对象转换文件信息
   * @param file 文件
   * @returns 文件信息
   */
  fileConvertPng?(file: File): Promise<FileInfo>;
  /**
   * 获得png信息, 传入文件ID以及当前页码, 从1开始
   */
  /**
   * 获取文件某页信息
   * @param fileId 文件ID, {@link FileInfo}中的id
   * @param currentPage 要加载的页码, 从1开始
   */
  getPageInfo?(fileId: string, currentPage: number): Promise<PngInfo>;
  /**
   * 加载中, 可以覆盖此函数替换阅读器加载中的样式
   */
  /**
   * 文件或页面加载中或调用此函数，可以通过此函数做一些等待样式或别的事情<br />
   * @returns 返回true, 默认loading样式将不会在显示, 有本函数进行loading接管
   */
  loading?(): boolean | void;
  /**
   *
   * @param loadOkAll 是否全部加载完成
   * @param currentLoadPage 当前加载完成的页码
   */
  loadingOk?(loadOkAll: boolean, currentLoadPage: number): void;
}

/**
 * 印章信息
 */
export interface SealInfo {
  /**
   * 宽度（px）
   */
  width: number;
  /**
   * 高度（px）
   */
  height: number;
  /**
   * 印章图片路径
   */
  sealImgUrl: string;
  /**
   * 盖章时位置换算点, 以鼠标点击处为起点计算印章位置的方式, 默认为`center`
   */
  positionBase?: "center" | "leftTop" | "leftBottom";
  /**
   * 其他信息,可以随意添加
   */
  [key: string]: any;
}

/**
 * 阅读器印章动作接口
 */
export interface ReaderSealInterface {
  /**
   * 添加一个拖动印章，在调用{@link cancelDragSeal}之前, 只要鼠标在阅读器范围内，印章会始终跟随鼠标移动
   * @param sealInfo 印章信息
   */
  dragSeal(sealInfo: SealInfo): void;
  /**
   * 取消拖动印章, 取消{@link dragSeal}的状态
   */
  cancelDragSeal(): void;
}

/**
 * 签章方式回调
 */
export interface ReaderSealSignatureInterface {
  /**
   * 状态在{@link ReaderSealInterface.dragSeal}下，鼠标点击低啊用盖章回调
   * @param data 要盖章的信息
   * @returns 盖章成功之后的文件信息
   */
  addSeal(data: {
    /**
     * 要盖章的页码
     */
    pageNum: number;
    /**
     * x坐标, 以左下角为起点，并根据{@link ReaderSealInterface.dragSeal}中传入的`positionBase`计算完成坐标偏移之后的结果
     */
    x: number;
    /**
     * y坐标, 以左下角为起点，并根据{@link ReaderSealInterface.dragSeal}中传入的`positionBase`计算完成坐标偏移之后的结果
     */
    y: number;
    /**
     * {@link ReaderSealInterface.dragSeal}时传入的印章信息
     */
    sealInfo: SealInfo;
  }): FileInfo | Promise<FileInfo>;
  /**
   * 添加印章的确认
   * @param data 要盖章的信息
   * @returns true: 覆盖掉默认的提示样式, fakse: 不覆盖默认样式
   */
  addSealConfim?(data: {
    /**
     * 要盖章的页码
     */
    pageNum: number;
    /**
     * x坐标, 以左下角为起点，并根据{@link ReaderSealInterface.dragSeal}中传入的`positionBase`计算完成坐标偏移之后的结果
     */
    x: number;
    /**
     * y坐标, 以左下角为起点，并根据{@link ReaderSealInterface.dragSeal}中传入的`positionBase`计算完成坐标偏移之后的结果
     */
    y: number;
    /**
     * {@link ReaderSealInterface.dragSeal}时传入的印章信息
     */
    sealInfo: SealInfo;
  }): boolean | Promise<boolean>;
}
