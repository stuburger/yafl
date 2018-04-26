import * as React from 'react'
import { createForm, Person, FieldProps } from '.'

export const TextInput: React.SFC<FieldProps<any, any>> = props => {
  const { value } = props.input

  return (
    <input
      {...props.input}
      onChange={e => props.utils.setFieldValue('age', 'kjkjh')}
      onBlur={props.input.onBlur}
      placeholder="First Name"
      value={value}
    />
  )
}

const startingValue = {
  name: '',
  surname: '',
  gender: 'male',
  age: 30,
  contact: {
    tel: '323423424'
  },
  favorites: ['']
}

const { Form, Field, createField } = createForm<Person>(startingValue)

const Surname = createField('surname')
const Age = createField('age', TextInput)

const TTT = props => (
  <Form>
    <Field name="name" initialValue={44} component={TextInput} />
    <Surname
      placeholder="First Name"
      // initialValue={33}
      render={field => {
        return <input {...props.input} {...field.meta} />
      }}
    />
    <Age placeholder="First Name" />
  </Form>
)

export default TTT
