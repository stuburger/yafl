import * as React from 'react'
import { createForm, Person } from '.'

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
const Age = createField('age')

const TTT = props => (
  <Form>
    <Field
      name="name"
      render={field => {
        const f = field.value as string
        return (
          <input
            name={field.name}
            onChange={e => field.setFieldValue('age', 99)}
            value={f}
            onBlur={field.onBlur}
            placeholder="First Name"
          />
        )
      }}
    />

    <Surname
      // name="surname"
      render={field => {
        const { value } = field

        return (
          <input
            name={field.name}
            value={value}
            //onChange={e => field.setFieldValue('surname', 'bourhill')}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder="First Name"
          />
        )
      }}
    />

    <Age
      // name="age"
      render={field => {
        const { value } = field
        field.setValue(88)
        field.setFieldValue('age', 0)
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
