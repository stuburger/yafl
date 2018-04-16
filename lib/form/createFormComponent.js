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
        function FormComponent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._render = function (_a) {
                var registerValidator = _a.registerValidator, registerField = _a.registerField, onFieldBlur = _a.onFieldBlur, providerValue = __rest(_a, ["registerValidator", "registerField", "onFieldBlur"]);
                return React.createElement(Component, __assign({}, _this.props, providerValue));
            };
            return _this;
        }
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
        FormComponent.prototype.render = function () {
            var _a = this.props, render = _a.render, Component = _a.component, props = __rest(_a, ["render", "component"]);
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