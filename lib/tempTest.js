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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var formBuilder_1 = require("./formBuilder");
function loadFormData() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve({ firstName: 'Stuart', lastName: 'Bourhill' });
        }, 2000);
    });
}
var _a = new formBuilder_1.default()
    .loading(function (props) { return props.loading; })
    .create(), Form = _a.Form, Field = _a.Field;
function required(field, fieldName, formValue) {
    if (!field.value)
        return fieldName + " is required";
}
function minLength(len) {
    return function (field, fieldName, formValue) {
        if (field.value.length < len)
            return fieldName + " must be at least " + len + " characters";
    };
}
var minLengthValidator = minLength(3);
var validators = [minLengthValidator];
var TestingForm = /** @class */ (function (_super) {
    __extends(TestingForm, _super);
    function TestingForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { validators: validators };
        _this.makeRequired = function () {
            _this.setState({ validators: _this.state.validators.concat([required]) });
        };
        return _this;
    }
    TestingForm.prototype.render = function () {
        return (React.createElement(Form, { loadAsync: loadFormData },
            React.createElement(Field, { name: "firstName", validators: this.state.validators, render: function (s) { return (React.createElement("div", null,
                    React.createElement("span", null, "First Name"),
                    React.createElement("input", { onChange: s.onChange, value: s.value }),
                    React.createElement("span", null, s.validation.messages))); } }),
            React.createElement(Field, { name: "lastName", render: function (s) { return (React.createElement("div", null,
                    React.createElement("span", null, "Last Name"),
                    React.createElement("input", { onChange: s.onChange, value: s.value }),
                    React.createElement("span", null, s.validation.messages))); } }),
            React.createElement("button", { onClick: this.makeRequired }, "make required")));
    };
    return TestingForm;
}(React.Component));
var TestPage = /** @class */ (function (_super) {
    __extends(TestPage, _super);
    function TestPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestPage.prototype.render = function () {
        return React.createElement(TestingForm, null);
    };
    return TestPage;
}(React.Component));
exports.default = TestPage;
//# sourceMappingURL=tempTest.js.map