---
id: use-form
title: useForm() 
sidebar_label: useForm()
---

The `useForm()` hook allows you to access Yafl form state right inside your component without having to use render props. This is a massive convenience for some people as it reduces component nesting and some awkward component structuring. 

## TypeScript

`type UseForm = <F extends object>(config: UseFormConfig<F>) => YaflBaseContext<F>`

## Examples

### Using context

There is a small caveat to using this hook that you should be aware of - specifically if you want to make use of Yafl context consumers: In these cases you should use `useForm()` in conjunction with a `<YaflProvider>` which does require a teeny tiny bit of wiring. As you can see in the example below we have to pass the result of `useForm` to the `value` prop on `<YaflProvider>`. This is what the `<Form>` component does under the hood and it's what allows for communication with form consumers such as the `<Field>` component. While it is an extra thing to remember, we think the ergonomics of having a `useForm()` hook totally compensates for this.

```tsx title="src/UseFormExample.tsx"
import React, { useState } from 'react'
import { useForm, YaflProvider, Section, Field } from 'yafl'

function validateForm(formValue) {
  const errors = { contact: { tel: [] } }

  if(!formValue.contact.tel) {
    errors.contact.tel.push('A telephone number is required!')
  }

  return errors
}

function UseFormExample (props) {
  const { initialValue, save } = props
  const [submitting, setSubmitting] = useState(false)

  const yafl = useForm({
    initialValue,
    onSubmit: async (formValue) => {
      if (submitting) return
      setSubmitting(true)
      await save(formValue)
      setSubmitting(false)
    }
  })

  // yet another way you might to do form-level validation
  const formErrors = validateForm(yafl.formValue)

  console.log(formErrors)

  return (
    <YaflProvider value={yafl}>
      <form onSubmit={yafl.submit}>
        <Section name="contact">
          <Field name="tel" />
        </Section>
        <button type="submit">Submit</button>
      </form>
    </YaflProvider>
  )
}
```

### Without using context

If you **don't** want to use React context you can simply write your own input change handler like this:

```tsx title="src/CustomChangeHandler.tsx"
import React, { useState } from 'react'
import { useForm, YaflProvider, Section, Field } from 'yafl'

function CustomChangeHandler(props) {
  const { initialValue } = props

  const yafl = useForm({
    initialValue,
    onSubmit: (formValue) => {
      ...
    }
  })

  function handleChange(e) {
    yafl.setValue(e.target.name, e.target.value);
  }

  return (
    <form onSubmit={yafl.submit}>
      <input name="contact.tel" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Options

The configuration options for the `useForm()` hook are mostly identical to the `<Form>` component props, minus `commonValues` and `branchValues`. Here they are again for convenience:

## Props

### `initialValue`
**`initialValue?: T`**

The initial value of your Form. Whenever `initialValue` changes your form will initialize/reinitialize Comparison is done using deep equal.

### `initialTouched`
**`initialTouched?: BooleanTree<T>`**

The initially "touched" fields of the form. Defaults to `{}`.

### `initialVisited`
**`initialVisited?: BooleanTree<T>`**

The initially "visited" fields of the form. Defaults to `{}`.

### `initialSubmitCount`
**`initialSubmitCount?: number`**

The initial number of times the form has been submitted. Defaults to `0`.

### `disabled`
**`disabled?: boolean`**

Whether or not the form is disabled. If the form is disabled common behaviors will not work. The functions will be disabled:

* submitting the form via `submit()`
* all functions that make changes the `fromValue`
* resetting the form via `resetForm()`
* forgetting state via `forgetState()`
* setting the `activeField`
* all functions that set `touched` or `visited` values

Defaults to `false`.

### `onSubmit`
**`onSubmit?: (formValue: T) => boolean | void`**

The function to call on form submission. By default the `formValue` argument will contain only fields that are actually mounted. To include all values in your form you can use the `submitUnregisteredValues` prop. If you return false from this function, `submitCount` will not be incremented. Returning nothing or a value of any other type will have no effect on the default behavior.

### `submitUnregisteredValues`
**`submitUnregisteredValues?: boolean`**

Defaults to `false`.

Specify whether values that do not have a corresponding Field, Section or Repeat should be included in the formValue on submission of your form.

### `persistFieldState`
**`persistFieldState?: boolean`**

Defaults to `false`.

Specify whether the `touched` and `visited` state of your `<Field />` components should persisted when they are unmounted.


:::note Why you might need this
You're not likely to use the `persistFieldState` prop very often, but it may come in handy when you are working with multi-route forms. By default, whenever a Field is unmounted, the Field will be removed from the Form component's internal state and along with it, any state that is associated with that Field. When creating a multi-page Form, for example, you'll probably want to keep this state around while visiting different routes. This is useful for any time when some of your Fields may not currently be mounted but you want their state to be "remembered" when they're remounted!
:::

### `rememberStateOnReinitialize`
**`rememberStateOnReinitialize?: boolean`**

Defaults to `false`. 

Specifies whether or not to reset `touched`, `visited` and `submitCount` when the form reinitializes when it receives a *new* `initialValue`. 


### `onFormValueChange`
**`onFormValueChange?: (prev: T, next: T) => void`**

Will get called every time the `formValue` changes.

### `onStateChange`
**`onStateChange?: (previousState: FormState<T>, nextState: FormState<T>) => void`**

Will get called every time the Form state changes.


## Result

The result of a call to the `useForm()` hook returns a number of useful functions and data. However, some of these you've unlikely to use except in advanced use cases but are returned from this hook as they used in other form consumers such as `Field`, `Section` and `Repeat`. They are included here for completeness and see values labeled with a *****.

### TypeScript

| Prop | Description |
| - | - |
| `formValue: F` | The current value of the Form |
| `initialValue: T` | The initialValue of the form and equal to the `initialValue` option supplied to `useForm()`. |
| `formIsValid: boolean` | Indicates whether the form in its entirety is valid based on whether there are any errors present. |
| `errors: FormErrors<F>` |  An object representing the errors of the form. Populated by the `validate` prop on each `Field` or `useField`. |
| `errorCount` | A number representing the total count of errors on the form. Every validator function on each field that returns an error string will increment this number by 1. |
| `visited: boolean` | An object representing the fields of the form which have been visited.* |
| `touched: boolean` | An object representing the fields of the form which have been touched. |
| `formIsDirty: boolean` | Indicates whether the `initialValue` for the form is different from the current `formValue`. *Uses deep comparison.* |
| `activeField: Nullable<string>` | The currently active field. Set when `input.onBlur` is supplied to an `<input>`. |
| `submit: () => void` |  Calls the onSubmit function supplied to `useForm()`.  |
| `submitCount: number` | The number of times the form has been submitted.  |
| `resetForm: () => void` |  Clears all form state. `formValue` is reset to its initialValue. |
| `forgetState: () => void` |  Resets `submitCount`, `touched` and `visited` to their initial values.  The `formValue` is not reset. |
| `setFormValue: (set: SetFormValueFunc<F>) => void` |  Sets the `formValue` imperatively. |
| `setFormVisited: (set: SetFormVisitedFunc<F>) => void` |  Sets the Form's `visited` state imperatively.<br />Accepts a callback with the Form's previous value. |
| `setFormTouched: (set: SetFormTouchedFunc<F>) => void` | Sets the Form's `touched` state imperatively.<br />Accepts a callback with the Form's previous visited state. |
| `setValue: (path: string, val: any, touch = true) => void` | Sets the value for a field specified by `path`.<br />Optionally specify if this Field should be touched when this function is called.<br />*If the `touch` parameter is not provided it defaults to `true`.* |
| `touchField: (path: string, touch: boolean) => void` | Sets the touched value for a field specified by `path`. |
| `visitField: (path: string, visit: boolean) => void` | Sets the visited value for a field specified by `path`. |
|**Advanced**|
|  `value: F` | A copy of `formValue`. This value is split at each branching component until it arrives at its destination field.  |
| `setActiveField: (path: Nullable<string>) => void` | Sets the currently active field specified `path`. |
| `registerErrors(path: string, errors: string[]) => void` | Sets errors for a field specified by `path`. *The array of errors should be a list of unique strings*  |
| `unregisterErrors(path: string, errors: string[]) => void` | Unsets errors for a field specified by `path`. Errors contained within the list of `errors` will be removed.  |
| `registerField(path: string) => void` | Registers a field on the form. You're fairly unlikely to use this as it simply tells Yafl at a field exists - use `submitUnregisteredValues` to submit the `formValue` as is instead of the default behavior which is to filter out field values that are not registered. `useField` and `<Field>` both call `registerField` on mount. |
| `unregisterField(path: string) => void` | Unregisters a field from the form. Called by `useField` and `<Field>` on unmount. |

