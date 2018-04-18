"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getInitialState_1 = require("./getInitialState");
var utils_1 = require("../utils");
function setFieldValue(field, value) {
    var res = touchField(field);
    res.value = value;
    return res;
}
exports.setFieldValue = setFieldValue;
function blurField(field) {
    if (field.didBlur)
        return field;
    var res = utils_1.clone(field);
    res.didBlur = true;
    return res;
}
exports.blurField = blurField;
function touchField(field) {
    var res = utils_1.clone(field);
    res.touched = true;
    return res;
}
exports.touchField = touchField;
function untouchField(field) {
    var res = utils_1.clone(field);
    res.touched = false;
    return res;
}
exports.untouchField = untouchField;
function resetField() {
    return getInitialState_1.createEmptyField();
}
exports.resetField = resetField;
function formIsDirty(value) {
    var clean = utils_1.transform(value, function (ret, field, key) { return ret && utils_1.isEqual(field.value, field.originalValue); }, true);
    return !clean;
}
exports.formIsDirty = formIsDirty;
function touchAllFields(fields) {
    var state = utils_1.clone(fields);
    for (var key in state) {
        state[key] = touchField(state[key]);
    }
    return state;
}
exports.touchAllFields = touchAllFields;
function untouchAllFields(fields) {
    var state = utils_1.clone(fields);
    for (var key in state) {
        state[key] = untouchField(state[key]);
    }
    return state;
}
exports.untouchAllFields = untouchAllFields;
function resetFields(fields) {
    var state = utils_1.clone(fields);
    for (var key in state) {
        state[key] = resetField();
    }
    return state;
}
exports.resetFields = resetFields;
//# sourceMappingURL=fieldStateHelpers.js.map