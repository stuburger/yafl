"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
function recurse(object, func, ret, keys, index) {
    var key = keys[index];
    if (!key)
        return ret;
    return recurse(object, func, index_1.clone(func(ret, object[key], key)), keys, index + 1);
}
function objectKeys(obj) {
    return Object.keys(obj);
}
function transform(object, func, initialValue) {
    var ret = initialValue || {};
    return recurse(object, func, ret, objectKeys(object), 0);
}
exports.default = transform;
// function transform<T, TResult>(
//   object: T,
//   func: TransformCallback<T, TResult>,
//   initialValue?: TResult
// ): TResult {
//   let ret: TResult = initialValue || ({} as TResult)
//   for (let key in object) {
//     ret = func(ret, object[key], key)
//   }
//   return ret
// }
//# sourceMappingURL=transform.js.map