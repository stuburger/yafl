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
import * as React from 'react';
import { cloneDeep } from 'lodash';
import getInitialState from './getInitialState';
function wrapFormProvider(Provider, opts) {
    // const getInitialValue = (props): FormFieldState<T> =>
    //   props.initialValue || opts.initialValue || ({} as FormFieldState<T>)
    return /** @class */ (function (_super) {
        __extends(Form, _super);
        function Form() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.validators = {};
            // state = { value: getInitialValue(this.props) } // here be errors
            _this.state = { value: null, loaded: false }; // here be errors
            _this.init = function (value) {
                _this.setState({ value: getInitialState(value), loaded: true });
            };
            _this.submit = function () { };
            _this.setFieldValue = function (fieldName, value) {
                if (!_this.state.loaded) {
                    return;
                }
                var state = cloneDeep(_this.state);
                state.value[fieldName].value = value;
                state.value[fieldName].isDirty =
                    JSON.stringify(value) !== JSON.stringify(state.value[fieldName].originalValue);
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
                    validateField: _this.validateField
                };
            };
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
export default wrapFormProvider;
//# sourceMappingURL=wrapProvider.js.map