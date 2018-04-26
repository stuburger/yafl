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
function wrapConsumer(Consumer) {
    var Component = getComponent();
    return /** @class */ (function (_super) {
        __extends(FormComponent, _super);
        function FormComponent(props) {
            var _this = _super.call(this, props) || this;
            _this._render = _this._render.bind(_this);
            return _this;
        }
        FormComponent.prototype._render = function (provider) {
            var _a = this.props, name = _a.name, render = _a.render, component = _a.component, initialValue = _a.initialValue, validators = _a.validators, props = __rest(_a, ["name", "render", "component", "initialValue", "validators"]);
            return (React.createElement(Component, { render: render, component: component, provider: provider, forwardProps: props }));
        };
        FormComponent.prototype.render = function () {
            return React.createElement(Consumer, null, this._render);
        };
        return FormComponent;
    }(React.Component));
}
function getComponent() {
    var FormComponent = /** @class */ (function (_super) {
        __extends(FormComponent, _super);
        function FormComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FormComponent.prototype.collectMetaProps = function () {
            var provider = this.props.provider;
            return {
                loaded: provider.loaded,
                submitting: provider.submitting,
                isDirty: provider.formIsDirty,
                touched: provider.formIsTouched,
                submitCount: provider.submitCount,
                isValid: provider.formIsValid,
                validation: provider.validation,
                initialValue: provider.initialValue
            };
        };
        FormComponent.prototype.collectUtilProps = function () {
            var provider = this.props.provider;
            return {
                touch: provider.touch,
                untouch: provider.untouch,
                unload: provider.unload,
                submit: provider.submit,
                resetForm: provider.resetForm,
                getFormValue: provider.getFormValue,
                setFieldValue: provider.setFieldValue,
                forgetState: provider.forgetState,
                clearForm: provider.clearForm
            };
        };
        FormComponent.prototype.collectProps = function () {
            return __assign({ state: this.collectMetaProps(), utils: this.collectUtilProps() }, this.props.forwardProps);
        };
        FormComponent.prototype.render = function () {
            var _a = this.props, render = _a.render, Component = _a.component;
            var props = this.collectProps();
            if (render) {
                return render(props);
            }
            if (Component) {
                return React.createElement(Component, __assign({}, props));
            }
            return null;
        };
        return FormComponent;
    }(React.Component));
    return FormComponent;
}
exports.default = wrapConsumer;
//# sourceMappingURL=createFormComponent.js.map