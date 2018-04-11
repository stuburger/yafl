"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function trueIfAbsent(val) {
    var nullOrUndefined = val === undefined || val === null;
    return nullOrUndefined || !!val;
}
exports.default = trueIfAbsent;
//# sourceMappingURL=trueIfAbsent.js.map