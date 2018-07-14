# Yet. Another. Form. Library.

[![Build Status](https://travis-ci.org/stuburger/yafl.svg?branch=master)](https://travis-ci.org/stuburger/yafl)
[![gzip size](http://img.badgesize.io/https://unpkg.com/yafl/lib/yafl.umd.production.js?compression=gzip)](https://unpkg.com/yafl/lib/yafl.umd.production.js)

YAFL - Yet Another Form Library

## Motivation

Development on Yafl only started after the release of React 16.3 and uses the React Context API behind the scenes to pass props between components. It has drawn a lot of inspiration from Redux-Form and Formik (both awesome projects!)

Yafl's philosophy is to "keep it super simple". While it provides a lot of functionality out the box, it aims to keep it's API surface area as small as possible while still remaining flexible and easy to use. At the start of Yafl's development, the decision was made to leave as much of the implementation of your form up to you, the developer. Yafl aims to provide the tools to build forms without caring too much about the specific use case.

## Why use YAFL?

- Use TypeScript with JSX generics to create strongly typed forms that give you peace of mind and a good nights sleep.
- Create multi-page forms without needing to use specialized components or a state management library like flux or redux.
- Structure your Components to match the shape of your data. This means no more accessing field values using string paths!
- Deeply nested forms.
- Create forms within forms.
- Flexible and fun.
- Render a Validator!

## Installation

```bash
npm i yafl
 ```

# API

## The **Form** Component

The Form component contains all the state that makes Yafl work. All other Yafl components *have* to be rendered as a child of a `<Form>`. Trying to render a Field outside of a Form, for example, will cause an error to be thrown.

> **Note:**
>
> If you are nesting forms this may cause some pretty strange behaviour. If you have a use case for nested forms you'll have to use Yafl's only non-component export: `createFormContext`.

### Configuration

#### `initialValue?: T`

The initial value of your Form. Once `initialValue` becomes a non-null object, your Form will initialize.


#### `defaultValue?: T`

The `defaultValue` is merged with the `formValue`. Currently this is done any time the `defaultValue` changes and not when your `formValue` changes.


#### `disableReinitialize?: boolean`

Default is `false`.

By default any time the `initialValue` prop changes, your Form will be reinitialized with the updated `initialValue`. To prevent this behaviour simply set `disableReinitialize` to `true`.

#### `commonFieldProps?: { [key: string]: any }`

This is a convenience prop that can be used to pass common values to all the components on your form. Yafl uses React's context API to make these values available to all Field components.

> **Why you might need this:**
> - For things like theming, etc
> - Passing any common values that you might need available on all of your Fields.

#### `componentTypes?: ComponentTypes<T>`

Another convenience prop which allows you provide component dictionary to match a Field's `component` prop with. For example:

```tsx
  <Form componentTypes={{ input: TextInput, number: NumberInput }}>
    ...
    {/* The default HTML input will now be overridden by my custom TextInput */}
    <Field name="firstName" component="input" />

    {/* Renders my custom NumberInput  */}
    <Field name="age" component="number" />
  </Form>
```

#### `onSubmit?: (formValue: T) => void`

The function to call on form submission. By default the `formValue` argument will contain only fields that are actually mounted. To include all values in your form you can use the `submitUnregisteredValues` prop.

#### `submitUnregisteredValues?: boolean`

Default is `false`.

Specify whether values that do not have a corresponding Field, Section or Repeat should be included on submission of your form.


> **Why you might need this:**
>
> For partially updating an object by submitting the unchanged values along with those that you have modified. This is frequently the cause when a PUT is done on some API endpoint that is expecting the full value to be sent down the wire.


#### `onStateChange?: (previousState: FormState<T>, nextState: FormState<T>) => void`

Will get called every time the Form state changes.

> **Note:**
>
> `onStateChange` is implemented inside the Form's `componentDidUpdate` function which means the same cautions apply when calling setState here as do in any component's `componentDidUpdate` function.



## The **Field** Component

Field components are the bread and butter of any form library and Yafl's Field's are no exception! The `<Field />` component is more or less equivalent to the Field components found in Formik or Redux-Form. The most important thing to note about the Field component is that you should never name your Field using a 'path' string. Yafl uses a Fields location in the Form's component hierarchy to determine the shape of the resulting form value.

### Configuration

#### `name: string | number`

Name your field! Providing a number usually indicates that this Field appears in an array.

#### `parse?: (value: any) => T`

Transforms a Field's value before setting it.

> **Why you might need this:**
>
> This prop is useful for when you need to convert a value from one type to another. A common use case is converting string values that have been typed into a text input into number types.

#### `render?: (props: FieldProps<F, T>) => React.ReactNode`

A render prop that accepts an object containing all the good stuff you'll need to render a your Field.

#### `component?: React.ComponentType<FieldProps<F, T>> | string`

Specify a component to render. If a string is provided then Yafl will attempt to match the string component to one provided in the componentTypes Form prop and if no match is found then it will call React.createElement with the value provided.

> **Note:**
>
> Any other props will be forwarded (along with any props specified by commonFieldProps on the Form component) to your component or render prop.


### Field Props

The following is a list of props that are passed to the `render` prop or `component` prop of every Field. `T` and `F` correspond to the generic types for the Field and Form respectively.

| Prop | Description |
| - | - |
| `input: ` [`InputProps<T>`](#field-inputprops) | An object containing the core handlers and props for an input.<br />*Allows for easy use of the spread operator.* |
| `path: string` | The path for this field. |
| `visited: boolean` | Indicates whether this Field has been visited.<br />*Automatically set to true on when input.onBlur() is called.* |
| `touched: boolean` | Indicates whether this Field has been touched.<br />*Automatically set to true the first time a Field's value is changed.* |
| `isDirty: boolean` | Indicates whether the `initialValue` for this Field is different from the current `formValue`. |
| `isActive: boolean` | Indicates whether this Field is currently in focus. |
| `isValid: boolean` | Indicates whether this Field is valid based on whether there are any Validators rendered that match the `path` of this Field. |
| `errors: string[]` |  An array containing any errors for this Field based on whether there are any Validators rendered that match the path of this Field. |
| `initialValue: T` | The value this Field was initialized with. |
| `defaultValue: T` | The default value of this Field. |
| `setValue: (value: T, touch?: boolean) => void` | Sets the value for this Field.<br />Optionally specify if this Field should be touched when this function is called.<br />*If the `touch` paramater is not provided it defaults to `true`.* |
| `formValue: F` | The current value of the Form |
| `submitCount: number` | The number of times the Form has been submitted.  |
| `resetForm: () => void` |  Clears all Form state. `formValue` is reset to its initialValue. |
| `submit: () => void` |  Calls the onSubmit function supplied to the Form component  |
| `forgetState: () => void` |  Resets `submitCount`, `touched` and `visited`. The `formValue` is not reset. |
| `clearForm: () => void` |  Clears all Form state. `formValue` is reset to its `defaultValue`. |
| `setFormValue: (set: SetFormValueFunc<F>) => void` |  Sets the `formValue` imperatively. |
| `setFormVisited: (set: SetFormVisitedFunc<F>) => void` |  Sets the Form's `visited` state imperatively.<br />Accepts a callback with the Form's previous value. |
| `setFormTouched: (set: SetFormTouchedFunc<F>) => void` | Sets the Form's `touched` state imperatively.<br />Accepts a callback with the Form's previous visited state. |

### Field InputProps

| Prop | Description |
| - | - |
| `name: string` | Forwarded from the `name` prop of this Field. |
| `value: T` | The current value of this Field. |
| `onBlur: (e: React.FocusEvent<any>) => void` | The onBlur handler for your input (DOM only).<br />*Useful if you need to keep track of which Fields have been visited.* |
| `onFocus: (e: React.FocusEvent<any>) => void` | The onFocus handler for your input (DOM only).<br />*Useful if you need to keep track of which field is currently active.* |
| `onChange: (e: React.ChangeEvent<any>) => void` | The onChange handler for your input (DOM only).<br />Sets the value of this Field. |


## The **Section** Component

Section components give your forms depth. The `name` prop of a `<Section />` will become the key of an object value in your Form. If a `<Field />` appears anywhere in a Section's children it will be a property of that Section. So, for example, the following piece of JSX

### Configuration

#### `name: Name`

Like a Field, a Section also requires a name prop! Corresponds to the name of the object this Section will create on the `formValue`.

#### `fallback?: T`

The `fallback` prop is similar to the `defaultValue` prop on the Form component, except that it never gets merged into the `formValue`.

> **Why you might need this:**
>
> A `fallback` is useful if the value for the Section is ever null or undefined. A fallback becomes especially handy if a Section or Field component is rendered within a `<Repeat />`. Since it doesn't often make much sense to assign anything other than an empty array[] as the default value for a list of things, we can specify a `fallback` to prevent warnings about uncontrolled inputs becoming controlled inputs.

#### `children: React.ReactNode`

This usually would not warrent an explanation, but it is important to note if any of the children of a Section (that occur anywhere in the hierarchy) that are of type Section, Field or Repeat will be correctly assigned a corresponding value on the object that this Section will produce.

### Example

```jsx
// Leaving out some required props for the sake of brevity
<Form>
  <Field name="fullName" />
  <Section name="contact">
    <Field name="tel" />
    <Section name="address" fallback={{ streetNo: '', streetName: '', city: ''  }}>
      <Field name="streetNo" />
      <Field name="streetName" />
      <Field name="city" />
    </Section>
  </Section>
</Form>

```
will produce a `formValue` object that looks like

```js
  {
    fullName: "",
    contact: {
      tel: "",
      address: {
        streetNo: "",
        streetName: "",
        city: ""
      }
    }
  }
```

Cool, huh!

## The **Repeat** Component

The Repeat component is conceptually similar to the Section component except that it can be used to create what other libraries call "FieldArrays". A `<Repeat />` uses a function as children and comes with a few handy helper methods. Here's an example using TypeScript

### Configuration

#### `name: Name`

The name of the array this Repeat creates.

#### `fallback?: T[]`

Serves the same purpose as a Section's fallback prop. This is usually more useful when dealing with Repeats since it will allow you to call value.map() without worrying about the value being null or undefined

#### `children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)`

The Repeat Component uses the function as a child pattern. The first argument is the value of this Repeat. The second argument is an object of array helper functions which provide some simple array manipulation functionality.

### Array Helpers

| Prop | Description |
| - | - |
| `push: (...items: T[]) => number` | Appends new elements to the array, and returns the new length of the array. |
| `pop: () => T \| undefined` | Removes the last element from the array and returns it. |
| `shift: () => T \| undefined` | Removes the first element from the array and returns it. |
| `unshift: (...items: T[]) => number` | Inserts new elements at the start of the array and returns the new length of the array. |
| `insert: (index: number, ...items: T[]) => number` | Inserts new elements into the array at the specified index and returns the new length of the array. |
| `swap: (index1: number, index2: number) => void` | Swaps two elements at the specified indices. |
| `remove: (index: number) => T \| undefined` | Removes an element from the array at the specified index. |


### Example

```tsx

interface Movie {
  title: string
  releaseDate: Date | null
  rating: number
}

<Form>
  {/* using JSX generic type arguments which were introduced in TypeScript 2.9 */}
  <Repeat<Movie> name="movies" fallback={[]}>
    {(arr, { push, remove, insert }) => {
      return (
        <>
          {arr.map((item, i) => (
            <Section<Movie> name={i}>
              <Field<string> name="title" />
              <Field<string> name="releaseDate" />
              <Field<number> name="rating" />
              <button onClick={() => remove(i)}>Remove</button>
            </Section>
          ))}
          {/* yes, TypeScript will catch any type errors when calling push()!*/}
          <button onClick={() => push({ title: "", releaseDate: null, rating: 5 })}>Add</button>
        </>
      )
    }}
  </Repeat>
</Form>
```

Will produce...

```js
  {
    movies: [
      {
        title: "",
        releaseDate: null,
        rating: 5
      },
      ...
    ]
  }
```

## The **Gizmo** Component

Gizmo's are general purpose components that can be used to render anything that isn't a field - a submit button is a good example, but this could be anything. Another possible use case for the `<Gizmo />` component is to create your own higher order components! Since a Gizmo is a pure Consumer (which means it doesn't take a `name` prop which forks the Form state) you can render Fields, Sections and Repeats within a Gizmo so it becomes simple to decorate any component of your choice with any or all the functions that you might need. Lets take a look:

### Configuration

#### `render?: (props: GizmoProps<F>) => React.ReactNode`

A render prop function which recieves all the good stuff you might need in the way of Form functions and state.

#### `component?: React.ComponentType<GizmoProps<F>>`

Same as above but uses React.createElement with the component you give it.

> **Note:**
>
> Any other props will be forwarded to your Gizmo's `component` or `render` prop.

### Example

```jsx
// withForm.js
import { Gizmo, Form } from 'yafl'

export default (Comp) => ({ initialValue, onSubmit, /* other Form props */ children, ...props }) => (
  <Form
    onSubmit={onSubmit}
    initialValue={initialValue}
  >
    <Gizmo render={utils => <Comp {...utils} {...props}>{children}</Comp>} />
  </Form>
)
```

```jsx
// SimpleForm.js
import withForm from './withForm'

const MyForm = (props) => (
  <React.Fragment>
    <Field name="email" render={({ input }) => <input {...input} />} />
    <Field name="password" render={({ input }) => <input {...input} />} />
    <button disabled={!props.formIsValid} onClick={props.submit}>Login</button>
  </React.Fragment>
)

export default withForm(MyForm)
```


## The **Validator** Component

The `<Validator />` component can be 'rendered' to create errors on your Form. The concept of "rendering a validator" might require a small shift in the way you think about form validation since other form libraries usually do validation through the use of a `validate` prop. With Yafl however, you validate your form by simply rendering a Validator. This has some interesting benefits, one of which is that a "rendered" validator solves some of the edge cases around form validation - the most obvious example being that of async validation.

### Configuration

#### `invalid?: boolean`

Defaults to false. When the invalid prop becomes true the Validator will set an error for the corresponding path.

> **Note:**
>
> If the `invalid` prop is not provided then an error will only be set if and when the `msg` prop is passed a string value.

#### `msg: string`

The error message. If this Validator component is rendered with the same path as another Validator component the msg string will the pushed onto an array of error messages for the same path.

#### `path?: Path`
Override the `path` for a Validator. By default the `path` is determined by what appears above this component in the Form component hierarchy.

>**Why you might need this:**
>
> This is useful assign errors that belong to the domain of a Section, Repeat, at the Form level. Using the `path` prop is also for simply displaying general errors with a custom path or key.

### Example 

Here's an example:

```jsx
// ValidatorExample.js
import { Form, Field, Validator } from 'yafl'

<Form>
  <Field
    name="email"
    label="Email" // unrecognized props are forwarded to your component
    component={TextInput}
  />
  <Field
    name="password"
    label="Password"
    minLength={6}
    component={TextInput}
  />
  <Field
    name="confirmPassword"
    label="Confirm Password"
    component={TextInput}
  />
  <Gizmo
    render={({ formValue }) => formValue.password !== formValue.confirmPassword && (
      <Validator path="issues" msg="Oops, passwords do not match!" />
    )}
  />
</Form>

function TextInput({ input, field, minLength, label }) {
  return (
    <Fragment>
      <label>{label}</label>
      <input type="text" {...input} />
      <IsRequired message="This field is required" {...field} />
      <Length message="Too short!" min={minLength} {...field}  />
    </Fragment>
  )
}

function IsRequired ({ value, touched, visited, validateOn = 'blur', message }) {
  return <Validator invalid={!value} msg={message} />
}

function Length ({ value, touched, visited, validateOn = 'change', min, max, message }) {
  return (
    <Validator
      msg={message}
      invalid={value.length < min) || (value.length > max}
    />
  )
}

```

> **Note:**
>
> Currently Yafl does not guarantee the order in which error messages will appear in a Field's `errors` array. However this is usually only important when you only want to display the first error message using something like `errors[0]`. Fortunately Yafl provides the syntax that allows you to stop validating Fields "on first failure". You can accomplish this by nesting a `<Validator />` as the child of another `<Validator />`. This works because the children of a Validator are only rendered when Validation passes for any particular `<Validator />`.

### How to stop validating a Field on first failure

Say you have a custom `<TextInput />` component that accepts a `validate` prop which is a simple array of functions. Let's take a look at how this component might be implemented:

```jsx
const TextInput = ({ visited, submitCount, errors, isValid, validators, input }) => {
  const showErrors = !isValid && (submitCount > 0 || visited)
  return (
    <div className="form-input">
      <input {...input} />
      {/* see note below */ }
      {showErrors && validators.reduceRight((ret, validate) => {
        return (
          <Validator msg={validate(input.value)}>{ret}</Validator>
        )
      }, null)}
    </div>
  )
}
```

> **Note:**
>
> You might be wondering about the use of `reduceRight` in the code snippet above. The simple reason I'm using `reduceRight` instead of `reduce` is because validators would be passed to our hypothetical component in a left to right fashion in the same order that we'd like to see errors displayed which means we want the right most validator (the one last in the array) to be the inner most child.

Our simple validators would look something like this:

```ts
const required = (value: any): string | undefined => {
  if (value) {
    return 'This field is required'
  }
}

const minLength = (length: number) => (value: string) : string | undefined => {
  if (value.length < length) {
    return `This field should be at least ${length} characters.`
  }
}
```

Finally, we can put this all together and use our `TextInput` component:

```jsx
render() {
  return (
    <Form>
      ...
      <Field
        name="subject"
        component={TextInput}
        validators={[required, minLength(3)]}
      />
    </Form>
  )
}
```

## Top Level API

**Yafl** only exports a single function:

#### `createFormContext` 

`createFormContext` returns all of the same components as those exported by Yafl.

```js
const { Form, Field, Section, Repeat, Gizmo, Validator } = createFormContext()
```

The `createFormContext` function creates an independent form context that will only "listen" to changes made with in components that belong to that context.

> **Why you might need this:**
>
> There are a few edge cases where you might find this handy. One might for example, want to nest one Form within another. However, since Yafl uses React's context API to pass props from Provider to Consumer, rendering a Form inside another Form will make it impossible to access the outter Form values from anywhere inside the inner Form.

### Example

```js
import { createFormContext } from 'yafl'

const contextA = createFormContext()
const contextB = createFormContext()

const FormA = contextA.Form
const FieldA = contextA.Field
const SectionA = contextA.Section

const FormB = contextB.Form
const FieldB = contextB.Field
const SectionB = contextB.Section

const NestedFormExample = (props) => {
  return (
    <FormA>
      <SectionA name="sectionA1">
        <FieldA name="formAField1" />
        <FormB>
          <SectionA name="sectionA2">
            <FieldA
              name="formAField2"
              render={props => {
                // Sweet! I belong to Form A even though I am rendered inside of Form B!
                return null
              }}
            />
            <FieldB
              name="formAField1"
              render={props => {
                // Sweet! I belong to Form B even though I am rendered inside of Section A!
                return null
            />
          </SectionA>
        </FormB>
      </SectionA>
    </FormA>
  )
}

```