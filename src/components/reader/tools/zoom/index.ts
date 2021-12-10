import { ReaderActionInterface } from "../..";
import { UpdateViewInterface } from "../../../..";
import { h } from "../../../../snabbdom";
import { ZoomInterface } from "../../types";

export class Zoom implements ZoomInterface {
  // 当前百分比, 默认百分之百
  private _currentPercentage: number = 100;
  private _intervalId: any;

  public constructor(
    private _reader: ReaderActionInterface & UpdateViewInterface<any>
  ) {
    document.addEventListener("mouseup", () => {
      clearInterval(this._intervalId);
    });
  }

  prcentageRestore: (num: number) => number = (num) => {
    return num / (this._currentPercentage / 100);
  };

  calcPercentage = (num: number) => {
    return num * (this._currentPercentage / 100);
  };

  getNode = () => {
    return h("div.bk-reader-content-tool-zoom", [
      // 缩小
      h(
        "div.tool-zoom-shrink",
        {
          on: {
            click: () => {
              this._currentPercentage -= 1;
              if (this._currentPercentage <= 1) {
                this._currentPercentage = 1;
              }
              this._reader.updateView();
            },
            mousedown: (event) => {
              event.stopPropagation();
              event.preventDefault();
              clearInterval(this._intervalId);
              this._intervalId = setInterval(() => {
                this._currentPercentage -= 1;
                this._reader.updateView();
              }, 100);
            },
          },
        },
        "-"
      ),
      // 放大
      h(
        "div.tool-zoom-enlarge",
        {
          on: {
            click: () => {
              this._currentPercentage += 1;
              this._reader.updateView();
            },
            mousedown: (event) => {
              event.stopPropagation();
              event.preventDefault();
              clearInterval(this._intervalId);
              this._intervalId = setInterval(() => {
                this._currentPercentage += 1;
                this._reader.updateView();
              }, 100);
            },
          },
        },
        "+"
      ),
      // 当前百分比
      h("div.tool-zoom-current-percentage", [
        h("input", {
          on: {
            keydown: (event) => {
              const key = parseInt(event.key);
              const keyStr = event.key.toLowerCase();
              const isAllowKey =
                keyStr === "arrowleft" ||
                keyStr === "backspace" ||
                keyStr === "arrowright" ||
                keyStr === "delete";
              //   console.log(isAllowKey);
              if (isNaN(key)) {
                if (!isAllowKey) {
                  event.preventDefault();
                  event.stopPropagation();
                  return;
                }

                // if (keyStr === "backspace") {
                //   if ((event.target as any).value.length <= 1) {
                //     event.preventDefault();
                //     event.stopPropagation();
                //     (event.target as any).value = "1";
                //   }
                // }

                return;
              }
            },
            keyup: (event) => {
              event.preventDefault();
              event.stopPropagation();
              const val = (event.target as any).value;
              if (val === "") {
                return;
                //     this._currentPercentage = 1;
                //     (event.target as any).value = "1";
                //     this._reader.updateReaderView();
                //     return;
              }
              const numVal = parseInt(val);
              if (isNaN(numVal)) {
                return;
              }
              if (this._currentPercentage !== numVal) {
                this._currentPercentage = numVal;
                this._reader.updateView();
              }
            },
          },
          props: {
            value: this._currentPercentage,
          },
        }),
        h("span", "%"),
      ]),
    ]);
  };
}
