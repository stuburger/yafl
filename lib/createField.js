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
    didBlur: false,
    touched: false
};
function isEqual(val1, val2) {
    return val1 === val2 || JSON.stringify(val1) === JSON.stringify(val2);
}
function wrapConsumer(Consumer) {
    var InnerField = getInnerField();
    var emptyValidators = [];
    var emptyArray = [];
    return /** @class */ (function (_super) {
        __extends(FormField, _super);
        function FormField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._render = function (_a) {
                var value = _a.value, loaded = _a.loaded, providerValue = __rest(_a, ["value", "loaded"]);
                var _b = _this.props, render = _b.render, component = _b.component, name = _b.name, _c = _b.validators, validators = _c === void 0 ? emptyValidators : _c, props = __rest(_b, ["render", "component", "name", "validators"]);
                if (loaded && value[name] === undefined) {
                    return React.createElement(AbsentField_1.default, { name: name });
                }
                var state = loaded ? value[name] : defaultFieldState;
                var validation = loaded ? providerValue.validation[name] : emptyArray;
                return (React.createElement(InnerField, __assign({}, state, props, { name: name, state: state, render: render, component: component, validation: validation, validators: validators, submit: providerValue.submit, unload: providerValue.unload, clearForm: providerValue.clearForm, submitting: providerValue.submitting, forgetState: providerValue.forgetState, submitCount: providerValue.submitCount, onFieldBlur: providerValue.onFieldBlur, setFieldValue: providerValue.setFieldValue, isDirty: isEqual(state.originalValue, state.value), registerValidator: providerValue.registerValidator })));
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
            _this.collectProps = function () {
                var _a = _this.props, _b = _a.validation, validation = _b === void 0 ? emptyArray : _b, render = _a.render, component = _a.component, registerValidator = _a.registerValidator, props = __rest(_a, ["validation", "render", "component", "registerValidator"]);
                return __assign({}, props, { validation: {
                        isValid: validation.length === 0,
                        messages: validation
                    }, onBlur: _this.onBlur, onChange: _this.onChange });
            };
            return _this;
        }
        InnerField.prototype.componentDidMount = function () {
            var _a = this.props, registerValidator = _a.registerValidator, name = _a.name, _b = _a.validators, validators = _b === void 0 ? emptyArray : _b;
            registerValidator(name, validators);
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
            if (render) {
                return render(props);
            }
            if (Component) {
                return React.createElement(Component, __assign({}, props));
            }
            return (React.createElement(AbsentField_1.default, { message: "Please provide render or component prop for field: '" + name + "'" }));
        };
        return InnerField;
    }(React.Component));
    return InnerField;
}
exports.default = wrapConsumer;
//# sourceMappingURL=createField.js.map