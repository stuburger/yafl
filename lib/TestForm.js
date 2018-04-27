"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const index_1 = require("./index");
exports.TextInput = props => {
    const { value } = props.input;
    return (React.createElement("input", Object.assign({}, props.input, { onChange: e => props.utils.setFieldValue('age', 'kjkjh'), onBlur: props.input.onBlur, placeholder: "First Name", value: value })));
};
const startingValue = {
    name: '',
    surname: '',
    gender: 'male',
    age: 30,
    contact: {
        tel: '323423424'
    },
    favorites: ['']
};
const { Form, Field, createField } = index_1.createForm(startingValue);
const Surname = createField('surname');
const Age = createField('age', exports.TextInput);
const TTT = props => (React.createElement(Form, null,
    React.createElement(Field, { name: "name", initialValue: 44, component: exports.TextInput }),
    React.createElement(Surname, { placeholder: "First Name", render: field => {
            return React.createElement("input", Object.assign({}, props.input, field.meta));
        } }),
    React.createElement(Age, { placeholder: "First Name" })));
exports.default = TTT;
/*

 <Field
        name="spiritAnimal"
        className="input_spirit-animal"
        render={({ input, utils, meta, ...props }) => (
          <input
            {...input}
            {...props.forward}
            onChange={e => {
              const spiritAnimal = e.target.value
              utils.setFieldValue('spiritAnimal', spiritAnimal)
              if (spiritAnimal === 'monkey') {
                utils.setFieldValue('status', 'famousandcool')
              }
            }}
          />
        )}
      />
*/
//# sourceMappingURL=TestForm.js.map