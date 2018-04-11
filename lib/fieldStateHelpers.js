"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createFormUpdater(update) {
    return function (fields) {
        var state = {};
        for (var key in fields) {
            state[key] = update(fields[key]);
        }
        return state;
    };
}
exports.createFormUpdater = createFormUpdater;
exports.touchField = function (field) {
    return {
        touched: true,
        value: field.value,
        didBlur: field.didBlur,
        originalValue: field.originalValue
    };
};
function untouchField(field) {
    return {
        touched: false,
        didBlur: false,
        value: field.value,
        originalValue: field.originalValue
    };
}
exports.untouchField = untouchField;
function resetField(field) {
    return {
        touched: false,
        didBlur: false,
        value: '',
        originalValue: ''
    };
}
exports.resetField = resetField;
exports.touchAllFields = createFormUpdater(exports.touchField);
exports.untouchAllFields = createFormUpdater(untouchField);
exports.resetFields = createFormUpdater(resetField);
//# sourceMappingURL=fieldStateHelpers.js.map