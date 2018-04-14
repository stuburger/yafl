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
// import * as methods from './prototypeFunctions'
var getInitialState_1 = require("./getInitialState");
var index_1 = require("./index");
var utils_1 = require("../utils");
var noop = function () { };
function wrapFormProvider(Provider, opts) {
    var Form = /** @class */ (function (_super) {
        __extends(Form, _super);
        function Form(props) {
            var _this = _super.call(this, props) || this;
            _this.validators = {};
            _this.state = index_1.getNullState();
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
            _this.setFieldValue = onlyIfLoaded(_this.setFieldValue);
            _this.onFieldBlur = onlyIfLoaded(_this.onFieldBlur);
            _this.unload = onlyIfLoaded(_this.unload);
            _this.forgetState = onlyIfLoaded(_this.forgetState);
            _this.clearForm = onlyIfLoaded(_this.clearForm);
            _this.formIsDirty = onlyIfLoaded(_this.formIsDirty, function () { return false; });
            _this.validateForm = onlyIfLoaded(_this.validateForm, function () { return ({}); });
            _this.registerField = utils_1.bind(_this, _this.registerField);
            _this.registerValidator = utils_1.bind(_this, _this.registerValidator);
            _this.getProviderValue = utils_1.bind(_this, _this.getProviderValue);
            return _this;
        }
        Form.prototype.submit = function () {
            this.setState(function (_a) {
                var value = _a.value, submitCount = _a.submitCount;
                return ({
                    value: index_1.touchAllFields(value),
                    submitCount: submitCount + 1
                });
            });
            if (index_1.formIsValid(this.validateForm())) {
                var _a = this.props.submit, submit = _a === void 0 ? noop : _a;
                submit(index_1.getFormValue(this.state.value));
            }
            else {
                console.warn('cannot submit, form is not valid...');
            }
        };
        Form.prototype.setFieldValue = function (fieldName, val) {
            var value = utils_1.clone(this.state.value);
            value[fieldName] = index_1.setFieldValue(value[fieldName], val);
            this.setState(function (state) { return ({ value: value }); });
        };
        Form.prototype.onFieldBlur = function (fieldName) {
            if (this.state.value[fieldName].didBlur)
                return;
            var value = utils_1.clone(this.state.value);
            value[fieldName] = index_1.blurField(value[fieldName]);
            this.setState({ value: value });
        };
        Form.prototype.unload = function () {
            this.setState(index_1.getNullState());
        };
        Form.prototype.forgetState = function () {
            this.setState(function (_a) {
                var value = _a.value;
                return ({ value: index_1.untouchAllFields(value), submitCount: 0 });
            });
        };
        Form.prototype.validateForm = function () {
            var form = this.state.value;
            var result = utils_1.transform(this.validators, function (ret, validators, fieldName) {
                ret[fieldName] = index_1.validateField(fieldName, form, validators);
                return ret;
            });
            return result;
        };
        Form.prototype.clearForm = function () {
            this.setState({ value: index_1.resetFields(this.state.value) });
        };
        Form.prototype.registerField = function (fieldName, value, validators) {
            this.registerValidator(fieldName, validators);
            this.setState(function (s) {
                var state = utils_1.clone(s);
                state.value[fieldName] = getInitialState_1.getInitialFieldState(value);
                return state;
            });
        };
        Form.prototype.formIsDirty = function () {
            return index_1.formIsDirty(this.state.value);
        };
        Form.prototype.registerValidator = function (fieldName, validators) {
            this.validators[fieldName] = validators;
        };
        Form.prototype.getProviderValue = function () {
            return __assign({}, this.state, { unload: this.unload, submit: this.submit, clearForm: this.clearForm, forgetState: this.forgetState, formIsDirty: this.formIsDirty(), onFieldBlur: this.onFieldBlur, validation: this.validateForm(), setFieldValue: this.setFieldValue, registerField: this.registerField, registerValidator: this.registerValidator });
        };
        Form.prototype.render = function () {
            return React.createElement(Provider, { value: this.getProviderValue() }, this.props.children);
        };
        Form.getDerivedStateFromProps = index_1.getGetDerivedStateFromProps(opts);
        return Form;
    }(React.Component));
    return Form;
}
exports.default = wrapFormProvider;
//# sourceMappingURL=createFormProvider.js.map