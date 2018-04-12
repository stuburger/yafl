"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initialValidation = [];
function getNoops() {
    return {
        noop: function () { },
        noopSubmit: function () {
            console.error('submit: form not loaded');
        },
        noopOnFieldBlur: function (fieldName) {
            console.error('blur: form not loaded');
        },
        noopSetFieldValue: function (fieldName, value) {
            console.error('setFieldValue: form not loaded');
        },
        noopValidateForm: function () {
            return {};
        },
        noopValidateField: function (fieldName) {
            return initialValidation;
        }
    };
}
exports.default = getNoops;
//# sourceMappingURL=noops.js.map