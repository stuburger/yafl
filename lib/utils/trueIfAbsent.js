"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNullOrUndefined(val) {
    return val === undefined || val === null;
}
function isNaN(val) {
    return val !== val;
}
function trueIfAbsent(val) {
    var isFalsyType = isNullOrUndefined(val) || isNaN(val) || val === '' || val === 0;
    return isFalsyType || !!val;
}
exports.default = trueIfAbsent;
//# sourceMappingURL=trueIfAbsent.js.map