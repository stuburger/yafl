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
var lodash_1 = require("lodash");
var getInitialState_1 = require("./getInitialState");
var defaultInitialState = {
    value: null,
    loaded: false,
    submitCount: 0
};
var initialValidationResult = {
    messages: [],
    isValid: true
};
function createFormUpdater(update) {
    return function (fields) {
        var state = {};
        for (var key in fields) {
            state[key] = update(fields[key]);
        }
        return state;
    };
}
var touchField = function (field) {
    return {
        isTouched: true,
        value: field.value,
        didBlur: field.didBlur,
        originalValue: field.originalValue
    };
};
// function untouchField(field: FieldState): FieldState {
//   return {
//     isTouched: false,
//     didBlur: false,
//     value: field.value,
//     originalValue: field.originalValue
//   }
// }
function resetField(field) {
    return {
        isTouched: false,
        didBlur: false,
        value: '',
        originalValue: ''
    };
}
var touchAllFields = createFormUpdater(touchField);
// const untouchAllFields = createFormUpdater(untouchField)
var resetFields = createFormUpdater(resetField);
function wrapFormProvider(Provider, opts) {
    var noopSubmit = function () { };
    var noopOnFieldBlur = function (fieldName) { };
    var noopSetFieldValue = function (fieldName, value) {
        console.log('form is still loading');
    };
    var noopValidateForm = function () {
        return initialValidationResult;
    };
    var noopValidateField = function (fieldName, value) {
        return initialValidationResult;
    };
    return /** @class */ (function (_super) {
        __extends(Form, _super);
        function Form(props) {
            var _this = _super.call(this, props) || this;
            _this.validators = {};
            _this.submit = noopSubmit;
            _this.setFieldValue = noopSetFieldValue;
            _this.onFieldBlur = noopOnFieldBlur;
            _this.validateForm = noopValidateForm;
            _this.validateField = noopValidateField;
            _this.init = function (value) {
                _this.assignFuncs();
                _this.setState({ value: getInitialState_1.default(value), loaded: true });
            };
            _this.assignFuncs = function (forceUpdate) {
                if (forceUpdate === void 0) { forceUpdate = false; }
                _this.submit = _this._submit;
                _this.setFieldValue = _this._setFieldValue;
                _this.onFieldBlur = _this._onFieldBlur;
                _this.validateForm = _this._validateForm;
                _this.validateField = _this._validateField;
                if (forceUpdate) {
                    _this.forceUpdate();
                }
            };
            _this.unassignFuncs = function (forceUpdate) {
                if (forceUpdate === void 0) { forceUpdate = false; }
                _this.submit = noopSubmit;
                _this.setFieldValue = noopSetFieldValue;
                _this.onFieldBlur = noopOnFieldBlur;
                _this.validateForm = noopValidateForm;
                _this.validateField = noopValidateField;
                if (forceUpdate) {
                    _this.forceUpdate();
                }
            };
            _this._submit = function () {
                _this.setState(function (_a) {
                    var value = _a.value, submitCount = _a.submitCount;
                    return ({
                        value: touchAllFields(value),
                        submitCount: submitCount + 1
                    });
                });
            };
            _this._setFieldValue = function (fieldName, value) {
                var state = lodash_1.cloneDeep(_this.state);
                state.value[fieldName].value = value;
                state.value[fieldName].isTouched = true;
                _this.setState(state);
            };
            _this._onFieldBlur = function (fieldName) {
                if (_this.state.value[fieldName].didBlur)
                    return;
                var state = lodash_1.cloneDeep(_this.state);
                state.value[fieldName].didBlur = true;
                _this.setState(state);
            };
            _this.registerValidator = function (fieldName, validators) {
                _this.validators[fieldName] = validators;
                _this.forceUpdate();
            };
            _this.clearForm = function () {
                _this.setState({ value: resetFields(_this.state.value) });
            };
            _this._validateForm = function () {
                var messages = [];
                for (var v in _this.validators) {
                    messages = messages.concat(_this._validateField(v).messages);
                }
                return {
                    messages: messages,
                    isValid: messages.length === 0
                };
            };
            _this._validateField = function (fieldName) {
                var validators = _this.validators[fieldName];
                var value = _this.state.value[fieldName];
                if (!value) {
                    return initialValidationResult;
                }
                var messages = validators.map(function (f) { return f(value, fieldName, _this.state.value); }).filter(function (x) { return !!x; });
                return {
                    messages: messages,
                    isValid: messages.length === 0
                };
            };
            _this.getProviderValue = function () {
                return __assign({}, _this.state, { submit: _this.submit, clearForm: _this.clearForm, setFieldValue: _this.setFieldValue, validation: _this.validateForm(), registerValidator: _this.registerValidator, validateField: _this.validateField, onFieldBlur: _this.onFieldBlur });
            };
            var initialValue = props.initialValue || opts.initialValue;
            if (initialValue) {
                _this.init(initialValue);
            }
            else {
                _this.state = defaultInitialState;
            }
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