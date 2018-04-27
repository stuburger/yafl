"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const createFormProvider_1 = require("./form/createFormProvider");
const createField_1 = require("./form/createField");
const createFormComponent_1 = require("./form/createFormComponent");
function noop() {
    throw new Error('A <Field /> component can only appear inside a <Form /> component');
}
function getDefaultProviderValue() {
    return {
        fields: {},
        loaded: false,
        isBusy: true,
        formIsTouched: false,
        formIsValid: true,
        submitCount: 0,
        submitting: false,
        formIsDirty: false,
        initialValue: {},
        validation: {},
        getFormValue: noop,
        unload: noop,
        submit: noop,
        resetForm: noop,
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
    const { Consumer, Provider } = getFormContext();
    const form = createFormProvider_1.default(Provider, initialValue);
    const field = createField_1.default(Consumer);
    const component = createFormComponent_1.default(Consumer);
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
const formContext = createForm({});
exports.Form = formContext.Form;
exports.Field = formContext.Field;
exports.FormComponent = formContext.FormComponent;
var validators_1 = require("./validators");
exports.required = validators_1.required;
exports.maxLength = validators_1.maxLength;
exports.minLength = validators_1.minLength;
// export interface ReactContextForm<T> {
//   Form: React.ComponentClass<FormProviderProps<T>>
//   Field: React.ComponentClass<FormFieldProps<T>>
//   FormComponent: React.ComponentClass<GeneralComponentProps<T>>
//   createTypedField: any
// }
//# sourceMappingURL=index.js.map