"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
function copy(field) {
    return {
        value: field.value,
        didBlur: field.didBlur,
        touched: field.touched,
        originalValue: field.originalValue
    };
}
// untested
function getDefaultOfType(value, defaultValue) {
    if (defaultValue) {
        return defaultValue;
    }
    if (utils_1.isNullOrUndefined(value)) {
        return value;
    }
    var res;
    if (utils_1.isBoolean(value)) {
        res = false;
    }
    else if (Array.isArray(value)) {
        res = [];
    }
    else if (utils_1.isNumber(value)) {
        res = 0;
    }
    else if (utils_1.isDate(value)) {
        res = new Date();
    }
    else if (utils_1.isString(value)) {
        res = '';
    }
    else if (utils_1.isObject(value)) {
        res = {};
        var keys = Object.keys(value);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            res[key] = getDefaultOfType(value[key]);
        }
    }
    else {
        throw new Error('unexpected value type ' + value);
    }
    return res;
}
exports.getDefaultOfType = getDefaultOfType;
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
    result.originalValue = getDefaultOfType(field.originalValue);
    result.value = utils_1.clone(result.originalValue);
    return result;
}
exports.resetField = resetField;
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
function resetFields(fields) {
    var state = utils_1.clone(fields);
    for (var key in state) {
        state[key] = resetField(state[key]);
    }
    return state;
}
exports.resetFields = resetFields;
//# sourceMappingURL=fieldStateHelpers.js.map