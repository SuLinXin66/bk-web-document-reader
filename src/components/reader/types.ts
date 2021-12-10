import { VNode } from "../../snabbdom";

export interface ZoomInterface {
  // 计算百分比
  calcPercentage: (num: number) => number;
  // 还原百分比
  prcentageRestore: (num: number) => number;
}
