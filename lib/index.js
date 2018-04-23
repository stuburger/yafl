"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var createFormProvider_1 = require("./form/createFormProvider");
var createField_1 = require("./form/createField");
var createFormComponent_1 = require("./form/createFormComponent");
var noop = function noop() {
    throw new Error('A <Field /> component can only appear inside a <Form /> component');
};
function getDefaultProviderValue() {
    return {
        fields: {},
        loaded: false,
        isBusy: true,
        submitCount: 0,
        submitting: false,
        formIsDirty: false,
        initialValue: {},
        validation: {},
        unload: noop,
        submit: noop,
        clearForm: noop,
        touch: noop,
        untouch: noop,
        forgetState: noop,
        onFieldBlur: noop,
        setFieldValue: noop,
        registerField: noop,
        registerValidator: noop
    };
}
function getFormContext() {
    return React.createContext(getDefaultProviderValue());
}
function createForm(initialValue) {
    var _a = getFormContext(), Consumer = _a.Consumer, Provider = _a.Provider;
    var form = createFormProvider_1.default(Provider, { initialValue: initialValue });
    var field = createField_1.default(Consumer);
    var component = createFormComponent_1.default(Consumer);
    return {
        Form: form,
        Field: field,
        FormComponent: component,
        createField: function (fieldName, component) {
            return createField_1.getTypedField(Consumer, fieldName, component);
        }
    };
}
exports.createForm = createForm;
exports.default = createForm;
var formContext = createForm({});
exports.Form = formContext.Form;
exports.Field = formContext.Field;
exports.FormComponent = formContext.FormComponent;
//# sourceMappingURL=index.js.map