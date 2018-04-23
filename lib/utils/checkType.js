"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNumber(value) {
    return typeof value === 'number';
}
exports.isNumber = isNumber;
function isDate(value) {
    return value instanceof Date;
}
exports.isDate = isDate;
function isString(value) {
    return !isNullOrUndefined(value) && typeof value === 'string';
}
exports.isString = isString;
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
function isUndefined(value) {
    return value === undefined;
}
exports.isUndefined = isUndefined;
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
function isNullOrUndefined(value) {
    return isNull(value) || isUndefined(value);
}
exports.isNullOrUndefined = isNullOrUndefined;
function isObject(value) {
    return !isNull(value) && value instanceof Object;
}
exports.isObject = isObject;
//# sourceMappingURL=checkType.js.map