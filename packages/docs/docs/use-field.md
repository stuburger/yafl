---
id: use-field
title: useField()
sidebar_label: useField()
---

 The `useField` is the preferred way to get access to the values and metadata of a specific field. Yafl uses a field's location in the Form's component hierarchy to determine the shape of the resulting form value!

## useField API

## TypeScript

`type UseField = <T, F>(name: string | number, config: UseFieldConfig<F, T>) => [InputProps<T>, FieldMeta<F, T>]`

## Options

### `name`
**`name: string | number`**

Name your field! Providing a number usually indicates that this Field appears in an array.

### `validate`
**`validate?: ((value: T, formValue: F) => string | void) | (Array<(value: T, formValue: F) => string | void)>`**

A validation function or array of validation functions used to validate a field. Should return a `string` as an error message if validation fails and `undefined` if validation passes.

## Result

`useField<T, F>()` returns a tuple that contains [`InputProps`](#field-inputprops) and [`FieldMeta`](#fieldmeta) where `T` and `F` correspond to the generic types for the Field and Form respectively.

| Prop | Description |
| - | - |
| `input: ` [`InputProps<T>`](#field-inputprops) | An object containing the core handlers and props for an input.<br />*Allows for easy use of the spread operator onto an `<input />`.* |
| `meta: ` [`FieldMeta<F, T>`](#fieldmeta) | An object containing any meta state related to the current field as well as some handy helper functions. |

### `InputProps`

| Prop | Description |
| - | - |
| `name: string` | Forwarded from the `name` prop of this Field. |
| `value: T` | The current value of this Field. |
| `onBlur: (e: React.FocusEvent<any>) => void` | The onBlur handler for your input (DOM only).<br />*Useful if you need to keep track of which Fields have been visited.* |
| `onFocus: (e: React.FocusEvent<any>) => void` | The onFocus handler for your input (DOM only).<br />*Useful if you need to keep track of which field is currently active.* |
| `onChange: (e: React.ChangeEvent<any>) => void` | The onChange handler for your input (DOM only).<br />Sets the value of this Field. |

### `FieldMeta`

TypeScript: `FieldMeta<F, T>` where `F` and `T` correspond to the generic types for the current Field and Form respectively.

| Prop | Description |
| - | - |
| `path: string` | The path for this field. |
| `visited: boolean` | Indicates whether this Field has been visited.<br />*Automatically set to true on when input.onBlur() is called.* |
| `touched: boolean` | Indicates whether this Field has been touched.<br />*Automatically set to true the first time a Field's value is changed.* |
| `isDirty: boolean` | Indicates whether the `initialValue` for this Field is different from the current `formValue`. |
| `isActive: boolean` | Indicates whether this Field is currently in focus. |
| `isValid: boolean` | Indicates whether this Field is valid based on whether any errors have been returned from this fields `validate` prop. |
| `errors: string[]` |  An array containing any errors for this Field returned from the `validate` prop |
| `initialValue: T` | The value this Field was initialized with. |
| `setValue: (value: T, touch?: boolean) => void` | Sets the value for this Field.<br />Optionally specify if this Field should be touched when this function is called.<br />*If the `touch` parameter is not provided it defaults to `true`.* |
| `formValue: F` | The current value of the Form |
| `submitCount: number` | The number of times the Form has been submitted.  |
| `resetForm: () => void` |  Clears all Form state. `formValue` is reset to its initialValue. |
| `submit: () => void` |  Calls the onSubmit function supplied to the Form component  |
| `forgetState: () => void` |  Resets `submitCount`, `touched` and `visited` to their initial values. The `formValue` is not reset. |
| `setFormValue: (set: SetFormValueFunc<F>) => void` |  Sets the `formValue` imperatively. |
| `setFormVisited: (set: SetFormVisitedFunc<F>) => void` |  Sets the Form's `visited` state imperatively.<br />Accepts a callback with the Form's previous value. |
| `setFormTouched: (set: SetFormTouchedFunc<F>) => void` | Sets the Form's `touched` state imperatively.<br />Accepts a callback with the Form's previous visited state. |