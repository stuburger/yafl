---
id: field
title: <Field />
sidebar_label: <Field />
---

While the [`useField()`](./use-field) hook will likely be your preferred way of handling input fields you also have the option of using the `<Field>` component if you prefer its ergonomics. The `<Field />` component is more or less equivalent to the Field components found in Formik or Redux-Form. Yafl uses a Fields location in the Form's component hierarchy to determine the shape of the resulting form value.

## Props

### `name`
**`name: string | number`**

Name your field! Providing a number usually indicates that this Field appears in an array.

### `validate`
**`validate?: ((value: T, formValue: F) => string | void) | (Array<(value: T, formValue: F) => string | void)>`**

Same as the [`validate`](./use-field#validate) option supplied to the `useField` hook: A validation function or array of validation functions used to validate a field. Should return a `string` as an error message if validation fails and `undefined` if validation passes.

### `render`
**`render?: (props: FieldProps<F, T>) => React.ReactNode`**

A render prop that accepts an object containing all the good stuff you'll need to render a your Field.

### `component`
**`component?: React.ComponentType<FieldProps<F, T>> | string`**

Specify a component to render. If a string is provided then Yafl will call React.createElement with the value provided. If a string is supplied, only the [`InputProps`](./use-field#inputprops) value will be supplied to `React.createElement`.

:::note
Any additional props that you specify on the `<Field>` will simply be forwarded to your component.
:::


## Render props 

The following is a list of props that are passed to the `render` prop or `component` prop of every Field. `T` and `F` correspond to the generic types for the Field and Form respectively.

| Prop | Description |
| - | - |
| `input: ` [`InputProps<T>`](./use-field#inputprops) | An object containing the core handlers and props for an input.<br />*Allows for easy use of the spread operator onto an `<input />`.* |
| `meta: ` [`FieldMeta<F, T>`](./use-field#fieldmeta) | An object containing any meta state related to the current field as well as some handy helper functions. |
| `...rest: BranchValues & CommonValues & AdditionFieldProps`  | An object containing merged values from `branchValues`, `commonValues` and any additional props supplied to the `<Field>`. |

## Example

```js title="/src/TextInput.js"
function TextInput({ input, meta, ...props }) {
  const { visited, submitCount, errors, isValid } = meta
  const showErrors = !isValid && (submitCount > 0 || visited)
  return (
    <>
      <label>{props.label}</label>
			<input type="text" {...input} />
      {showErrors && <span className="error">{errors[0]}</span>}
    </>
  )
}
```


```js title="src/LoginForm.js
import { Form, Field } from 'yafl'

const MyForm = (props) => (
  <Form 
    commonValues={{ color: 'green' }}
    branchValues={{ errorColor: { email: 'orange', password: 'red' } }}
  >
    {({ submit }) => (
      <form onSubmit={submit}>
        <Field
          name="email"
          validate={value => !value ? 'Required!' : undefined}
          label="Email" // additional props are forwarded to your component
          component={TextInput}
        />
        <Field
          name="password"
          label="Password"
          render={({ input, meta, ...rest }) => {
            console.log(rest)
            /**
             * {
             *   color: 'green',
             *   errorColor: 'red',
             *   label: 'Password'
             * } 
             */
            return <input {...input} />
          }}
        />
      </form>
    )}
  </Form>
)
```