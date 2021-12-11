import { addStyleTagToHead } from "./utils";
const bottomToolBarsStyleContent = ` .bk-reader-bottom-tool-toolbars {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #888;
    box-shadow: 0 0 8px #888;
}`;

const sideToolbarsStyleContent = ` .bk-reader-side-tool-toolbars {
    height: 100%;
    overflow: hidden;
    width: 58px;
    transition: all 0.5s;
}

.bk-reader-side-tool-toolbars.active {
    width: 280px;
}

.bk-reader-side-tool-toolbars>.bk-reader-side-toolbars-btn-group {
    width: 58px;
    float: left;
    height: 100%;
    border-right: 2px solid #e6e6e6;
    box-shadow: 0 0 8px #888;
    margin: 0;
    padding: 0;
    list-style: none;
}

.bk-reader-side-tool-toolbars>.bk-reader-side-toolbars-btn-group>li.active {
    background-color: #fff;
}

.bk-reader-side-tool-toolbars>.bk-reader-side-toobars-content-group {
    margin: 0;
    height: 100%;
    padding-left: 62px;
    list-style: none;
}`;

const toolbarsStyleContent = ` .bk-reader-tool-toolbars {
    width: 100%;
    background-color: rgb(66, 96, 124);
    /* padding: 4px 20px; */
}

.bk-reader-tool-toolbars>ul {
    width: 100%;
    list-style: none;
    overflow: hidden;
    margin: 0;
    padding: 0;
    /* padding: 4px 20px; */
}

.bk-reader-tool-toolbars>ul>li {
    float: left;
    padding: 8px;
}

.bk-reader-tool-toolbars>ul>li>button.radius {
    background: none;
    border: none;
    cursor: pointer;
    width: 58px;
    height: 58px;
    line-height: 58px;
    text-align: center;
    border-radius: 58px;
    background-color: #fff;
    color: #6e6e6e;
    transition: all 0.5s;
    padding: 0;
}

.bk-reader-tool-toolbars>ul>li>button.radius:hover {
    color: #000;
    box-shadow: 0 0 0 2px #e6e6e6;
}`;

const toolbsStyleContent = ` .bk-reader-tools-reader {
    height: 100%;
}

.bk-reader-tools-reader .bk-reader-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}

.bk-reader-tools-reader .bk-reader-content>div>.bk-rdear-content-img {
    display: block;
    margin: 0 auto;
    user-select: none;
    margin-bottom: 18px;
}

.bk-reader-tools-reader .bk-reader-content>div>.bk-rdear-content-img>.seal-node {
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.5s;
}

.bk-reader-tools-reader .bk-reader-content>div>.bk-rdear-content-img>.seal-node:hover {
    cursor: pointer;
    border: 2px solid red;
    background-color: rgba(255, 0, 0, .2);
}

.bk-reader-tools-reader .bk-reader-content>.mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 8;
}

.bk-reader-tools-reader .bk-reader-content>.bk-reader-content-tool-zoom {
    position: fixed;
    right: 28px;
    bottom: 8px;
    z-index: 9;
}

.bk-reader-tools-reader .bk-reader-content>.bk-reader-content-tool-zoom>.tool-zoom-shrink,
.bk-reader-tools-reader .bk-reader-content>.bk-reader-content-tool-zoom>.tool-zoom-enlarge {
    user-select: none;
    width: 18px;
    height: 18px;
    border: 1px solid #e6e6e6;
    margin-left: 12px;
    border-radius: 18px;
    box-shadow: 0 0 8px #e6e6e6;
    float: left;
    cursor: pointer;
    text-align: center;
    line-height: 16px;
    color: #e6e6e6;
    transition: all 0.5s;
}

.bk-reader-tools-reader .bk-reader-content>.bk-reader-content-tool-zoom>.tool-zoom-current-percentage {
    margin-left: 12px;
    float: left;
}

.bk-reader-tools-reader .bk-reader-content>.bk-reader-content-tool-zoom>.tool-zoom-current-percentage>input {
    display: inline-block;
    width: 28px;
    border: none;
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid #888;
    background-color: transparent;
}

.bk-reader-tools-reader .bk-reader-content>.bk-reader-content-tool-zoom>.tool-zoom-current-percentage>input:focus {
    background-color: white;
}

.bk-reader-tools-reader .bk-reader-content>.bk-reader-content-tool-zoom>.tool-zoom-shrink:hover,
.bk-reader-tools-reader .bk-reader-content>.bk-reader-content-tool-zoom>.tool-zoom-enlarge:hover {
    background-color: #fff;
    color: #888;
    border: 1px solid #888;
    box-shadow: 0 0 8px #888;
}`;

const layoutStyleContent = ` .bk-reader-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.bk-reader-container-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 74px;
}

.bk-reader-container-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 38px;
}

.bk-reader-container-center-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 74px;
    bottom: 38px;
}

.bk-reader-container-center-container.no-bottom {
    bottom: 0 !important;
}

.bk-reader-container-center {
    height: 100%;
    position: relative;
    overflow: hidden;
}

.bk-reader-container-left {
    float: left;
    height: 100%;
    margin-right: 6px;
    background-color: #e6e6e6;
}

.bk-reader-container-right {
    float: right;
    height: 100%;
}`;

addStyleTagToHead(
  "bk_reader_styles_bottom_toolbars",
  bottomToolBarsStyleContent
);

addStyleTagToHead("bk_reader_styles_side_toolbars", sideToolbarsStyleContent);

addStyleTagToHead("bk_reader_styles_tool_toolbars", toolbarsStyleContent);

addStyleTagToHead("bk_reader_styles_tool_reader", toolbsStyleContent);

addStyleTagToHead("bk_reader_styles_layout", layoutStyleContent);
