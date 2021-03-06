在 web 中中阅读文件并对文件进行签章的视图展示库, 底层采用图片进行展示，文件转换功能以及印章操作相关功能需由调用方自行完成，本库只提供基础接口

# 目录

<a href="#d1">安装</a> <br />
<a href="#d2">示例</a>

# <div id="d1">安装</div>

### 浏览器中使用

```html
<script src="https://raw.githubusercontent.com/SuLinXin66/bk-web-document-reader/main/dist/index-iife.min.js"></script>
```

<font color=red>**注: 如果要兼容 IE 系列浏览器请引用如下 js**</font>

```html
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
<script src="https://raw.githubusercontent.com/SuLinXin66/bk-web-document-reader/main/dist/index-iife-ie.min.js"></script>
```

### npm 中使用

```js
npm install --save @byzk/document-web-reader
```

### yarn 中使用

```js
yarn add @byzk/document-web-reader
```

# <div id="d2">示例</div>

## 浏览器中使用示例

```html
<!DOCTYPE html>
<html lang="zh_CN">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script type="text/javascript" src="./dist/index-iife-ie.min.js"></script>
    <style>
      #app {
        margin: 0;
        padding: 0;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
    </style>
    <style>
      .seal-list-content:first-child {
        margin-top: 18px;
      }

      .seal-list-content {
        padding: 12px 0;
        transition: all 0.5s;
        cursor: pointer;
      }

      .seal-list-content:hover,
      .seal-list-content.active {
        background-color: rgba(255, 255, 255, 0.8);
      }
    </style>
  </head>

  <body>
    <div id="app">我是APP</div>
    <input accept="application/pdf" type="file" id="file" />
  </body>

  <script>
    window.unitConversion = function () {
      /**
       * 获取DPI
       * @returns {Array}
       */
      this.conversion_getDPI = function () {
        var arrDPI = new Array();
        if (window.screen.deviceXDPI) {
          arrDPI[0] = window.screen.deviceXDPI;
          arrDPI[1] = window.screen.deviceYDPI;
        } else {
          var tmpNode = document.createElement("DIV");
          tmpNode.style.cssText =
            "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
          document.body.appendChild(tmpNode);
          arrDPI[0] = parseInt(tmpNode.offsetWidth);
          arrDPI[1] = parseInt(tmpNode.offsetHeight);
          tmpNode.parentNode.removeChild(tmpNode);
        }
        return arrDPI;
      };
      /**
       * px转换为mm
       * @param value
       * @returns {number}
       */
      this.pxConversionMm = function (value) {
        var inch = value / this.conversion_getDPI()[0];
        var c_value = inch * 33.8;
        //      console.log(c_value);
        return c_value;
      };
      /**
       * mm转换为px
       * @param value
       * @returns {number}
       */
      this.mmConversionPx = function (value) {
        var inch = value / 26.4;
        var c_value = inch * this.conversion_getDPI()[0];
        //      console.log(c_value);
        return c_value;
      };
    };
  </script>
  <script>
    const usbkeyServerUrl = "https://192.168.85.140:48000/api";
    // const usbkeyServerUrl = "https://127.0.0.1:48000/api";
    const unitConversion = new window.unitConversion();
    window.getSealList = async () => {
      try {
        // const passwd = window.prompt("请输入Key密码")
        const passwd = "88888888";
        const getUsbkeyCertAlgResult = await (
          await fetch(`${usbkeyServerUrl}/EPSAPP_GetUsbKeyCertAlg`, {
            method: "post",
          })
        ).json();
        if (getUsbkeyCertAlgResult.code !== 0) {
          throw new Error(getUsbkeyCertAlgResult.msg);
        }

        const serverSealListData = new URLSearchParams();
        serverSealListData.append("password", passwd);
        serverSealListData.append("keyType", getUsbkeyCertAlgResult.keyType);
        const serverSealList = await (
          await fetch(`${usbkeyServerUrl}/EPSAPP_GetServerStampList`, {
            method: "post",
            body: serverSealListData,
          })
        ).json();
        if (serverSealList.code !== 0) {
          throw new Error(serverSealList.msg);
        }
        return serverSealList.sealImgList;
      } catch (e) {
        alert("获取签章列表失败: " + e.message);
      }
    };

    window.addSeal = async (sealInfo) => {
      try {
        debugger;
        const getUsbkeyCertAlgResult = await (
          await fetch(`${usbkeyServerUrl}/EPSAPP_GetUsbKeyCertAlg`, {
            method: "post",
          })
        ).json();
        if (getUsbkeyCertAlgResult.code !== 0) {
          throw getUsbkeyCertAlgResult.msg;
        }

        // fetch(`${usbkeyServerUrl}/EPSAPP_GetFile`, {
        //     method: "post"
        // })

        const x = parseInt(unitConversion.pxConversionMm(sealInfo.x)) + "";
        const y = parseInt(unitConversion.pxConversionMm(sealInfo.y)) + "";

        const signatureStampExData = new URLSearchParams();
        signatureStampExData.append("password", "88888888");
        signatureStampExData.append("file", window.pdfFileBase64);
        signatureStampExData.append("keyType", getUsbkeyCertAlgResult.keyType);
        signatureStampExData.append(
          "qzList",
          JSON.stringify([
            {
              sealID: sealInfo.sealInfo.id,
              pageNum: sealInfo.pageNum + "",
              x,
              y,
            },
          ])
        );
        const signatureStampExResult = await (
          await fetch(`${usbkeyServerUrl}/EPSAPP_SignatureStampEx`, {
            method: "post",
            body: signatureStampExData,
          })
        ).json();
        if (signatureStampExResult.code !== 0) {
          throw new Error(signatureStampExResult.msg);
        }

        const lastFileResult = await (
          await fetch(`${usbkeyServerUrl}/EPSAPP_GetLastFile`, {
            method: "post",
          })
        ).json();
        if (lastFileResult.code !== 0) {
          throw new Error(lastFileResult.msg);
        }

        const signFile = lastFileResult.lastFile;

        const data = new FormData();
        data.append("data", signFile);
        const result = await fetch(
          "http://127.0.0.1:8061/pdf/convert/bas464/png",
          {
            method: "post",
            body: data,
          }
        );
        const jsonData = await result.json();
        if (jsonData.error) {
          throw new Error(jsonData.msg);
        }

        window.pdfFileBase64 = jsonData.result.base64File;

        return jsonData.result;
      } catch (e) {
        alert("添加印章失败 => " + e.message);
        return undefined;
      }
    };
  </script>
  <script>
    window.h = readerLib.snabbdom.h;
    window.onload = function () {
      var reader = readerLib.newReader(document.getElementById("app"));
      const sealContentList = [];

      const readerParam = {
        toolbars: {
          btns: [
            {
              text: "打开",
              on: {
                click: function () {
                  document.getElementById("file").click();
                },
              },
            },
          ],
        },
        sideTollbars: {
          nodes: [
            {
              text: "印章列表",
              imageUrl:
                "data:image/png;base64,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",
              on: {
                click: async (event, isOpen) => {
                  if (!isOpen) {
                    return;
                  }
                  const sealList = await window.getSealList();
                  if (!sealList) {
                    return false;
                  }

                  const unitConversion = new window.unitConversion();
                  const width = unitConversion.mmConversionPx(30);
                  const height = unitConversion.mmConversionPx(30);
                  for (let i = 0; i < sealList.length; i++) {
                    const img = new Image();
                    sealList[i].sealImgUrl =
                      "data:image/png;base64," + sealList[i].sealImg;
                    // img.src = sealList[i].sealImgUrl;
                    sealList[i].width = width;
                    sealList[i].height = height;
                    sealList[i].positionBase = "leftBottom";
                  }

                  sealContentList.splice(0, sealList.length);
                  sealList.forEach((seal) => {
                    sealContentList.push({
                      ele: h(
                        "div.seal-list-content",
                        {
                          style: {
                            width: "100%",
                          },
                        },
                        h("img", {
                          props: {
                            src: seal.sealImgUrl,
                          },
                          style: {
                            width: "138px",
                            height: "138px",
                            display: "block",
                            margin: "0 auto",
                          },
                          on: {
                            click: (event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              const ele = event.target.parentElement;

                              const sealListContents = document.getElementsByClassName(
                                "seal-list-content"
                              );
                              for (let sealContent of sealListContents) {
                                if (sealContent === ele) {
                                  continue;
                                }
                                sealContent.className = "";
                              }

                              const className = ele.className;
                              if (className.includes("active")) {
                                ele.className = "seal-list-content";
                                reader.cancelDragSeal();
                                return;
                              }

                              ele.className = "seal-list-content active";
                              reader.dragSeal(seal);
                              // reader.dragSeal({
                              //     sealImgUrl: "https://up.66152.com/allimg/2139/39_88909.jpg",
                              //     width: 138,
                              //     height: 138
                              // })
                            },
                          },
                        })
                      ),
                    });
                  });
                  reader.updateView();
                },
              },
              contents: sealContentList,
            },
          ],
          hide: true,
        },
        // bottomToolbars: {
        //     show: true
        // },
        reader: {
          type: 2,
          page: true,
          zoom: {
            show: true,
          },
          action: {
            loadFileInterface: {
              loadingOk: (loadAllOk, currentLoadPage) => {
                reader.updateView({
                  sideTollbars: {
                    hide: false,
                  },
                });
              },
              filePathConvertPng: async (path) => {
                const result = await fetch(
                  "http://127.0.0.1:8061/pdf/convert/path/png?p=" + path
                );
                const data = await result.json();
                if (data.error) {
                  throw data.msg;
                }
                return data.result;
              },
              fileConvertPng: async (file) => {
                const data = new FormData();
                data.append("file", file);
                const result = await fetch(
                  "http://127.0.0.1:8061/pdf/convert/file/png",
                  {
                    method: "post",
                    body: data,
                  }
                );
                const jsonData = await result.json();
                if (jsonData.error) {
                  throw jsonData.msg;
                }

                window.pdfFileBase64 = jsonData.result.base64File;

                return jsonData.result;
              },
              getPageInfo: async (fileId, currentPage) => {
                const result = await fetch("http://127.0.0.1:8061/get/png", {
                  method: "post",
                  body: JSON.stringify({
                    id: fileId,
                    currentPage: currentPage - 1,
                  }),
                });
                const data = await result.json();
                if (data.error) {
                  throw data.msg;
                }
                return data.result;
              },
            },
            sealInterface: {
              addSeal: async (data) => {
                try {
                  return await window.addSeal(data);
                } catch (e) {}
              },
            },
          },
          sealContextMenu: {
            menuItems: [
              {
                type: "text",
                text: "测试验章",
              },
            ],
          },
        },
      };

      document.getElementById("file").onchange = async function (event) {
        const file = event.target.files[0];
        file.path =
          "/Users/sulinxin/Documents/00-projects/01-博雅中科/02-电子签章应用平台/03-code/02-go/javaseal/test_datas/cs1_temp_temp.pdf";
        reader.updateView({
          sideToolbars: {
            hide: true,
          },
        });

        try {
          await reader.loadFile(file);
        } catch (e) {
          alert("文件加载出错: " + e.message);
          reader.updateView({
            sideToolbars: {
              hide: true,
            },
          });
        } finally {
          event.target.value = "";
        }
      };

      reader.initView(readerParam);
    };
  </script>
</html>
```
