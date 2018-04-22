"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var _1 = require(".");
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
var Age = createField('age');
var TTT = function (props) { return (React.createElement(Form, null,
    React.createElement(Field, { name: "name", render: function (field) {
            var f = field.value;
            return (React.createElement("input", { name: field.name, onChange: function (e) { return field.setFieldValue('age', 99); }, value: f, onBlur: field.onBlur, placeholder: "First Name" }));
        } }),
    React.createElement(Surname
    // name="surname"
    , { 
        // name="surname"
        render: function (field) {
            var value = field.value;
            return (React.createElement("input", { name: field.name, value: value, 
                //onChange={e => field.setFieldValue('surname', 'bourhill')}
                onChange: field.onChange, onBlur: field.onBlur, placeholder: "First Name" }));
        } }),
    React.createElement(Age
    // name="age"
    , { 
        // name="age"
        render: function (field) {
            var value = field.value;
            field.setValue(88);
            field.setFieldValue('age', 0);
            return (React.createElement("input", { name: field.name, onChange: function (e) { return field.setFieldValue('age', 89); }, onBlur: field.onBlur, placeholder: "First Name", value: value }));
        } }))); };
exports.default = TTT;
//# sourceMappingURL=TestForm.js.map