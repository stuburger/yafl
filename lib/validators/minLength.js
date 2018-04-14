"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function minLength(length, message) {
    return function (value, formValue, fieldName) {
        var val = value.value || '';
        if (value.touched && val.length < length) {
            return message || fieldName + " should be at least " + length + " characters";
        }
    };
}
exports.default = minLength;
// function minLength(len): (field, fieldName, formValue) => string | undefined {
//   return function(field, fieldName, formValue): string | undefined {
//     if (field.value.length < len) {
//       return `${fieldName} must be at least ${len} characters`
//     }
//     return
//   }
// }
//# sourceMappingURL=minLength.js.map