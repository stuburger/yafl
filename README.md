# kwik-form 

[![Build Status](https://travis-ci.org/stuburger/kwik-form.svg?branch=master)](https://travis-ci.org/stuburger/kwik-form)

_Warning: This library is a work in progress - as is this readme_

## Installation

_Not available on npm yet._

## Recommended Usage (Typescript)

```tsx
// PersonForm.tsx
...
import { createForm } from 'kwik-form'

interface Person {
  id?: string
  fullName: string
  height: number
  status: 'cool' | 'famous' | 'famousandcool'
}

const defaultPerson: Person = {
  fullName: '',
  height: 0,
  status: 'cool',
}

const { Form, createField } = createForm<Person>(defaultPerson)

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
      onSubmit={({ fullName, height, status }) => {
        // destructuring for illustrative purposes
        save({ id: userId, fullName, height, status })
      }}
      loading={loading}
      submitting={submitting}
      initialValue={initialValue}
    >
      <FullName />
      <Height />
      <CoolStatus />
      <FormComponent render={props => <button onClick={props.utils.submit}>Save</button>} />
    </Form>
  )
}
```

## API

