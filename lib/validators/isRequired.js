"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function required(message) {
    var test = function (value, formValue, fieldName) {
        if (value.touched && !value.value) {
            return message || fieldName + " is required";
        }
        return undefined;
    };
    return test;
}
exports.default = required;
//# sourceMappingURL=isRequired.js.map