"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateField(fieldName, form, validators = []) {
    const messages = [];
    const value = form[fieldName];
    for (let validate of validators) {
        const message = validate(value, form, fieldName);
        if (message) {
            messages.push(message);
        }
    }
    return messages;
}
exports.default = validateField;
//# sourceMappingURL=validateField.js.map