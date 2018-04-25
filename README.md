# react-form-provider

_Warning: This library is a work in progress - as is this readme_

There are a lot of form libraries out there to choose from. `react-form-provider` focus is on:

1.  being strongly typed - useful for typescript users
2.  having a small, imperative API
3.  utilizing Reacts new context API to manage your forms state

## Installation

_Not available on npm yet._

## Usage

```tsx
// PersonForm

...

import { createForm } from 'react-form-provider'

interface Person {
  id?: string
  fullName: string
  height: number
  status: 'cool' | 'famous' | 'famousandcool'
  spiritAnimal: string
}

const defaultPerson: Person = {
  fullName: '',
  height: 0,
  status: 'cool',
  spiritAnimal: ''
}

const { Form, Field, FormComponent, createField } = createForm<Person>(defaultPerson)

/*
  The following is verbose but required if you want the type safety.
*/
const FullName = createField('fullName', props => <input {...props.input} {...props.forward} />)
const Height = createField('height', props => <input {...props.input} {...props.forward} />)
const CoolStatus = createField('famousandcool', props => (
  <select {...props.input} {...props.forward}>
    <option value="">Please choose</option>
    <option value="sorta">Sorta</option>
    <option value="justcool">Cool</option>
    <option value="famousandcool">Famous and cool</option>
  </select>
))

interface Props {
  userId?: string
  loading: boolean
  submitting: boolean
  initialValue: Person
  save: (data: Person) => void
}

export const UserForm: React.SFC<Props> = ({ loading, submitting, save, initialValue, userId }) => {
  return (
    <Form
      onSubmit={({ fullName, height, status, spiritAnimal }) => {
        // destructuring for illustrative purposes
        save({ id: userId, fullName, height, status, spiritAnimal })
      }}
      loading={loading}
      submitting={submitting}
      initialValue={initialValue}
    >
      <FullName />
      <Height />
      <CoolStatus />
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
      <FormComponent render={props => <button onClick={props.utils.submit}>Save</button>} />
    </Form>
  )
}
```

## API

