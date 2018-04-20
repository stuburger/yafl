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
var getInitialState_1 = require("./getInitialState");
var defaultFieldState = getInitialState_1.getInitialFieldState(null);
function wrapConsumer(Consumer, fieldName) {
    var InnerField = getInnerField();
    var emptyArray = [];
    return /** @class */ (function (_super) {
        __extends(FormField, _super);
        function FormField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._render = function (_a) {
                var value = _a.value, loaded = _a.loaded, formIsDirty = _a.formIsDirty, providerValue = __rest(_a, ["value", "loaded", "formIsDirty"]);
                var _b = _this.props, render = _b.render, component = _b.component, name = _b.name, validators = _b.validators, props = __rest(_b, ["render", "component", "name", "validators"]);
                var state = value[name] || defaultFieldState;
                var validation = providerValue.validation[name] || emptyArray;
                return (React.createElement(InnerField, __assign({}, state, props, { name: name, render: render, component: component, validation: validation, validators: validators, formIsDirty: formIsDirty, touch: providerValue.touch, submit: providerValue.submit, unload: providerValue.unload, untouch: providerValue.untouch, clearForm: providerValue.clearForm, submitting: providerValue.submitting, forgetState: providerValue.forgetState, submitCount: providerValue.submitCount, onFieldBlur: providerValue.onFieldBlur, setFieldValue: providerValue.setFieldValue, registerField: providerValue.registerField, registerValidator: providerValue.registerValidator, isDirty: formIsDirty && !utils_1.isEqual(state.originalValue, state.value) })));
            };
            return _this;
        }
        FormField.prototype.render = function () {
            return React.createElement(Consumer, null, this._render);
        };
        return FormField;
    }(React.Component));
}
function getInnerField() {
    var emptyArray = [];
    var InnerField = /** @class */ (function (_super) {
        __extends(InnerField, _super);
        function InnerField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onBlur = function (e) {
                var _a = _this.props, onFieldBlur = _a.onFieldBlur, name = _a.name, onBlur = _a.onBlur;
                onFieldBlur(name);
                if (onBlur) {
                    onBlur(e);
                }
            };
            _this.onChange = function (e) {
                var _a = _this.props, setFieldValue = _a.setFieldValue, name = _a.name;
                setFieldValue(name, e.target.value);
            };
            _this.touch = function (name) {
                if (name === void 0) { name = _this.props.name; }
                var touch = _this.props.touch;
                touch(_this.props.name);
            };
            _this.untouch = function (name) {
                if (name === void 0) { name = _this.props.name; }
                var untouch = _this.props.untouch;
                untouch(name);
            };
            _this.collectProps = function () {
                var _a = _this.props, touch = _a.touch, untouch = _a.untouch, render = _a.render, component = _a.component, initialValue = _a.initialValue, registerField = _a.registerField, registerValidator = _a.registerValidator, _b = _a.validation, validation = _b === void 0 ? emptyArray : _b, props = __rest(_a, ["touch", "untouch", "render", "component", "initialValue", "registerField", "registerValidator", "validation"]);
                return __assign({ touch: _this.touch, untouch: _this.untouch, name: _this.props.name, value: _this.props.value, originalValue: _this.props.originalValue, didBlur: _this.props.didBlur, touched: _this.props.touched, isDirty: _this.props.isDirty, isValid: validation.length === 0, messages: validation, submitCount: _this.props.submitCount, onBlur: _this.onBlur, onChange: _this.onChange }, props);
            };
            return _this;
        }
        InnerField.prototype.componentDidMount = function () {
            var _a = this.props, registerField = _a.registerField, name = _a.name, initialValue = _a.initialValue, validators = _a.validators;
            registerField(name, initialValue, validators || emptyArray);
        };
        InnerField.prototype.componentDidUpdate = function (pp) {
            var _a = this.props, _b = _a.validators, validators = _b === void 0 ? emptyArray : _b, registerValidator = _a.registerValidator, name = _a.name;
            if (validators !== pp.validators) {
                registerValidator(name, validators);
            }
        };
        InnerField.prototype.render = function () {
            var _a = this.props, render = _a.render, Component = _a.component, name = _a.name;
            var props = this.collectProps();
            if (Component) {
                return React.createElement(Component, __assign({}, props));
            }
            if (render) {
                return render(props);
            }
            return (React.createElement(AbsentField_1.default, { message: "Please provide render or component prop for field: '" + name + "'" }));
        };
        return InnerField;
    }(React.Component));
    return InnerField;
}
exports.default = wrapConsumer;
//# sourceMappingURL=createField.js.map