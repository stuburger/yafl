# react-yafl

[![Build Status](https://travis-ci.org/stuburger/react-yafl.svg?branch=master)](https://travis-ci.org/stuburger/react-yafl)

YAFL - Yet Another Form Library

## Motivation

Development on yafl only started after the release of React 16.3 and uses the React Context API behind the scenes to pass props between components. It has drawn a lot of inspiration from redux-form and formik (both awesome projects!)

yafl's philosophy is to "keep it super simple". While it provides a lot of functionality out the box, it aims to keep it's API surface area relatively small while still remaining flexible and easy to use.

## Installation

_Not available on npm yet._

## Basic Usage

```js
// SimpleForm.js

import { createFormContext } from 'yafl'

const { Form, Field, FormComponent } = createFormContext({ firstName: '', latName: '' })

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
      <Form onSubmit={this.handleSubmit} initialValue={{ firstName: 'John', lastName: 'Smith' }}>
        <Field name="firstName" label="First Name" render={props => <TextInput {...props} />} />
        <Field name="lastName" label="Last Name" render={props => <TextInput {...props} />} />
      </Form>
    )
  }
}
```

## Top Level API

`react-yafl` only exports a single function:

### createFormContext()

`createFormContext(defaultValue)` has the same signature as React's `createContext(defaultValue)`. However there are some differences to be aware of:

1.  While `React.createContext` only produces 2 components: a Consumer and a Provider, `createFormContext` returns 3 components (1 Provider and 2 Consumers) as well as 2 higher order components which can be used to create specialized Consumers.
2.  The optional defaultValue argument of `createFormContext` is not quite analogous the defaultValue that can be passed to `React.createContext`. The `defaultValue` passed to `createFormContext` refers to the value that the _form_ will default to if no initialValue is supplied. It is also the value that the form set to when clearing the form. Note that a default value can also be supplied as a prop which adds a bit more flexiblity. If both are supplied then the defaultValue prop takes precedence. _Note_ that react-yafl does not allow Consumers to be rendered outside the Provider; doing so will result in an error being thrown.

```js
const {
  Form,
  Field,
  FormComponent,
  createField,
  createFormComponent
} = createFormContext(defaultValue)
```

| Name                  | Type     | Description                                                                                                                                                                               |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Form`                | Provider | The `Form` component is used to wrap all Consumer components                                                                                                                              |
| `Field`               | Consumer | A Field Component is always associated with a paticular field on your form. A `Field` must be rendered _inside_ (be a child of) a Form provider component                                 |
| `FormComponent`       | Consumer | A general purpose component which can be used to render elements of a form that do not necessarily correspond to a field. For example displaying validation or rendering a submit button. |
| `createField`         | function | a function that returns a named `Field` Component                                                                                                                                         |
| `createFormComponent` | function | a function that returns a `FormComponent`                                                                                                                                                 |

### Components

### `<Form>` props

| Prop                           | Type                                       | Description                                                                                               | defaultValue |
| ------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------ |
| `initialValue?`                | T extends object                           | The initial value of your form.                                                                           | `{}`         |
| `defaultValue?`                | T extends object                           | The default value of your form.                                                                           | `{}`         |
| `onSubmit`                     | function                                   | The function which to be called when submitting your form                                                 | `noop`       |
| `loaded?`                      | boolean                                    | While this value is `false` all functionality is disabled                                                 | `true`       |
| `submitting?`                  | boolean                                    | A value indicating when the form is submitting. While this value is `true` all functionality is disabled. | `false`      |
| `allowReinitialize?`           | boolean                                    | Allow the form to reinitialize if and when 'initialValue' changes after the form has loaded               | `false`      |
| `rememberStateOnReinitialize?` | boolean                                    |                                                                                                           | `false`      |
| `validateOn?`                  | `'blur' | 'submit' | 'change'` \| function | Validation timing for your form.                                                                          | `'blur'`     |
| `validate`                     | function                                   | The initial value of your form                                                                            | `noop`       |

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

### `<Field>` props

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

1.  create a form field dedicated to a single property at the module level.
2.  this can lead to neater, more predictable code - at the cost of flexibility but this is usually okay since most forms are usually relatively static in nature.
3.  TypeScript users will have the full benefit of a fully typed field without the need to annotate the argument in your render props. See below.

### `createFormComponent`

Much like createField, `createFormComponent` creates a form component that can be rendered on your form.
