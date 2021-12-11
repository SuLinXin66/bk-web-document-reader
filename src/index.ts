import { AutoRender } from "./render/AutoRender";
import "./style";
import "./compatible";
import { ReaderType } from "./components/reader";

/**
 * 创建阅读器
 * @param ele 要绑定的元素
 * @returns 阅读器对外工作对象
 */
export function newReader(ele: HTMLElement): AutoRender {
  return new AutoRender(ele);
}

export { RenderInterface, UpdateViewInterface } from "./types";
export { ToolbarBtn, ToolbarConstructor } from "./components/toolbars";
export * as actions from "./action/interface";
export * as layout from "./layout";
export * as toolbar from "./components/toolbars";
export * as sideToolbar from "./components/sideToolbar";
export * as reader from "./components/reader";
export * as snabbdom from "./snabbdom";
export * as utils from "./utils";
export * as render from "./render/AutoRender";
export * from "./render/AutoRender";
