"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function copy(field) {
    return {
        value: utils_1.clone(field.value),
        didBlur: field.didBlur,
        touched: field.touched,
        originalValue: utils_1.clone(field.originalValue)
    };
}
function isDirty({ value, originalValue }) {
    return !utils_1.isEqual(originalValue, value);
}
exports.isDirty = isDirty;
function setFieldValue(field, value) {
    const res = touchField(field);
    res.value = value;
    return res;
}
exports.setFieldValue = setFieldValue;
function blurField(field) {
    if (field.didBlur)
        return field;
    const res = copy(field);
    res.didBlur = true;
    return res;
}
exports.blurField = blurField;
function touchField(field) {
    const res = copy(field);
    res.touched = true;
    return res;
}
exports.touchField = touchField;
function untouchField(field) {
    const res = copy(field);
    res.touched = false;
    return res;
}
exports.untouchField = untouchField;
function resetField(field) {
    const result = copy(field);
    result.value = utils_1.clone(field.originalValue);
    return result;
}
exports.resetField = resetField;
function clearField(field) {
    const result = copy(field);
    result.originalValue = utils_1.getDefaultOfType(field.originalValue);
    result.value = utils_1.clone(result.originalValue);
    return result;
}
exports.clearField = clearField;
function formIsDirty(value) {
    let clean = utils_1.transform(value, (ret, field, key) => ret && utils_1.isEqual(field.value, field.originalValue), true);
    return !clean;
}
exports.formIsDirty = formIsDirty;
function touchAllFields(fields) {
    const state = utils_1.clone(fields); // shallow copy would be fine if all fields are cloned
    for (let key in state) {
        state[key] = touchField(state[key]);
    }
    return state;
}
exports.touchAllFields = touchAllFields;
function untouchAllFields(fields) {
    const state = utils_1.clone(fields);
    for (let key in state) {
        state[key] = untouchField(state[key]);
    }
    return state;
}
exports.untouchAllFields = untouchAllFields;
function clearFields(fields) {
    const state = utils_1.clone(fields);
    for (let key in state) {
        state[key] = clearField(state[key]);
    }
    return state;
}
exports.clearFields = clearFields;
function resetFields(fields) {
    const state = utils_1.clone(fields);
    for (let key in state) {
        state[key] = resetField(state[key]);
    }
    return state;
}
exports.resetFields = resetFields;
function set(fields, fieldName, updatedField) {
    const result = utils_1.shallowCopy(fields);
    result[fieldName] = updatedField;
    return result;
}
exports.set = set;
//# sourceMappingURL=fieldStateHelpers.js.map