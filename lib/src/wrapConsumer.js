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
var defaultFieldState = {
    value: '',
    originalValue: '',
    isValid: false,
    isDirty: false,
    didBlur: false,
    isTouched: false
};
function wrapConsumer(Consumer) {
    var InnerField = getInnerField();
    return /** @class */ (function (_super) {
        __extends(FormField, _super);
        function FormField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._render = function (state) {
                var _a = _this.props, name = _a.name, render = _a.render, _b = _a.validators, validators = _b === void 0 ? [] : _b;
                var loaded = state.loaded;
                if (loaded && state.value[name] === undefined) {
                    return React.createElement(AbsentField, { name: name });
                }
                var value = loaded ? state.value[name] : defaultFieldState;
                return (React.createElement(InnerField, __assign({}, value, { name: name, submit: state.submit, validators: validators, onFieldBlur: state.onFieldBlur, setFieldValue: state.setFieldValue, validationResult: state.validateField(name, value), registerValidator: state.registerValidator, render: render })));
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
            // TODO
            // shouldComponentUpdate(np: InnerFieldProps<T>) {
            //   return this.props.value !== np.value
            // }
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
            return _this;
        }
        InnerField.prototype.componentDidMount = function () {
            var _a = this.props, registerValidator = _a.registerValidator, name = _a.name, _b = _a.validators, validators = _b === void 0 ? [] : _b;
            registerValidator(name, validators);
        };
        InnerField.prototype.componentDidUpdate = function (pp) {
            var _a = this.props, _b = _a.validators, validators = _b === void 0 ? [] : _b, registerValidator = _a.registerValidator, name = _a.name;
            if (validators !== pp.validators) {
                registerValidator(name, validators);
            }
        };
        InnerField.prototype.render = function () {
            var _a = this.props, render = _a.render, value = _a.value, isDirty = _a.isDirty, submit = _a.submit, didBlur = _a.didBlur, isTouched = _a.isTouched, validationResult = _a.validationResult;
            return render({
                value: value,
                isDirty: isDirty,
                submit: submit,
                didBlur: didBlur,
                isTouched: isTouched,
                onBlur: this.onBlur,
                onChange: this.onChange,
                validation: validationResult
            });
        };
        return InnerField;
    }(React.Component));
}
exports.default = wrapConsumer;
var AbsentField = function (_a) {
    var name = _a.name;
    return React.createElement("span", null,
        "Fielp with name '",
        name,
        "' does not exist.");
};
//# sourceMappingURL=wrapConsumer.js.map