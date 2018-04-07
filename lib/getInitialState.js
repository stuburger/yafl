"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function getInitialState(val) {
    return lodash_1.transform(val, function (ret, fieldValue, fieldName) {
        ret[fieldName] = {
            value: fieldValue,
            originalValue: lodash_1.cloneDeep(fieldValue),
            isValid: false,
            didBlur: false,
            isTouched: false
        };
    }, {});
}
exports.default = getInitialState;
//# sourceMappingURL=getInitialState.js.map