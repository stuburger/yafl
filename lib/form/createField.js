"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const utils_1 = require("../utils");
const AbsentField_1 = require("../AbsentField");
const fieldStateHelpers_1 = require("./fieldStateHelpers");
function wrapConsumer(Consumer) {
    const InnerField = getInnerField();
    const emptyArray = [];
    return class FormField extends React.Component {
        constructor(props) {
            super(props);
            this._render = this._render.bind(this);
        }
        _render(provider) {
            const { fields } = provider;
            const _a = this.props, { name, render, component, initialValue, validators = emptyArray } = _a, props = __rest(_a, ["name", "render", "component", "initialValue", "validators"]);
            return (React.createElement(InnerField, { name: name, validators: validators, initialValue: initialValue, render: render, component: component, field: fields[name], provider: provider, forwardProps: props }));
        }
        render() {
            return React.createElement(Consumer, null, this._render);
        }
    };
}
function getTypedField(Consumer, fieldName, component) {
    const FormField = wrapConsumer(Consumer);
    return class TypedField extends React.Component {
        render() {
            return React.createElement(FormField, Object.assign({ component: component }, this.props, { name: fieldName }));
        }
    };
}
exports.getTypedField = getTypedField;
function getInnerField() {
    const emptyArray = [];
    class InnerField extends React.Component {
        constructor(props) {
            super(props);
            this.onChange = this.onChange.bind(this);
            this.onBlur = this.onBlur.bind(this);
            this.setValue = this.setValue.bind(this);
            this.touch = this.touch.bind(this);
            this.untouch = this.untouch.bind(this);
            this.collectInputProps = this.collectInputProps.bind(this);
            this.collectMetaProps = this.collectMetaProps.bind(this);
            this.collectUtilProps = this.collectUtilProps.bind(this);
            this.collectProps = this.collectProps.bind(this);
            const { name, validators, initialValue = props.field.value, provider } = props;
            provider.registerField(name, initialValue, validators);
        }
        shouldComponentUpdate(nextProps) {
            const { provider } = this.props;
            const validation = provider.validation[name] || emptyArray;
            return (!utils_1.isEqual(nextProps.field, this.props.field) ||
                !utils_1.isEqual(validation, nextProps.provider.validation[name] || emptyArray));
        }
        componentDidUpdate(pp) {
            const { name, validators = emptyArray, provider } = this.props;
            if (validators !== pp.validators) {
                provider.registerValidator(name, validators);
            }
        }
        onBlur(e) {
            const { provider, forwardProps, name } = this.props;
            provider.onFieldBlur(name);
            if (forwardProps.onBlur) {
                forwardProps.onBlur(e);
            }
        }
        onChange(e) {
            this.setValue(e.target.value);
        }
        setValue(value) {
            const { provider, name } = this.props;
            provider.setFieldValue(name, value);
        }
        touch() {
            const { provider, name } = this.props;
            provider.touch(name);
        }
        untouch() {
            const { provider, name } = this.props;
            provider.untouch(name);
        }
        collectInputProps() {
            const { field, name, initialValue } = this.props;
            return {
                name,
                value: field.value || initialValue,
                // checked: field.value, todo
                onBlur: this.onBlur,
                onChange: this.onChange
            };
        }
        collectMetaProps() {
            const { provider, name, field } = this.props;
            const validation = provider.validation[name] || emptyArray;
            return {
                isDirty: provider.formIsDirty && fieldStateHelpers_1.isDirty(field),
                didBlur: field.didBlur,
                touched: field.touched,
                submitCount: provider.submitCount,
                loaded: provider.loaded,
                submitting: provider.submitting,
                isValid: validation.length === 0,
                messages: validation,
                originalValue: field.originalValue
            };
        }
        collectUtilProps() {
            const { provider } = this.props;
            return {
                touch: this.touch,
                untouch: this.untouch,
                unload: provider.unload,
                submit: provider.submit,
                resetForm: provider.resetForm,
                setFieldValue: provider.setFieldValue,
                setValue: this.setValue,
                forgetState: provider.forgetState,
                clearForm: provider.clearForm,
                getFormValue: provider.getFormValue
            };
        }
        collectProps() {
            return Object.assign({ input: this.collectInputProps(), meta: this.collectMetaProps(), utils: this.collectUtilProps() }, this.props.forwardProps);
        }
        render() {
            const { render, component: Component } = this.props;
            const props = this.collectProps();
            if (Component) {
                return React.createElement(Component, Object.assign({}, props));
            }
            if (render) {
                return render(props);
            }
            return (React.createElement(AbsentField_1.default, { message: `Please provide render or component prop for field: '${this.props.name}'` }));
        }
    }
    return InnerField;
}
exports.default = wrapConsumer;
//# sourceMappingURL=createField.js.map