import * as React from 'react'
import { Person } from './internal'
import { FieldProps } from './export'
import { createForm } from './index'

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
      render={field => {
        return <input {...props.input} {...field.meta} />
      }}
    />
    <Age placeholder="First Name" />
  </Form>
)

export default TTT

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
