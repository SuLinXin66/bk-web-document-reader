import { VNode } from "../../snabbdom";
import { RenderInterface } from "../../types";
import { createElement } from "../../utils";

export interface MenuItem {
  type: "separator" | "text";
  text?: string;
  onClick?: (event: MouseEvent) => void;
}

export interface ContextMenuConstructor {
  menuItems: MenuItem[];
}

export class ContextMenu implements RenderInterface {
  private _contextMenuDiv: HTMLElement;

  constructor(param: ContextMenuConstructor) {
    this._contextMenuDiv = createElement("div");
    const menuUl = createElement("ul");
    menuUl.style.width = "128px";
    menuUl.style.background = "#fff";
    menuUl.style.border = "1px solid #6e6e6e";
    menuUl.style.boxShadow = "0 0 8px #6e6e6e";
    menuUl.style.listStyle = "none";
    menuUl.style.margin = "0";
    menuUl.style.padding = "0";
    menuUl.style.borderRadius = "5px";
    for (let i = 0; i < param.menuItems.length; i++) {
      const menuItem = param.menuItems[i];
      const li = createElement("li");
      try {
        if (menuItem.type === "separator") {
          continue;
        }
        li.style.padding = "5px 2px 5px 12px";
        li.style.cursor = "pointer";
        li.onmouseout = () => {
          li.style.color = "#000";
          li.style.background = "none";
        };
        li.onmouseover = () => {
          li.style.background = "#6e6e6e";
          li.style.color = "#fff";
        };

        li.innerText = menuItem.text || "";
        if (menuItem.onClick) {
          li.onclick = menuItem.onClick;
        }
      } finally {
        menuUl.appendChild(li);
      }
    }
    this._contextMenuDiv.appendChild(menuUl);
  }

  public renderTo(ele: HTMLElement | VNode): void {
    if (!(ele instanceof HTMLElement)) {
      throw "不接受非HTMLElement元素";
    }
    ele.appendChild(this._contextMenuDiv);
  }
}
