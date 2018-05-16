# react-yafl

[![Build Status](https://travis-ci.org/stuburger/react-yafl.svg?branch=master)](https://travis-ci.org/stuburger/react-yafl)

YAFL - Yet Another Form Library

## Installation

_Not available on npm yet._

## Basic Usage

```js
// SimpleForm.js

import { Form, Field, FormComponent } from 'react-yafl'

function TextInput(props) {
  return (
    <div>
      <label>{props.forwardProps.label}</label>
      <input {...props.input} />
    </div>
  )
}

class SimpleForm extends React.Component {
  handleSubmit = formValue => {
    console.log(formValue) // { firstName: 'John', lastName: 'Smith' }
  }

  render() {
    return (
      <Form
        onSubmit={this.handleSubmit}
        defaultValue={{ firstName: '', latName: '' }}
        initialValue={{ firstName: 'John', lastName: 'Smith' }}
      >
        <Field name="firstName" label="First Name" render={props => <TextInput {...props} />} />
        <Field name="lastName" label="Last Name" render={props => <TextInput {...props} />} />
      </Form>
    )
  }
}
```

## Top Level API

react-yafl uses the react context api behind the scenes to pass props between components. yafl only exports a single function: `createForm`. Similar to the react context api this function returns an object that contains:

Form - Provider Component
Field - Consumer Component
FormComponent - Consumer Component
createField - a function that returns a named Field Consumer
createFormComponent - a function that returns a FormComponent Consumer

### Components

react-yafl uses the react context api behind the scenes to pass props between components. yafl only exports 3 Components that you'll need to get familiar with. Similar to the react context api these are either a Provider or a Consumer.

FormProvider: Provider - The FormProvider Component is used to wrap all Consumer components. It accepts the following props:

Field: Consumer Component - A Field Component is always associated with a paticular field on your form. A `<Field />` must be rendered _inside_ a Form provider. Each Field that

FormComponent: Consumer Component - A general purpose component which can be used to render general purpose elements of a form. The render prop function contains a subset of functionality of the Field Component. FormComponent should be used for general purpose functionality such as displaying validation, rendering a submit button.

### `<Form>` Config

```ts
interface FormProviderConfig<T extends object> {
  initialValue?: T
  defaultValue?: T
  onSubmit?: (formValue: Nullable<T>) => void
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
  validateOn?: ValidateOn<T, K>
  validators: Validator<T, K>[]
}
```

### `<Field>` Config

```ts
interface FieldConfig<T extends object, K extends keyof T = keyof T> {
  name: K
  defaultValue?: T[K]
  initialValue?: T[K]
  validators?: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>>
  [key: string]: any
}
```

### `<FormComponent>` Config

```ts
export interface ComponentConfig<T extends object, K extends keyof T = keyof T> {
  render?: (state: ComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<ComponentProps<T, K>>
  [key: string]: any
}
```

### `createField`

This is a convience function that can be used to create specialized named fields which are only able to modify a target field.

this function is used to create a name field component. This means that when you use the Field component created by this function on your form, it can only be used to change the value of the property specified by the first argument. The 2nd argument is optional and accepts a React component which will be rendered on your form.

### Why use `createField`?

There are a few reasons you might want to make use of it
  1. create a form field dedicated to a single property at the module level.
  2. this can lead to neater, more predictable code - at the cost of flexibility but this is usually okay since most forms are usually relatively static in nature.
  3. TypeScript users will have the full benefit of a fully typed field without the need to annotate the argument in your render props. See below.


### `createFormComponent`

Much like createField, `createFormComponent` creates a form component that can be rendered on your form.
