"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var React = require("react");
var utils_1 = require("../utils");
var AbsentField_1 = require("../AbsentField");
var fieldStateHelpers_1 = require("./fieldStateHelpers");
function wrapConsumer(Consumer) {
    var InnerField = getInnerField();
    var emptyArray = [];
    return /** @class */ (function (_super) {
        __extends(FormField, _super);
        function FormField(props) {
            var _this = _super.call(this, props) || this;
            _this._render = _this._render.bind(_this);
            return _this;
        }
        FormField.prototype._render = function (provider) {
            var fields = provider.fields;
            var _a = this.props, name = _a.name, render = _a.render, component = _a.component, initialValue = _a.initialValue, _b = _a.validators, validators = _b === void 0 ? emptyArray : _b, props = __rest(_a, ["name", "render", "component", "initialValue", "validators"]);
            return (React.createElement(InnerField, { name: name, validators: validators, initialValue: initialValue, render: render, component: component, field: fields[name], provider: provider, forwardProps: props }));
        };
        FormField.prototype.render = function () {
            return React.createElement(Consumer, null, this._render);
        };
        return FormField;
    }(React.Component));
}
function getTypedField(Consumer, fieldName, component) {
    var FormField = wrapConsumer(Consumer);
    return /** @class */ (function (_super) {
        __extends(TypedField, _super);
        function TypedField() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TypedField.prototype.render = function () {
            return React.createElement(FormField, __assign({ component: component }, this.props, { name: fieldName }));
        };
        return TypedField;
    }(React.Component));
}
exports.getTypedField = getTypedField;
function getInnerField() {
    var emptyArray = [];
    var InnerField = /** @class */ (function (_super) {
        __extends(InnerField, _super);
        function InnerField(props) {
            var _this = _super.call(this, props) || this;
            _this.onChange = _this.onChange.bind(_this);
            _this.onBlur = _this.onBlur.bind(_this);
            _this.setValue = _this.setValue.bind(_this);
            _this.touch = _this.touch.bind(_this);
            _this.untouch = _this.untouch.bind(_this);
            _this.collectInputProps = _this.collectInputProps.bind(_this);
            _this.collectMetaProps = _this.collectMetaProps.bind(_this);
            _this.collectUtilProps = _this.collectUtilProps.bind(_this);
            _this.collectProps = _this.collectProps.bind(_this);
            var name = props.name, validators = props.validators, _a = props.initialValue, initialValue = _a === void 0 ? props.field.value : _a, provider = props.provider;
            provider.registerField(name, initialValue, validators);
            return _this;
        }
        InnerField.prototype.shouldComponentUpdate = function (nextProps) {
            var provider = this.props.provider;
            var validation = provider.validation[name] || emptyArray;
            return (!utils_1.isEqual(nextProps.field, this.props.field) ||
                !utils_1.isEqual(validation, nextProps.provider.validation[name] || emptyArray));
        };
        InnerField.prototype.componentDidUpdate = function (pp) {
            var _a = this.props, name = _a.name, _b = _a.validators, validators = _b === void 0 ? emptyArray : _b, provider = _a.provider;
            if (validators !== pp.validators) {
                provider.registerValidator(name, validators);
            }
        };
        InnerField.prototype.onBlur = function (e) {
            var _a = this.props, provider = _a.provider, forwardProps = _a.forwardProps, name = _a.name;
            provider.onFieldBlur(name);
            if (forwardProps.onBlur) {
                forwardProps.onBlur(e);
            }
        };
        InnerField.prototype.onChange = function (e) {
            this.setValue(e.target.value);
        };
        InnerField.prototype.setValue = function (value) {
            var _a = this.props, provider = _a.provider, name = _a.name;
            provider.setFieldValue(name, value);
        };
        InnerField.prototype.touch = function () {
            var _a = this.props, provider = _a.provider, name = _a.name;
            provider.touch(name);
        };
        InnerField.prototype.untouch = function () {
            var _a = this.props, provider = _a.provider, name = _a.name;
            provider.untouch(name);
        };
        InnerField.prototype.collectInputProps = function () {
            var _a = this.props, field = _a.field, name = _a.name, initialValue = _a.initialValue;
            return {
                name: name,
                value: field.value || initialValue,
                // checked: field.value, todo
                onBlur: this.onBlur,
                onChange: this.onChange
            };
        };
        InnerField.prototype.collectMetaProps = function () {
            var _a = this.props, provider = _a.provider, name = _a.name, field = _a.field;
            var validation = provider.validation[name] || emptyArray;
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
        };
        InnerField.prototype.collectUtilProps = function () {
            var provider = this.props.provider;
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
        };
        InnerField.prototype.collectProps = function () {
            return __assign({ input: this.collectInputProps(), meta: this.collectMetaProps(), utils: this.collectUtilProps() }, this.props.forwardProps);
        };
        InnerField.prototype.render = function () {
            var _a = this.props, render = _a.render, Component = _a.component;
            var props = this.collectProps();
            if (Component) {
                return React.createElement(Component, __assign({}, props));
            }
            if (render) {
                return render(props);
            }
            return (React.createElement(AbsentField_1.default, { message: "Please provide render or component prop for field: '" + this.props.name + "'" }));
        };
        return InnerField;
    }(React.Component));
    return InnerField;
}
exports.default = wrapConsumer;
//# sourceMappingURL=createField.js.map