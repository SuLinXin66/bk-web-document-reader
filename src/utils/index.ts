import { h, On, VNode } from "../snabbdom";

/**
 * 判断是否为IE浏览器.
 * @returns 是/否为IE浏览器
 */
export function isIE() {
  var ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("msie") > -1;
}

/**
 * 创建节点元素
 * @param targetName 标签名称
 * @returns HTML元素
 */
export function createElement(targetName: string) {
  if (isIE()) {
    try {
      return document.createElement(
        "<" + targetName + '"></' + targetName + ">"
      );
    } catch (e) {}
  }
  return document.createElement(targetName);
}

/**
 * Ie不支持通过className获取标签,以此扩展.
 * @param className class名称
 * @returns HTML元素
 */
export function getElementsByClassName(className: string): Array<HTMLElement> {
  const eles = document.getElementsByTagName("*");
  const eleLength = eles.length;
  const elements: Array<HTMLElement> = [];

  for (let i = 0; i < eleLength; i++) {
    const oCls = eles[i].className || "";
    if (oCls.indexOf(className) < 0) {
      continue;
    }

    const oClsArr = oCls.split(/\s+/);
    const oClsArrLength = oClsArr.length;
    for (let j = 0; j < oClsArrLength; j++) {
      if (className == oClsArr[j]) {
        elements.push(eles[i] as HTMLElement);
      }
    }
  }
  return elements;
}

/**
 * 添加事件,兼容IE.
 * @param ele HTML元素
 * @param eventName 事件名称
 * @param handle 事件处理器
 */
export function elementAddEvent(
  ele: HTMLElement | Window | Document,
  eventName: string,
  handle: (e?: Event) => void
) {
  // @ts-ignore
  if (!ele.saveEventHandle) {
    // @ts-ignore
    ele.saveEventHandle = [];
  }

  // @ts-ignore
  ele.saveEventHandle[eventName] = handle;

  // @ts-ignore
  if (window.addEventListener) {
    // @ts-ignore
    ele.addEventListener(eventName, ele.saveEventHandle[eventName], false);

    // @ts-ignore
  } else if (window.attachEvent) {
    // @ts-ignore
    ele.attachEvent(`on${eventName}`, ele.saveEventHandle[eventName]);
  } else {
    // @ts-ignore
    ele[`on${eventName}`] = ele.saveEventHandle[eventName];
  }
}

/**
 * 解除事件,要解除的事件必须通过elementAddEvent进行绑定.
 * @param ele HTML元素
 * @param event 事件名称
 */
export function elementRemoveEvent(
  ele: HTMLElement | Window | Document,
  event: string
): void {
  // @ts-ignore
  const handle = ele.saveEventHandle ? ele.saveEventHandle[event] : undefined;
  if (!handle) {
    return;
  }

  // @ts-ignore
  if (window.addEventListener) {
    ele.removeEventListener(event, handle, false);
    // @ts-ignore
  } else if (window.detachEvent) {
    // @ts-ignore
    ele.detachEvent(`on${event}`, handle);
  } else {
    // @ts-ignore
    ele[`on${event}`] = "";
  }
}

/**
 * 通过元素名称移除元素.
 * @param name 名称
 */
export function removeElementsByName(name: string): void {
  const forms = document.getElementsByName(name);
  for (let i = forms.length - 1; i >= 0; i--) {
    try {
      document.body.removeChild(forms[i]);
    } catch (e) {}
  }
}

/**
 * 虚拟节点转换，为解决外部构造虚拟节点不生效问题.
 * @param vnode 虚拟节点
 * @returns 虚拟节点
 */
export function vnodeConvert(vnode: VNode): VNode {
  const children: VNode[] = [];
  if (vnode.children && vnode.children.length > 0) {
    vnode.children.forEach((v) => {
      if (!v) {
        return;
      }
      if (typeof v === "string") {
        children.push(h(v));
        return;
      }

      children.push(vnodeConvert(v));
    });
  }
  return h(
    vnode.sel!,
    {
      ...vnode.data,
    },
    children
  );
}

/**
 * HTML元素转换为虚拟节点.
 * @param ele HTML元素
 * @param on 事件
 * @returns 虚拟节点
 */
export function htmlElementConvertToVNode(ele: HTMLElement, on?: On): VNode {
  const id = ele.id ? "#" + ele.id : "";

  const classes = ele.getAttribute("class");
  const c = classes ? "." + classes.split(" ").join(".") : "";
  const eleName = ele.tagName.toLowerCase() + id + c;

  const props: any = {};
  const attrs = ele.getAttributeNames();
  for (let i = 0; i < attrs.length; i++) {
    const attrName = attrs[i];
    if (
      attrName.toLowerCase() === "class" ||
      attrName.toLowerCase() === "id" ||
      attrName.toLowerCase() === "styles"
    ) {
      continue;
    }
    const attrVal = ele.getAttribute(attrName);
    props[attrName] = attrVal;
  }

  const childrenVnodes: any[] = [];
  let textVal = "";
  const childNodes = ele.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    const nodeType = node.nodeType;
    switch (nodeType) {
      case 1:
        childrenVnodes.push(htmlElementConvertToVNode(node as HTMLElement));
        break;
      case 3:
        textVal = document.body.childNodes[1].childNodes[0].nodeValue || "";
        break;
      default:
        continue;
    }
  }

  return h(
    eleName,
    {
      style: {
        ...(ele.style as any),
      },
      props,
    },
    childNodes.length > 0 ? [] : textVal
  );
}

/**
 * 添加style样式到head标签中
 * @param id styleId
 * @param styleStr style标签内的内容
 * @ignore
 */
export function addStyleTagToHead(id: string, styleStr: string) {
  let styleTag = document.getElementById(id);
  if (styleTag) {
    return;
  }
  styleTag = createElement("style");
  styleTag.id = id;
  styleTag.innerHTML = styleStr;
  const headTag = document.getElementsByTagName("head")[0];
  headTag.appendChild(styleTag);
}
