"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function maxLength(length, message) {
    return function (value, formValue, fieldName) {
        var val = value.value || '';
        if (value.touched && val.length > length) {
            return message || fieldName + " should not be longer than " + length + " characters";
        }
    };
}
exports.default = maxLength;
//# sourceMappingURL=maxLength.js.map