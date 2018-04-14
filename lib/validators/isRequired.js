"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function required(message) {
    return function (value, formValue, fieldName) {
        if (value.touched && !value.value) {
            return message || fieldName + " is required";
        }
        return undefined;
    };
}
exports.default = required;
// const required: Validator = function(
//   field,
//   fieldName,
//   formValue
// ): string | undefined {
//   if (!field.value) {
//     return `${fieldName} is required`
//   }
//   return
// }
//# sourceMappingURL=isRequired.js.map