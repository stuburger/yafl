"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
function copy(field) {
    return {
        value: utils_1.clone(field.value),
        didBlur: field.didBlur,
        touched: field.touched,
        originalValue: utils_1.clone(field.originalValue)
    };
}
function isDirty(_a) {
    var value = _a.value, originalValue = _a.originalValue;
    return !utils_1.isEqual(originalValue, value);
}
exports.isDirty = isDirty;
function setFieldValue(field, value) {
    var res = touchField(field);
    res.value = value;
    return res;
}
exports.setFieldValue = setFieldValue;
function blurField(field) {
    if (field.didBlur)
        return field;
    var res = copy(field);
    res.didBlur = true;
    return res;
}
exports.blurField = blurField;
function touchField(field) {
    var res = copy(field);
    res.touched = true;
    return res;
}
exports.touchField = touchField;
function untouchField(field) {
    var res = copy(field);
    res.touched = false;
    return res;
}
exports.untouchField = untouchField;
function resetField(field) {
    var result = copy(field);
    result.value = utils_1.clone(field.originalValue);
    return result;
}
exports.resetField = resetField;
function clearField(field) {
    var result = copy(field);
    result.originalValue = utils_1.getDefaultOfType(field.originalValue);
    result.value = utils_1.clone(result.originalValue);
    return result;
}
exports.clearField = clearField;
function formIsDirty(value) {
    var clean = utils_1.transform(value, function (ret, field, key) { return ret && utils_1.isEqual(field.value, field.originalValue); }, true);
    return !clean;
}
exports.formIsDirty = formIsDirty;
function touchAllFields(fields) {
    var state = utils_1.clone(fields); // shallow copy would be fine if all fields are cloned
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
function clearFields(fields) {
    var state = utils_1.clone(fields);
    for (var key in state) {
        state[key] = clearField(state[key]);
    }
    return state;
}
exports.clearFields = clearFields;
function resetFields(fields) {
    var state = utils_1.clone(fields);
    for (var key in state) {
        state[key] = resetField(state[key]);
    }
    return state;
}
exports.resetFields = resetFields;
function set(fields, fieldName, updatedField) {
    var result = utils_1.shallowCopy(fields);
    result[fieldName] = updatedField;
    return result;
}
exports.set = set;
//# sourceMappingURL=fieldStateHelpers.js.map