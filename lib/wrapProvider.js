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
var initialValidation = [];
function createFormUpdater(update) {
    return function (fields) {
        var state = {};
        for (var key in fields) {
            state[key] = update(fields[key]);
        }
        return state;
    };
}
function getFormValue(fields) {
    var result = {};
    for (var fieldName in fields) {
        result[fieldName] = fields[fieldName].value;
    }
    return result;
}
var touchField = function (field) {
    return {
        isTouched: true,
        value: field.value,
        didBlur: field.didBlur,
        originalValue: field.originalValue
    };
};
function untouchField(field) {
    return {
        isTouched: false,
        didBlur: false,
        value: field.value,
        originalValue: field.originalValue
    };
}
function resetField(field) {
    return {
        isTouched: false,
        didBlur: false,
        value: '',
        originalValue: ''
    };
}
var touchAllFields = createFormUpdater(touchField);
var untouchAllFields = createFormUpdater(untouchField);
var resetFields = createFormUpdater(resetField);
function getNoops() {
    return {
        noopSubmit: function (formValue) { },
        noopOnFieldBlur: function (fieldName) { },
        noopSetFieldValue: function (fieldName, value) { },
        noopValidateForm: function () { return ({}); },
        noopValidateField: function (fieldName) { return initialValidation; }
    };
}
function wrapFormProvider(Provider, opts) {
    var _a = getNoops(), noopSubmit = _a.noopSubmit, noopOnFieldBlur = _a.noopOnFieldBlur, noopSetFieldValue = _a.noopSetFieldValue, noopValidateForm = _a.noopValidateForm, noopValidateField = _a.noopValidateField;
    var formIsValid = function (validation) {
        for (var k in validation) {
            if (validation[k].length > 0) {
                return false;
            }
        }
        return true;
    };
    function validateField(value, fieldName, form, validators) {
        var messages = [];
        for (var _i = 0, validators_1 = validators; _i < validators_1.length; _i++) {
            var validate = validators_1[_i];
            var message = validate(value, fieldName, form);
            if (message) {
                messages.push(message);
            }
        }
        return messages;
    }
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
                if (formIsValid(_this._validateForm())) {
                    var _a = _this.props.submit, submit = _a === void 0 ? opts.submit || noopSubmit : _a;
                    submit(getFormValue(_this.state.value));
                }
                else {
                    console.warn('cannot submit, form is not valid...');
                }
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
            _this.unload = function () {
                _this.setState({ value: resetFields(_this.state.value), loaded: false });
            };
            _this.forgetState = function () {
                _this.setState(function (_a) {
                    var value = _a.value;
                    return ({ value: untouchAllFields(value), submitCount: 0 });
                });
            };
            _this._validateForm = function () {
                var result = {};
                for (var v in _this.validators) {
                    result[v] = _this._validateField(v);
                }
                return result;
            };
            _this._validateField = function (fieldName) {
                var form = _this.state.value;
                var value = form[fieldName];
                var validators = _this.validators[fieldName];
                if (value) {
                    return validateField(value, fieldName, form, validators);
                }
                else {
                    return initialValidation;
                }
            };
            _this.getProviderValue = function () {
                return __assign({}, _this.state, { submit: _this.submit, clearForm: _this.clearForm, onFieldBlur: _this.onFieldBlur, validation: _this.validateForm(), setFieldValue: _this.setFieldValue, registerValidator: _this.registerValidator });
            };
            var initialValue = props.initialValue || opts.initialValue;
            if (initialValue) {
                _this.assignFuncs();
                _this.state = { value: getInitialState_1.default(initialValue), loaded: true, submitCount: 0 };
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