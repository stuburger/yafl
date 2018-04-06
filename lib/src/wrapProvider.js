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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var lodash_1 = require("lodash");
var getInitialState_1 = require("./getInitialState");
function wrapFormProvider(Provider, opts) {
    // const getInitialValue = (props): FormFieldState<T> =>
    //   props.initialValue || opts.initialValue || ({} as FormFieldState<T>)
    return /** @class */ (function (_super) {
        __extends(Form, _super);
        // state = { value: getInitialValue(this.props) } // here be errors
        function Form(props) {
            var _this = _super.call(this, props) || this;
            _this.validators = {};
            _this.init = function (value) {
                var initialValue = getInitialState_1.default(value);
                _this.setState({ value: initialValue, loaded: true });
            };
            _this.submit = function () { };
            _this.setFieldValue = function (fieldName, value) {
                if (!_this.state.loaded) {
                    return;
                }
                var state = lodash_1.cloneDeep(_this.state);
                state.value[fieldName].value = value;
                state.value[fieldName].isTouched = true;
                state.value[fieldName].isDirty =
                    JSON.stringify(value) !== JSON.stringify(state.value[fieldName].originalValue);
                _this.setState(state);
            };
            _this.onFieldBlur = function (fieldName) {
                if (_this.state.value[fieldName].didBlur)
                    return;
                var state = lodash_1.cloneDeep(_this.state);
                state.value[fieldName].didBlur = true;
                _this.setState(state);
            };
            _this.registerValidator = function (fieldName, validators) {
                _this.validators[fieldName] = validators;
            };
            _this.validateField = function (fieldName, value) {
                var validators = _this.validators[fieldName] || [];
                var messages = validators.map(function (f) { return f(value, fieldName, _this.state.value); }).filter(function (x) { return !!x; });
                return {
                    messages: messages,
                    isValid: messages.length === 0
                };
            };
            _this.getProviderValue = function () {
                return {
                    loaded: _this.state.loaded,
                    submit: _this.submit,
                    value: _this.state.value,
                    setFieldValue: _this.setFieldValue,
                    registerValidator: _this.registerValidator,
                    validateField: _this.validateField,
                    onFieldBlur: _this.onFieldBlur
                };
            };
            _this.state = { value: null, loaded: false }; // here be errors
            return _this;
        }
        Form.prototype.componentDidMount = function () {
            var load = this.props.loadAsync || opts.loadAsync;
            if (load) {
                load().then(this.init);
            }
        };
        Form.prototype.render = function () {
            return React.createElement(Provider, { value: this.getProviderValue() }, this.props.children);
        };
        return Form;
    }(React.Component));
}
exports.default = wrapFormProvider;
//# sourceMappingURL=wrapProvider.js.map