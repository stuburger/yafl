"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function getInitialState(value) {
    return lodash_1.transform(value, function (ret, value, fieldName) {
        ret[fieldName] = {
            value: value,
            originalValue: lodash_1.cloneDeep(value),
            isValid: false,
            isDirty: false,
            didBlur: false,
            isTouched: false
        };
    }, {});
}
exports.default = getInitialState;
//# sourceMappingURL=getInitialState.js.map