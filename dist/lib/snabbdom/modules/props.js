"use strict";
exports.__esModule = true;
exports.propsModule = void 0;
function updateProps(oldVnode, vnode) {
    var key;
    var cur;
    var old;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.props;
    var props = vnode.data.props;
    if (!oldProps && !props)
        return;
    if (oldProps === props)
        return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== "value" || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
exports.propsModule = { create: updateProps, update: updateProps };
