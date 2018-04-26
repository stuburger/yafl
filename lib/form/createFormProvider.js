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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var getInitialState_1 = require("./getInitialState");
var index_1 = require("./index");
var utils_1 = require("../utils");
var fieldStateHelpers_1 = require("./fieldStateHelpers");
var noop = function () { };
function wrapFormProvider(Provider, initialValue) {
    return _a = /** @class */ (function (_super) {
            __extends(Form, _super);
            function Form(props) {
                var _this = _super.call(this, props) || this;
                _this.validators = {};
                var onlyIfLoaded = function (func, defaultFunc) {
                    if (defaultFunc === void 0) { defaultFunc = noop; }
                    func = utils_1.bind(_this, func);
                    return utils_1.bind(_this, function () {
                        var params = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            params[_i] = arguments[_i];
                        }
                        if (!this.state.isBusy) {
                            return func.apply(void 0, params);
                        }
                        return defaultFunc;
                    });
                };
                _this.submit = onlyIfLoaded(_this.submit);
                _this.getFormValue = onlyIfLoaded(_this.getFormValue);
                _this.setFieldValue = onlyIfLoaded(_this.setFieldValue);
                _this.onFieldBlur = onlyIfLoaded(_this.onFieldBlur);
                _this.unload = onlyIfLoaded(_this.unload);
                _this.forgetState = onlyIfLoaded(_this.forgetState);
                _this.clearForm = onlyIfLoaded(_this.clearForm);
                _this.touchField = onlyIfLoaded(_this.touchField);
                _this.untouchField = onlyIfLoaded(_this.untouchField);
                _this.resetForm = onlyIfLoaded(_this.resetForm);
                _this.validateForm = onlyIfLoaded(_this.validateForm, function () { return ({}); });
                _this.registerField = utils_1.bind(_this, _this.registerField);
                _this.registerValidator = utils_1.bind(_this, _this.registerValidator);
                _this.getComputedState = utils_1.bind(_this, _this.getComputedState);
                _this.getProviderValue = utils_1.bind(_this, _this.getProviderValue);
                _this.state = index_1.getStartingState(initialValue);
                return _this;
            }
            Form.prototype.registerValidator = function (fieldName, validators) {
                this.validators[fieldName] = validators;
            };
            Form.prototype.registerField = function (fieldName, value, validators) {
                this.registerValidator(fieldName, validators);
                if (this.state.fields[fieldName])
                    return; // field is already registered
                this.setState(function (_a) {
                    var fields = _a.fields;
                    return ({
                        fields: fieldStateHelpers_1.set(fields, fieldName, getInitialState_1.getInitialFieldState(value))
                    });
                });
            };
            Form.prototype.submit = function () {
                this.setState(function (_a) {
                    var fields = _a.fields, submitCount = _a.submitCount;
                    return ({
                        fields: index_1.touchAllFields(fields),
                        submitCount: submitCount + 1
                    });
                });
                if (index_1.formIsValid(this.validateForm())) {
                    var _a = this.props.submit, submit = _a === void 0 ? noop : _a;
                    submit(this.getFormValue());
                }
                else {
                    console.warn('cannot submit, form is not valid...');
                }
            };
            Form.prototype.getFormValue = function () {
                return index_1.getFormValue(this.state.fields);
            };
            Form.prototype.setFieldValue = function (fieldName, val) {
                if (!this.state.fields[fieldName])
                    return;
                this.setState(function (_a) {
                    var fields = _a.fields;
                    return ({
                        fields: fieldStateHelpers_1.set(fields, fieldName, index_1.setFieldValue(fields[fieldName], val))
                    });
                });
            };
            Form.prototype.touchField = function (fieldName) {
                if (!this.state.fields[fieldName])
                    return;
                this.setState(function (_a) {
                    var fields = _a.fields;
                    return ({
                        fields: fieldStateHelpers_1.set(fields, fieldName, fieldStateHelpers_1.touchField(fields[fieldName]))
                    });
                });
            };
            // todo touch/untouch specific fields
            Form.prototype.touchFields = function (fieldNames) {
                this.setState(function (_a) {
                    var fields = _a.fields;
                    return ({ fields: index_1.touchAllFields(fields) });
                });
            };
            Form.prototype.untouchField = function (fieldName) {
                if (!this.state.fields[fieldName])
                    return;
                this.setState(function (_a) {
                    var fields = _a.fields;
                    return ({
                        fields: fieldStateHelpers_1.set(fields, fieldName, fieldStateHelpers_1.untouchField(fields[fieldName]))
                    });
                });
            };
            Form.prototype.untouchFields = function (fieldNames) {
                this.setState(function (_a) {
                    var fields = _a.fields;
                    return ({ fields: index_1.untouchAllFields(fields) });
                });
            };
            Form.prototype.onFieldBlur = function (fieldName) {
                if (this.state.fields[fieldName].didBlur)
                    return;
                this.setState(function (_a) {
                    var fields = _a.fields;
                    return ({
                        fields: fieldStateHelpers_1.set(fields, fieldName, index_1.blurField(fields[fieldName]))
                    });
                });
            };
            Form.prototype.clearForm = function () {
                this.setState({ fields: index_1.clearFields(this.state.fields) });
            };
            Form.prototype.resetForm = function () {
                this.setState({ fields: fieldStateHelpers_1.resetFields(this.state.fields) });
            };
            Form.prototype.unload = function () {
                this.setState(index_1.getStartingState());
            };
            Form.prototype.forgetState = function () {
                this.setState(function (_a) {
                    var fields = _a.fields;
                    return ({ fields: index_1.untouchAllFields(fields), submitCount: 0 });
                });
            };
            Form.prototype.validateForm = function () {
                var form = this.state.fields;
                var result = utils_1.transform(this.validators, function (ret, validators, fieldName) {
                    ret[fieldName] = index_1.validateField(fieldName, form, validators);
                    return ret;
                });
                return result;
            };
            Form.prototype.getComputedState = function () {
                var fields = this.state.fields;
                var keys = Object.keys(fields);
                var formIsDirty = false;
                var formIsInvalid = false;
                var formIsTouched = false;
                var validation = {};
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var fieldName = keys_1[_i];
                    formIsDirty = formIsDirty || fieldStateHelpers_1.isDirty(fields[fieldName]);
                    formIsTouched = formIsTouched || fields[fieldName].touched;
                    var messages = index_1.validateField(fieldName, fields, this.validators[fieldName]);
                    validation[fieldName] = messages;
                    formIsInvalid = formIsInvalid || messages.length > 0;
                }
                return {
                    formIsDirty: formIsDirty,
                    formIsTouched: formIsTouched,
                    validation: validation,
                    formIsValid: !formIsInvalid
                };
            };
            Form.prototype.getProviderValue = function () {
                return __assign({}, this.state, this.getComputedState(), { unload: this.unload, submit: this.submit, clearForm: this.clearForm, touch: this.touchField, untouch: this.untouchField, resetForm: this.resetForm, forgetState: this.forgetState, getFormValue: this.getFormValue, onFieldBlur: this.onFieldBlur, setFieldValue: this.setFieldValue, registerField: this.registerField, registerValidator: this.registerValidator });
            };
            Form.prototype.render = function () {
                return React.createElement(Provider, { value: this.getProviderValue() }, this.props.children);
            };
            return Form;
        }(React.Component)),
        _a.getDerivedStateFromProps = index_1.getGetDerivedStateFromProps(),
        _a;
    var _a;
}
exports.default = wrapFormProvider;
//# sourceMappingURL=createFormProvider.js.map