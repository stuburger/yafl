"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pick(obj1, obj2, fieldName, defaultValue) {
    return obj1[fieldName] || obj2[fieldName] || defaultValue;
}
exports.default = pick;
function createPicker(fieldName, defaultValue) {
    return function pick(obj1, obj2) {
        return (obj1[fieldName] || obj2[fieldName] || defaultValue);
    };
}
exports.createPicker = createPicker;
//# sourceMappingURL=pickOne.js.map