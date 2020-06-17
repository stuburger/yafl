---
id: form
title: <Form />
sidebar_label: <Form />
---

The `<Form>` component contains all the state that tracks what's going on in your form. This state includes things like whether or not a field `isDirty` or has been `touched` and serves as a state Provider to other Yafl components. All other Yafl components *have* to be rendered inside the `<Form>`. For example, attempting to render a Field outside of a Form will cause an error to be thrown.

## Props

### `initialValue?: T`

The initial value of your Form. Once `initialValue` becomes a non-null object, your Form will initialize.

### `initialTouched?: BooleanTree<T>`

The initially "touched" fields of the form. Defaults to `{}`.

### `initialVisited?: BooleanTree<T>`

The initially "visited" fields of the form. Defaults to `{}`.

### `initialSubmitCount?: number`

The initial number of times the form has been submitted. Defaults to `0`.

### `disabled?: boolean` 

Whether or not the form is disabled. If the form is disabled common behaviors will not work. The functions will be disabled:

* submitting the form via `submit()`
* all functions that make changes the `fromValue`
* resetting the form via `resetForm()`
* forgetting state via `forgetState()`
* setting the `activeField`
* all functions that set `touched` or `visited` values

Defaults to `false`.

### `onSubmit?: (formValue: T) => boolean | void`

The function to call on form submission. By default the `formValue` argument will contain only fields that are actually mounted. To include all values in your form you can use the `submitUnregisteredValues` prop. If you return false from this function, `submitCount` will not be incremented. Returning nothing or a value of any other type will have no effect on the default behavior.

### `submitUnregisteredValues?: boolean`

Defaults to `false`.

Specify whether values that do not have a corresponding Field, Section or Repeat should be included in the formValue on submission of your form.

### `persistFieldState?: boolean`

Defaults to `false`.

Specify whether the `touched` and `visited` state of your `<Field />` components should persisted when they are unmounted.


:::note Why you might need this
You're not likely to use the `persistFieldState` prop very often, but it may come in handy when you are working with multi-route forms. By default, whenever a Field is unmounted, the Field will be removed from the Form component's internal state and along with it, any state that is associated with that Field. When creating a multi-page Form, for example, you'll probably want to keep this state around while visiting different routes. This is useful for any time when some of your Fields may not currently be mounted but you want their state to be "remembered" when they're remounted!
:::

### `rememberStateOnReinitialize?: boolean`

Defaults to `false`. 

Specifies whether or not to reset `touched`, `visited` and `submitCount` when the form reinitializes when it receives a *new* `initialValue`. 


### `onFormValueChange?: (prev: T, next: T) => void`

Will get called every time the `formValue` changes.

### `onStateChange?: (previousState: FormState<T>, nextState: FormState<T>) => void`

Will get called every time the Form state changes.

### `children: React.ReactNode | ((props: FormProps<T>) => React.ReactNode)`

The children of your Form. Can be a `ReactNode` or a function with a single parameter which contains props packed with goodies. 


### `commonValues?: ((state: { formValue: T }) => Record<string, any>) | Record<string, any>`

An object containing shared state or functionality you wish to deliver to your fields. This prop is really just a wrapper around a Provider value and accomplishes much the same thing.

```js
<Form commonValues={{ isSubmitting: true }}>
  ...
</Form>
```

Which can then extracted using the [`useDelivery` hook:](./usedelivery)

```js
const [, commonValues] = useDelivery('fullname')
console.log(commonValues)
/**
 * {
 *   isSubmitting: true
 * } 
 */
```

It is also possible to supply a function to `commonValues` that intercepts the fromValue so that you can deliver derived state to your fields:

```js
<Form 
  commonValues={({ formValue }) => ({
    saveProgress() {
      localStorage.setItem(JSON.stringify('progress', formValue))
    }
  })}
>
  ...
</Form>
```

### `branchValues?: ((state: { formValue: T }) => Record<string, any>) | Record<string, any>`