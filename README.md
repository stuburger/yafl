# react-yafl

[![Build Status](https://travis-ci.org/stuburger/react-yafl.svg?branch=master)](https://travis-ci.org/stuburger/react-yafl)

YAFL - Yet Another Form Library

## Motivation

Development on yafl only started after the release of React 16.3 and uses the React Context API behind the scenes to pass props between components. It has drawn a lot of inspiration from redux-form and formik (both awesome projects!)

yafl's philosophy is to "keep it super simple". While it provides a lot of functionality out the box, it aims to keep it's API surface area as small as possible while still remaining flexible and easy to use.

## Why use YAFL?

- Use TypeScript to create strongly typed forms to give you peace of mind and a good nights sleep.
- Create multi-page forms without needing to use specialized components or a state management library like flux or redux.
- Create deeply nested forms or forms within forms.
- Structure your Components to match the shape of your data. This means no more accessing field values using string paths!
- Opt in features and functionality.
- Pluggable validation
- Fully featured and only weighing in at 7KB! Thats almost half the size of libraries offering similar functionality!

## Installation

_Not available on npm yet._

## Basic Usage

```js
// SimpleForm.js

import { createFormContext } from 'yafl'

const { Form, Field, Section, Gizmo, Repeat } = createFormContext({ firstName: '', latName: '' })

function TextInput(props) {
  return (
    <div>
      <label>{props.label}</label>
      <input {...props.input} />
    </div>
  )
}

function SubmitButton({ submit, buttonText }) {
  return <button onClick={submit}>{buttonText}</button>
}

class SimpleForm extends React.Component {
  handleSubmit = formValue => {
    console.log(formValue) // { firstName: 'John', lastName: 'Smith' }
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} initialValue={{ firstName: 'John', lastName: 'Smith' }}>
        <Field name="firstName" label="First Name" component={TextInput} />
				<Field name="lastName" label="Last Name" component={TextInput} />
				<Gizmo buttonText="Save" component={SubmitButton} />
      </Form>
    )
  }
}
```

## Top Level API

`react-yafl` only exports a single function:

### createFormContext()

```js
const { Form, Field, Section, Repeat, Gizmo } = createFormContext(defaultValue)
```


| Name                  | Type     | Description                                                                                                                                                                               |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Form`                | Component | The `Form` component is used to wrap all Consumer components                                                                                                                              |
| `Field`               | Component | A Field Component is always associated with a paticular field on your form. A `Field` must be rendered _inside_ (be a child of) a Form component. Every Field is treated as a property of the nearest Provider. (`Form` or `Section`)                                  |
| `Gizmo`       | Component | A general purpose component which can be used to render elements of a form that do not necessarily correspond to a field. For example displaying validation or rendering a submit button. |
| `Section`         | Component | The Section component is used to create nested Fields. Use a Section component to give your form depth.                                                                                     |
| `Repeat` | Component | Identical to the Section component except uses children as a function to which array helper functions are passed to make so called FieldArrays possible.                                                                                                                                                   |

*Note* that while `createFormContext()` has the same signature as React's `createContext()` there are some differences to be aware of:

1.  `createFormContext` returns 5 components.
2.  The optional `defaultValue` argument of `createFormContext` is not analogous the `defaultValue` that can be passed to `React.createContext`. The `defaultValue` passed to `createFormContext` refers to the value that the _form_ will default to if no initialValue is supplied. It is also the value that the form is set to when clearing the form. Also note that a default value can also be supplied as a prop. If both are supplied then the defaultValue prop takes precedence.
3. yafl does not allow Consumers to be rendered outside the Provider; doing so will result in an error being thrown.

### `<Form>`


| Prop                           | Type                                       | Description                                                                                               | defaultValue |
| ------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------ |
| `initialValue?`                | object                           | The initial value of your form.                                                                           | `{}`         |
| `defaultValue?`                | object                           | The default value of your form.                                                                           | `{}`         |
| `onSubmit?`                     | function                                   | The function which to be called when submitting your form                                                 | `noop`       |
| `loaded?`                      | boolean                                    | While this value is `false` all functionality is disabled                                                 | `true`       |
| `submitting?`                  | boolean                                    | A value indicating when the form is submitting. While this value is `true` all functionality is disabled. | `false`      |
| `allowReinitialize?`           | boolean                                    | Allow the form to reinitialize if and when 'initialValue' changes after the form has loaded               | `false`      |
| `rememberStateOnReinitialize?` | boolean                                    |                                                                                                           | `false`      |
| `validateOn?`                  | `'blur'| 'submit'| 'change' | function` | Validation timing for your form.                                                                          | `'blur'`     |
| `validate`                     | function                                   | The initial value of your form                                                                            | `noop`       |



### `<Field>` props

```ts
interface FieldConfig<T extends object, K extends keyof T = keyof T> {
  name: K
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
