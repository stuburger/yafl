"use strict";
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
const React = require("react");
function wrapConsumer(Consumer) {
    const Component = getComponent();
    return class FormComponent extends React.Component {
        constructor(props) {
            super(props);
            this._render = this._render.bind(this);
        }
        _render(provider) {
            const _a = this.props, { name, render, component, initialValue, validators } = _a, props = __rest(_a, ["name", "render", "component", "initialValue", "validators"]);
            return (React.createElement(Component, { render: render, component: component, provider: provider, forwardProps: props }));
        }
        render() {
            return React.createElement(Consumer, null, this._render);
        }
    };
}
function getComponent() {
    class FormComponent extends React.Component {
        collectMetaProps() {
            const { provider } = this.props;
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
        }
        collectUtilProps() {
            const { provider } = this.props;
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
        }
        collectProps() {
            return Object.assign({ state: this.collectMetaProps(), utils: this.collectUtilProps() }, this.props.forwardProps);
        }
        render() {
            const { render, component: Component } = this.props;
            const props = this.collectProps();
            if (render) {
                return render(props);
            }
            if (Component) {
                return React.createElement(Component, Object.assign({}, props));
            }
            return null;
        }
    }
    return FormComponent;
}
exports.default = wrapConsumer;
//# sourceMappingURL=createFormComponent.js.map