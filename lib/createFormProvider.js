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
var utils_1 = require("./utils");
var getInitialState_1 = require("./getInitialState");
var helpers_1 = require("./helpers");
function wrapFormProvider(Provider, opts) {
    var initialState = helpers_1.getNullState();
    var _a = helpers_1.noops(), noopSubmit = _a.noopSubmit, noopOnFieldBlur = _a.noopOnFieldBlur, noopSetFieldValue = _a.noopSetFieldValue, noopValidateForm = _a.noopValidateForm, noopValidateField = _a.noopValidateField;
    var formIsValid = function (validation) {
        for (var k in validation) {
            if (validation[k].length > 0) {
                return false;
            }
        }
        return true;
    };
    return _b = /** @class */ (function (_super) {
            __extends(Form, _super);
            function Form() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.validators = {};
                _this.state = initialState;
                _this.submit = noopSubmit;
                _this.setFieldValue = noopSetFieldValue;
                _this.onFieldBlur = noopOnFieldBlur;
                _this.validateForm = noopValidateForm;
                _this.validateField = noopValidateField;
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
                    _this.handleAssign = _this.unassignFuncs;
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
                    _this.handleAssign = _this.assignFuncs;
                };
                _this.handleAssign = _this.assignFuncs;
                _this._submit = function () {
                    _this.setState(function (_a) {
                        var value = _a.value, submitCount = _a.submitCount;
                        return ({
                            value: helpers_1.touchAllFields(value),
                            submitCount: submitCount + 1
                        });
                    });
                    if (formIsValid(_this._validateForm())) {
                        var _a = _this.props.submit, submit = _a === void 0 ? opts.submit || noopSubmit : _a;
                        submit(helpers_1.getFormValue(_this.state.value));
                    }
                    else {
                        console.warn('cannot submit, form is not valid...');
                    }
                };
                _this._setFieldValue = function (fieldName, value) {
                    var state = utils_1.clone(_this.state);
                    state.value[fieldName].value = value;
                    state.value[fieldName].touched = true;
                    _this.setState(state);
                };
                _this._onFieldBlur = function (fieldName) {
                    if (_this.state.value[fieldName].didBlur)
                        return;
                    var state = utils_1.clone(_this.state);
                    state.value[fieldName].didBlur = true;
                    _this.setState(state);
                };
                _this.registerValidator = function (fieldName, validators) {
                    _this.validators[fieldName] = validators;
                    _this.forceUpdate();
                };
                _this.clearForm = function () {
                    _this.setState({ value: helpers_1.resetFields(_this.state.value) });
                };
                _this.unload = function () {
                    _this.setState(initialState);
                };
                _this.forgetState = function () {
                    _this.setState(function (_a) {
                        var value = _a.value;
                        return ({ value: helpers_1.untouchAllFields(value), submitCount: 0 });
                    });
                };
                _this._validateForm = function () {
                    if (!_this.state.loaded)
                        return {};
                    var result = {};
                    for (var v in _this.validators) {
                        result[v] = _this.validateField(v);
                    }
                    return result;
                };
                _this._validateField = function (fieldName) {
                    var form = _this.state.value;
                    var value = form[fieldName];
                    var validators = _this.validators[fieldName];
                    return helpers_1.validateField(value, form, validators);
                };
                _this.getProviderValue = function () {
                    return __assign({}, _this.state, { unload: _this.unload, submit: _this.submit, clearForm: _this.clearForm, forgetState: _this.forgetState, onFieldBlur: _this.onFieldBlur, validation: _this.validateForm(), setFieldValue: _this.setFieldValue, registerValidator: _this.registerValidator });
                };
                return _this;
            }
            Form.prototype.componentDidMount = function () {
                var _this = this;
                var getInitialValueAsync = opts.getInitialValueAsync;
                if (this.state.loaded) {
                    this.assignFuncs(true);
                }
                else if (getInitialValueAsync) {
                    getInitialValueAsync().then(function (value) {
                        _this.assignFuncs();
                        _this.setState({ value: getInitialState_1.default(value), loaded: true });
                    });
                }
            };
            // getSnapshotBeforeUpdate(pp: FPP<T>, ps: FCS<T>, snapshot?: SnapShot) {
            //   return null
            // }
            Form.prototype.componentDidUpdate = function (pp, ps) {
                if (ps.isBusy !== this.state.isBusy) {
                    this.handleAssign(true);
                }
            };
            Form.prototype.render = function () {
                return React.createElement(Provider, { value: this.getProviderValue() }, this.props.children);
            };
            return Form;
        }(React.Component)),
        _b.getDerivedStateFromProps = helpers_1.getGetDerivedStateFromProps(opts),
        _b;
    var _b;
}
exports.default = wrapFormProvider;
//# sourceMappingURL=createFormProvider.js.map