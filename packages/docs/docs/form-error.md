---
id: form-error
title: <FormError />
sidebar_label: <FormError />
---

The `<FormError />` component can be 'rendered' to create errors on your Form. The concept of "rendering an Error" might require a small shift in the way you think about form validation. FormError components allow you to tell Yafl what errors are on your form. This has some interesting benefits, one of which is that a "rendered" error solves some of the edge cases around form validation - the most obvious example being that of async validation.

## Props

### `msg?: string`

The error message. If this FormError component is rendered with the same path as another FormError component the msg string will the pushed onto an array of error messages for the same path.

### `path?: Path`
Override the `path` for a FormError. By default the `path` is determined by what appears above this component in the Form component hierarchy.

>**Why you might need this: `path`**
>
> This is useful assign errors that belong to the domain of a Section, Repeat, at the Form level. Using the `path` prop is also for simply displaying general errors with a custom path or key.

## Example

Here's an example:

```jsx
// ValidatorExample.jsx
import { Form, Field, Validator } from 'yafl'

const TextInput = (props) => <input name={props.name} {...props.input}> 

const FormErrorExample = (props) => {

  function handleSubmit(formValue, { errors }) {
    console.log(formValue) // { password: 'admin', confirmPassword: '' }
    console.log(errors) // { issues: ['Oops, passwords do not match!', 'Nice try!'] }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {({ submit, formValue }) => (
        <form onSubmit={submit}>
          <Field name="email" component={TextInput} />
          <Field name="password" component={TextInput} />
          <Field name="confirmPassword" component={TextInput} />
          {formValue.password !== formValue.confirmPassword && (
            <FormError path="issues" msg="Oops, passwords do not match!" />
          )
          <FormError path="issues" msg={formValue.password === 'admin' ? 'Nice try!' : null } />
        </form>
      )}
    </Form>
  )
}
```

:::caution
Currently Yafl does not guarantee the order in which error messages will appear in a Field's `errors` array. However this is usually only important when you only want to display the first error message using something like `errors[0]`. Fortunately Yafl provides the syntax that allows you to stop validating Fields "on first failure". You can accomplish this by nesting a `<FormError />` as the child of another `<FormError />`. This works because the children of a FormError are only rendered when Validation passes for any particular `<FormError />`.
:::
