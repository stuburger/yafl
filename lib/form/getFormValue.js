"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
function getFormValue(fields) {
    return utils_1.transform(fields, function (ret, value, fieldName) {
        ret[fieldName] = fields[fieldName].value;
        return ret;
    });
}
exports.default = getFormValue;
//# sourceMappingURL=getFormValue.js.map