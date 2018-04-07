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
var AbsentField_1 = require("./AbsentField");
var defaultFieldState = {
    value: '',
    originalValue: '',
    isValid: false,
    didBlur: false,
    isTouched: false
};
function isEqual(val1, val2) {
    return val1 === val2 || JSON.stringify(val1) === JSON.stringify(val2);
}
function wrapConsumer(Consumer) {
    var InnerField = getInnerField();
    var emptyValidators = [];
    return /** @class */ (function (_super) {
        __extends(FormField, _super);
        function FormField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._render = function (providerValue) {
                var _a = _this.props, name = _a.name, render = _a.render, component = _a.component, _b = _a.validators, validators = _b === void 0 ? emptyValidators : _b, props = __rest(_a, ["name", "render", "component", "validators"]);
                var loaded = providerValue.loaded;
                if (loaded && providerValue.value[name] === undefined) {
                    return React.createElement(AbsentField_1.default, { name: name });
                }
                var state = loaded ? providerValue.value[name] : defaultFieldState;
                return (React.createElement(InnerField, __assign({}, state, props, { name: name, state: state, render: render, component: component, submit: providerValue.submit, validators: validators, onFieldBlur: providerValue.onFieldBlur, validateField: providerValue.validateField, setFieldValue: providerValue.setFieldValue, isDirty: isEqual(state.originalValue, state.value), registerValidator: providerValue.registerValidator, validationResult: providerValue.validateField(name, state) })));
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
    return /** @class */ (function (_super) {
        __extends(InnerField, _super);
        function InnerField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.state = { isMounted: false };
            // TODO shouldComponentUpdate(np: InnerFieldProps<T>){}
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
            _this.collectProps = function () {
                var _a = _this.props, value = _a.value, submit = _a.submit, didBlur = _a.didBlur, isDirty = _a.isDirty, isTouched = _a.isTouched, validationResult = _a.validationResult, props = __rest(_a, ["value", "submit", "didBlur", "isDirty", "isTouched", "validationResult"]);
                return __assign({}, props, { didBlur: didBlur,
                    isDirty: isDirty,
                    isTouched: isTouched, onBlur: _this.onBlur, onChange: _this.onChange, validation: validationResult });
            };
            return _this;
        }
        InnerField.prototype.componentDidMount = function () {
            var _a = this.props, registerValidator = _a.registerValidator, name = _a.name, _b = _a.validators, validators = _b === void 0 ? [] : _b;
            registerValidator(name, validators);
        };
        InnerField.prototype.componentDidUpdate = function (pp) {
            var _a = this.props, validators = _a.validators, registerValidator = _a.registerValidator, name = _a.name;
            if (validators !== pp.validators) {
                registerValidator(name, validators);
            }
        };
        InnerField.prototype.render = function () {
            var _a = this.props, render = _a.render, Component = _a.component, name = _a.name;
            var props = this.collectProps();
            if (render) {
                return render(props);
            }
            if (Component) {
                return React.createElement(Component, __assign({}, props));
            }
            return (React.createElement(AbsentField_1.default, { message: "Please provide render or component prop for form field: '" + name + "'" }));
        };
        return InnerField;
    }(React.Component));
}
exports.default = wrapConsumer;
//# sourceMappingURL=wrapConsumer.js.map