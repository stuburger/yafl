"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const getInitialState_1 = require("./getInitialState");
const index_1 = require("./index");
const utils_1 = require("../utils");
const fieldStateHelpers_1 = require("./fieldStateHelpers");
const noop = () => { };
function wrapFormProvider(Provider, initialValue) {
    return _a = class Form extends React.Component {
            constructor(props) {
                super(props);
                this.validators = {};
                const onlyIfLoaded = (func, defaultFunc = noop) => {
                    func = utils_1.bind(this, func);
                    return utils_1.bind(this, function (...params) {
                        if (!this.state.isBusy) {
                            return func(...params);
                        }
                        return defaultFunc;
                    });
                };
                this.submit = onlyIfLoaded(this.submit);
                this.getFormValue = onlyIfLoaded(this.getFormValue);
                this.setFieldValue = onlyIfLoaded(this.setFieldValue);
                this.onFieldBlur = onlyIfLoaded(this.onFieldBlur);
                this.unload = onlyIfLoaded(this.unload);
                this.forgetState = onlyIfLoaded(this.forgetState);
                this.clearForm = onlyIfLoaded(this.clearForm);
                this.touchField = onlyIfLoaded(this.touchField);
                this.untouchField = onlyIfLoaded(this.untouchField);
                this.resetForm = onlyIfLoaded(this.resetForm);
                this.validateForm = onlyIfLoaded(this.validateForm, () => ({}));
                this.registerField = utils_1.bind(this, this.registerField);
                this.registerValidator = utils_1.bind(this, this.registerValidator);
                this.getComputedState = utils_1.bind(this, this.getComputedState);
                this.getProviderValue = utils_1.bind(this, this.getProviderValue);
                this.state = index_1.getStartingState(initialValue);
            }
            registerValidator(fieldName, validators) {
                this.validators[fieldName] = validators;
            }
            registerField(fieldName, value, validators) {
                this.registerValidator(fieldName, validators);
                if (this.state.fields[fieldName])
                    return; // field is already registered
                this.setState(({ fields }) => ({
                    fields: fieldStateHelpers_1.set(fields, fieldName, getInitialState_1.getInitialFieldState(value))
                }));
            }
            submit() {
                this.setState(({ fields, submitCount }) => ({
                    fields: index_1.touchAllFields(fields),
                    submitCount: submitCount + 1
                }));
                if (index_1.formIsValid(this.validateForm())) {
                    const { submit = noop } = this.props;
                    submit(this.getFormValue());
                }
                else {
                    console.warn('cannot submit, form is not valid...');
                }
            }
            getFormValue() {
                return index_1.getFormValue(this.state.fields);
            }
            setFieldValue(fieldName, val) {
                if (!this.state.fields[fieldName])
                    return;
                this.setState(({ fields }) => ({
                    fields: fieldStateHelpers_1.set(fields, fieldName, index_1.setFieldValue(fields[fieldName], val))
                }));
            }
            touchField(fieldName) {
                if (!this.state.fields[fieldName])
                    return;
                this.setState(({ fields }) => ({
                    fields: fieldStateHelpers_1.set(fields, fieldName, fieldStateHelpers_1.touchField(fields[fieldName]))
                }));
            }
            // todo touch/untouch specific fields
            touchFields(fieldNames) {
                this.setState(({ fields }) => ({ fields: index_1.touchAllFields(fields) }));
            }
            untouchField(fieldName) {
                if (!this.state.fields[fieldName])
                    return;
                this.setState(({ fields }) => ({
                    fields: fieldStateHelpers_1.set(fields, fieldName, fieldStateHelpers_1.untouchField(fields[fieldName]))
                }));
            }
            untouchFields(fieldNames) {
                this.setState(({ fields }) => ({ fields: index_1.untouchAllFields(fields) }));
            }
            onFieldBlur(fieldName) {
                if (this.state.fields[fieldName].didBlur)
                    return;
                this.setState(({ fields }) => ({
                    fields: fieldStateHelpers_1.set(fields, fieldName, index_1.blurField(fields[fieldName]))
                }));
            }
            clearForm() {
                this.setState({ fields: index_1.clearFields(this.state.fields) });
            }
            resetForm() {
                this.setState({ fields: fieldStateHelpers_1.resetFields(this.state.fields) });
            }
            unload() {
                this.setState(index_1.getStartingState());
            }
            forgetState() {
                this.setState(({ fields }) => ({ fields: index_1.untouchAllFields(fields), submitCount: 0 }));
            }
            validateForm() {
                const form = this.state.fields;
                const result = utils_1.transform(this.validators, (ret, validators, fieldName) => {
                    ret[fieldName] = index_1.validateField(fieldName, form, validators);
                    return ret;
                });
                return result;
            }
            getComputedState() {
                const { fields } = this.state;
                const keys = Object.keys(fields);
                let formIsDirty = false;
                let formIsInvalid = false;
                let formIsTouched = false;
                let validation = {};
                for (let fieldName of keys) {
                    formIsDirty = formIsDirty || fieldStateHelpers_1.isDirty(fields[fieldName]);
                    formIsTouched = formIsTouched || fields[fieldName].touched;
                    const messages = index_1.validateField(fieldName, fields, this.validators[fieldName]);
                    validation[fieldName] = messages;
                    formIsInvalid = formIsInvalid || messages.length > 0;
                }
                return {
                    formIsDirty,
                    formIsTouched,
                    validation,
                    formIsValid: !formIsInvalid
                };
            }
            getProviderValue() {
                return Object.assign({}, this.state, this.getComputedState(), { unload: this.unload, submit: this.submit, clearForm: this.clearForm, touch: this.touchField, untouch: this.untouchField, resetForm: this.resetForm, forgetState: this.forgetState, getFormValue: this.getFormValue, onFieldBlur: this.onFieldBlur, setFieldValue: this.setFieldValue, registerField: this.registerField, registerValidator: this.registerValidator });
            }
            render() {
                return React.createElement(Provider, { value: this.getProviderValue() }, this.props.children);
            }
        },
        _a.getDerivedStateFromProps = index_1.getGetDerivedStateFromProps(),
        _a;
    var _a;
}
exports.default = wrapFormProvider;
//# sourceMappingURL=createFormProvider.js.map