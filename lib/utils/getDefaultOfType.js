"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkType_1 = require("../utils/checkType");
function getDefaultOfType(value, defaultValue) {
    if (defaultValue) {
        return defaultValue;
    }
    if (checkType_1.isNullOrUndefined(value)) {
        return value;
    }
    let res;
    if (checkType_1.isBoolean(value)) {
        res = false;
    }
    else if (Array.isArray(value)) {
        res = [];
    }
    else if (checkType_1.isNumber(value)) {
        res = 0;
    }
    else if (checkType_1.isDate(value)) {
        res = new Date();
    }
    else if (checkType_1.isString(value)) {
        res = '';
    }
    else if (checkType_1.isObject(value)) {
        res = {};
        const keys = Object.keys(value);
        for (let key of keys) {
            res[key] = getDefaultOfType(value[key]);
        }
    }
    else {
        throw new Error('unexpected value type ' + value);
    }
    return res;
}
exports.default = getDefaultOfType;
//# sourceMappingURL=getDefaultOfType.js.map