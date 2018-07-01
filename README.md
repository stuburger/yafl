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
- Fully featured and only weighing in at 8KB! Thats almost half the size of libraries offering similar functionality!

## Installation

_Not available on npm yet._

# API

##The **Form** Component

The `<Form />` component contains all the state that makes yafl work and is pretty important. All other yafl components *have* to be rendered as a child of a Form. Trying to render a Field outside of a Form will throw an error.

Note: if you are nesting forms this may cause some pretty strange behaviour. If you have a use case for nested forms you'll have to use yafl's only non-component export `createFormContext`. To learn more about this "strange behaviour" see the "*how it works section*" at the end of this read me.

### Configuration Props

```ts
interface FormConfig<T extends object> {
  // The initial value of your form. Once this value becomes truthy you form will initialize.
  initialValue?: T
  // The defaultValue is merged with initialValue on initialization to replace any missing values.
  defaultValue?: T
  // When true, any time initialValue changes, your form value will update the value of your form.
  allowReinitialize?: boolean
  // Should your form remember what fields have been touched and/or visited and if the submitCount should be reset to 0.
  rememberStateOnReinitialize?: boolean
  // For convenience. These props will become available to all Field components.
  commonFieldProps?: { [key: string]: any }
  // For convenience. Allows you so use the type prop on Field components instead of the render prope or the component prop.
  componentTypes?: ComponentTypes<T>
  // The function to call on form submission
  onSubmit?: (formValue: T) => void
}
```

## The **Field** Component

Field components are the bread and butter of any form library and yafl's Field's are no exception! The `<Field />` component is more or less equivalent to the Field components found in Formik or Redux-Form. The most important thing to note is about the Field component is that you should never name your Field using a 'path' string. Yafl uses the components location in the a Form's component hierarchy to determine where.

```ts
interface FieldConfig<F extends object, T = any> {
  // Name your field! Providing a number usually indicates that this field appears in an array.
  name: string | number
  // Similar to the type attribute of an HTML input, however this prop is used as a key to match against the object supplied to the componentTypes prop on a Form component.
  type?: string
  // A render prop that accepts an object containing all the good stuff you'll need to render a your Field.
  render?: (props: FieldProps<F, T>) => React.ReactNode
  // Specify a component to render
  component?: React.ComponentType<FieldProps<F, T>>
  // Any other props will be forwarded (along with any props specified by commonFieldProps on the Form component) to your component or render prop.
  [key: string]: any
}
```

## Top Level API

`react-yafl` only exports a single function:

### createFormContext()

```js
const { Form, Field, Section, Repeat, Gizmo } = createFormContext(defaultValue)
```


| Name      | Type     | Description                                                                                                                                                        |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Form`                | Component | The `Form` component is used to wrap all Consumer components                                                                                                                              |
| `Field`               | Component | A Field Component is always associated with a paticular field on your form. A `Field` must be rendered _inside_ (be a child of) a Form component. Every Field is treated as a property of the nearest Provider. (`Form` or `Section`)                                  |
| `Gizmo`       | Component | A general purpose component which can be used to render elements of a form that do not necessarily correspond to a field. For example displaying validation or rendering a submit button. |
| `Section`         | Component | The Section component is used to create nested Fields. Use a Section component to give your form depth.                                                                                     |
| `Repeat` | Component | Identical to the Section component except uses children as a function to which array helper functions are passed to make so called FieldArrays possible.                                                                                                                                                   |
|
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
| `disabled?`                      | boolean                                    | While this value is `true` all functionality is disabled                                                 | `false`       |
| `allowReinitialize?`           | boolean                                    | Allow the form to reinitialize if and when 'initialValue' changes              | `false`      |
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
