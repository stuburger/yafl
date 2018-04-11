"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFormValue(fields) {
    var result = {};
    for (var fieldName in fields) {
        var temp = fields[fieldName];
        result[fieldName] = temp.value;
    }
    return result;
}
exports.default = getFormValue;
//# sourceMappingURL=getFormValue.js.map