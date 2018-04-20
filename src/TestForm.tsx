import * as React from 'react'
import { createForm, Person } from '.'

const { Form, Field, createTypedField } = createForm<Person>()

const Surname = createTypedField('surname')
const Age = createTypedField('age')

const TTT = props => (
  <Form initialValue={{ name: 'stuart' }}>
    <Field
      name="name"
      render={field => (
        <input
          name={field.name}
          // onChange={field.onChange}
          onChange={e => field.setFieldValue('name', 44)}
          onBlur={field.onBlur}
          placeholder="First Name"
        />
      )}
    />

    <Surname
      name="surname"
      render={field => (
        <input
          name={field.name}
          //onChange={e => field.setFieldValue('surname', 'bourhill')}
          onChange={field.onChange}
          onBlur={field.onBlur}
          placeholder="First Name"
        />
      )}
    />

    <Age
      name="age"
      render={field => (
        <input
          name={field.name}
          onChange={e => field.setFieldValue('age', 33)}
          onBlur={field.onBlur}
          placeholder="First Name"
        />
      )}
    />
  </Form>
)

export default TTT
