import * as React from 'react'
import { createForm, Person, FormContextReceiverProps, FieldProps } from '.'

export const TextInput: React.SFC<FieldProps<any, any>> = props => {
  const { value } = props
  props.setValue('')
  props.setFieldValue('age', 0)
  return (
    <input
      {...props.input}
      onChange={e => props.setFieldValue('age', 'kjkjh')}
      onBlur={props.onBlur}
      placeholder="First Name"
      value={value}
    />
  )
}

const startingValue: Person = {
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
const Age2 = createField('age', state => {
  return null
})

const TTT = props => (
  <Form>
    <Field
      name="name"
      component={TextInput}
      // render={field => {
      //   const f = field.value as string
      //   return (
      //     <input
      //       name={field.name}
      //       onChange={e => field.setFieldValue('age', 99)}
      //       value={f}
      //       onBlur={field.onBlur}
      //       placeholder="First Name"
      //     />
      //   )
      // }}
    />

    <Surname
      // name="surname"
      render={field => {
        return (
          <input
            {...field.input}
            //onChange={e => field.setFieldValue('surname', 'bourhill')}
            placeholder="First Name"
          />
        )
      }}
    />

    <Age
      //name="age"
      render={field => {
        const { value } = field
        field.setValue(88)
        field.setFieldValue('age', 43)
        return (
          <input
            name={field.name}
            onChange={e => field.setFieldValue('age', 89)}
            onBlur={field.onBlur}
            placeholder="First Name"
            value={value}
          />
        )
      }}
    />
  </Form>
)

export default TTT
