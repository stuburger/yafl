"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getInitialState_1 = require("./getInitialState");
var utils_1 = require("../utils");
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
exports.setFieldValue = function (field, value) {
    var res = exports.touchField(field);
    res.value = value;
    return res;
};
exports.blurField = function (field) {
    if (field.didBlur)
        return field;
    var res = utils_1.clone(field);
    res.didBlur = true;
    return res;
};
exports.touchField = function (field) {
    var res = utils_1.clone(field);
    res.touched = true;
    return res;
};
function untouchField(field) {
    var res = utils_1.clone(field);
    res.touched = false;
    return res;
}
exports.untouchField = untouchField;
function resetField(field) {
    return getInitialState_1.createEmptyField();
}
exports.resetField = resetField;
function formIsDirty(value) {
    var clean = utils_1.transform(value, function (ret, field, key) { return ret && utils_1.isEqual(field.value, field.originalValue); }, true);
    return !clean;
}
exports.formIsDirty = formIsDirty;
exports.touchAllFields = createFormUpdater(exports.touchField);
exports.untouchAllFields = createFormUpdater(untouchField);
exports.resetFields = createFormUpdater(resetField);
//# sourceMappingURL=fieldStateHelpers.js.map