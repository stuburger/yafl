"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./utils/index");
exports.getInitialFieldState = function (value) { return ({
    value: value ? index_1.clone(value) : null,
    originalValue: value ? index_1.clone(value) : null,
    didBlur: false,
    touched: false
}); };
function getInitialState(val) {
    return index_1.transform(val, function (ret, fieldValue, fieldName) {
        ret[fieldName] = exports.getInitialFieldState(fieldValue);
        return ret;
    });
}
exports.default = getInitialState;
//# sourceMappingURL=getInitialState.js.map