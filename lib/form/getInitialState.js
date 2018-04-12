"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
exports.createEmptyField = function () {
    return {
        value: null,
        originalValue: null,
        didBlur: false,
        touched: false
    };
};
exports.getInitialFieldState = function (value) {
    var field = exports.createEmptyField();
    field.value = value ? index_1.clone(value) : null;
    field.originalValue = value ? index_1.clone(value) : null;
    return field;
};
function getInitialState(val) {
    return index_1.transform(val, function (ret, fieldValue, fieldName) {
        ret[fieldName] = exports.getInitialFieldState(fieldValue);
        return ret;
    });
}
exports.default = getInitialState;
//# sourceMappingURL=getInitialState.js.map