"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function maxLength(length, message) {
    var test = function (value, formValue, fieldName) {
        var val = value.value || '';
        if (typeof val === 'string') {
            if (value.touched && val.length > length) {
                return message || fieldName + " should not be longer than " + length + " characters";
            }
        }
        return undefined;
    };
    return test;
}
exports.default = maxLength;
//# sourceMappingURL=maxLength.js.map