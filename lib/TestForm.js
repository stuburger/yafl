"use strict";
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
var _1 = require(".");
exports.TextInput = function (props) {
    var value = props.input.value;
    return (React.createElement("input", __assign({}, props.input, { onChange: function (e) { return props.utils.setFieldValue('age', 'kjkjh'); }, onBlur: props.input.onBlur, placeholder: "First Name", value: value })));
};
var startingValue = {
    name: '',
    surname: '',
    gender: 'male',
    age: 30,
    contact: {
        tel: '323423424'
    },
    favorites: ['']
};
var _a = _1.createForm(startingValue), Form = _a.Form, Field = _a.Field, createField = _a.createField;
var Surname = createField('surname');
var Age = createField('age', exports.TextInput);
var TTT = function (props) { return (React.createElement(Form, null,
    React.createElement(Field, { name: "name", initialValue: 44, component: exports.TextInput }),
    React.createElement(Surname, { placeholder: "First Name", 
        // initialValue={33}
        render: function (field) {
            return React.createElement("input", __assign({}, props.input, props.forward));
        } }),
    React.createElement(Age, { placeholder: "First Name" }))); };
exports.default = TTT;
//# sourceMappingURL=TestForm.js.map