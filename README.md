# Yet. Another. Form. Library.

[![Build Status](https://travis-ci.org/stuburger/yafl.svg?branch=master)](https://travis-ci.org/stuburger/yafl)
[![gzip size](http://img.badgesize.io/https://unpkg.com/yafl@0.0.7/lib/yafl.umd.production.js?compression=gzip)](https://unpkg.com/yafl@0.0.7/lib/yafl.umd.production.js)

YAFL - Fun, flexible forms in React.

## Installation

```bash
npm i yafl
 ```

## TL;DR

Can't wait to get coding? Here's a quick example to give you the basics. Or you can check out the demo on [CodeSandbox](https://codesandbox.io/s/nn657lqpv4).

```jsx
import React, { Component } from 'react'
import { Form, Field, Section } from 'yafl'

class ExampleForm extends Component {
  state = { formData: null, fetching: false, submitting: false }

  componentDidMount() {
    this.initialize()
  }

  initialize = () => {
    const { fetchRemoteData, id } = this.props
    this.setState({ fetching: true })
    fetchRemoteData(id).then(this.setFormData)
  }

  setFormData = formData => {
    this.setState(() => ({ formData, fetching: false }))
  }

  onSubmit = formValue => {
    const { update, id } = this.props
    this.setState({ submitting: true })
    update(id, formValue).then(this.setFormData)
    console.log(formValue)
    // {
    //   fullName: '',
    //   age: 34,
    //   contact: {
    //     tel: '',
    //     email: '',
    //     address: {
    //       streetNo: '',
    //       streetName: '',
    //       postalCode: ''
    //     }
    //   }
    // }
  }

  render() {
    const { formData, submitting } = this.state
    return (
      <Form initialValue={formData} onSubmit={this.onSubmit}>
        {yaflProps => (
          <form onSubmit={yaflProps.submit}>
            <Field
              name="fullName"
              render={(input, errors) => (
                <div className="input-group">
                  <input {...props.input} type="text" />
                  <Validator invalid={!input.value} msg="Required!" />
                  {!props.isValid && <span>{errors[0]}</span>}
                </div>
              )}
            />
            <Field name="age" type="number" component="input" />
            <Section name="contact">
              <Field name="tel" component="input" />
              <Field name="email" component="input" />
              <Section name="address">
                <Field name="streetNo" component="input" />
                <Field name="streetName" component="input" />
                <Field name="postalCode" component="input" />
              </Section>
            </Section>
            <button type="submit" disabled={submitting}>
              Submit Me!
            </button>
          </form>
        )}
      </Form>
    )
  }
}

```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [About this library](#about-this-library)
  - [Motivation](#motivation)
  - [Philosophy](#philosophy)
  - [Why use YAFL?](#why-use-yafl)
- [Demos](#demos)
- [API](#api)
  - [`<Form />`](#form-)
    - [Configuration](#configuration)
      - [`initialValue?: T`](#initialvalue-t)
      - [`defaultValue?: T`](#defaultvalue-t)
      - [`disableReinitialize?: boolean`](#disablereinitialize-boolean)
      - [`components?: ComponentTypes<T>`](#components-componenttypest)
      - [`onSubmit?: (formValue: T) => boolean | void`](#onsubmit-formvalue-t--boolean--void)
      - [`submitUnregisteredValues?: boolean`](#submitunregisteredvalues-boolean)
      - [`persistFieldState?: boolean`](#persistfieldstate-boolean)
      - [`onFormValueChange?: (prev: T, next: T) => void`](#onformvaluechange-prev-t-next-t--void)
      - [`onStateChange?: (previousState: FormState<T>, nextState: FormState<T>) => void`](#onstatechange-previousstate-formstatet-nextstate-formstatet--void)
      - [`children: React.ReactNode | ((props: FormProps<T>) => React.ReactNode)`](#children-reactreactnode--props-formpropst--reactreactnode)
  - [`<Field />`](#field-)
    - [Configuration](#configuration-1)
      - [`name: string | number`](#name-string--number)
      - [`parse?: (value: any) => T`](#parse-value-any--t)
      - [`render?: (props: FieldProps<F, T>) => React.ReactNode`](#render-props-fieldpropsf-t--reactreactnode)
      - [`component?: React.ComponentType<FieldProps<F, T>> | string`](#component-reactcomponenttypefieldpropsf-t--string)
    - [Field Props](#field-props)
      - [Field InputProps](#field-inputprops)
      - [FieldMeta](#fieldmeta)
  - [`<Section />`](#section-)
    - [Configuration](#configuration-2)
      - [`name: Name`](#name-name)
      - [`fallback?: T`](#fallback-t)
      - [`children: React.ReactNode`](#children-reactreactnode)
    - [Section Helpers](#section-helpers)
    - [Example](#example)
  - [`<Repeat />`](#repeat-)
    - [Configuration](#configuration-3)
      - [`name: Name`](#name-name-1)
      - [`fallback?: T[]`](#fallback-t)
      - [`children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)`](#children-value-t-utils-arrayhelperst--reactreactnode)
    - [Array Helpers](#array-helpers)
    - [Example](#example-1)
  - [`<ForwardProps />`](#forwardprops-)
    - [Configuration](#configuration-4)
      - [`mode?: 'default' | 'branch'`](#mode-default--branch)
  - [`<Validator />`](#validator-)
    - [Configuration](#configuration-5)
      - [`invalid?: boolean`](#invalid-boolean)
      - [`msg: string`](#msg-string)
      - [`path?: Path`](#path-path)
    - [Example](#example-2)
    - [How to stop validating a Field on first failure](#how-to-stop-validating-a-field-on-first-failure)
  - [`connect<T>(Component: React.ComponentType<T>)`](#connecttcomponent-reactcomponenttypet)
    - [Example](#example-3)
- [Managing your own state](#managing-your-own-state)
- [Top Level API](#top-level-api)
      - [`createFormContext`](#createformcontext)
    - [Example](#example-4)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## About this library

### Motivation

Development on Yafl only started after the release of React 16.3 and uses the React Context API behind the scenes to pass props between components. It has drawn a lot of inspiration from Redux-Form and Formik (both awesome projects!)

I didn't build Yafl because I saw the need for yet another form library. Instead, Yafl started out as an idea that has evolved throughout development. It has gone through many iterations (I dare you to go through the commit history) and on a number of occations I almost had to start from the *beginning* when I realized that the current code structure didn't accommodate a specific use case. Validation in particular was handled in multiple wildly different ways before I stumbled on - for better or worse - the idea of *rendering an error*. So there you have it, the motivation for the existence of this library was pretty much of the "eh, why not" variety as opposed to the often touted "I saw a need for it" variety. That said however, I've found Yafl extremely fun and flexible to use even more so, I dare say, than the alternatives.

### Philosophy

Yafl's philosophy is to "keep it super simple". While it provides a lot of functionality out of the box, it aims to keep it's API surface area as small as possible while still remaining flexible and easy to use. At the start of Yafl's development, the decision was made to leave as much of the implementation of your form up to you, the developer. Yafl aims to provide the tools to build forms without caring too much about the specific use case. 

### Why use YAFL?

- Use TypeScript with JSX generics to create strongly typed forms that give you peace of mind and a good nights sleep. 😴
- Create multi-page forms without needing to use specialized components or a state management library like flux or redux. 😮
- Structure your components to match the shape of your data. This means no more accessing field values using string paths! 🤯
- Deeply nested forms and forms within forms! 🎁
- Render a Validator! 😱
- Opt out of using Yafl's internal implementation by keeping track of your own form state and only use Yafl's context as a means to intelligently distribute state to your Fields! 🚀
- Easily use third pary validation libraries like Yup - it just works!
- Flexible. 💪
- Fun. 😻

## Demos

- [Welcome to Yet Another For Library.](https://codesandbox.io/s/nn657lqpv4) A small working Form app with basic create and update functionality showing some basic use cases.
- [Yup and Yafl.](https://codesandbox.io/s/xrmv9xn684) An example of how one might easily integrate third party validation into your app. In this case I'm using [Yup](https://github.com/jquense/yup) but you could swap it out for anything you like!

## API

### `<Form />`

The `<Form />` component contains all the state that tracks what's going on in your form. This state includes things like whether or not a field `isDirty` or has been `visited`. It also keeps track of what Fields are mounted at any point in time which is useful for determining what values should be submitted collected for submission. All other Yafl components *have* to be rendered inside the Form. Trying to render a Field outside of a Form, for example, will cause an error to be thrown.

#### Configuration

##### `initialValue?: T`

The initial value of your Form. Once `initialValue` becomes a non-null object, your Form will initialize.


##### `defaultValue?: T`

The `defaultValue` is merged with the `formValue`. Currently this is done any time the `defaultValue` changes and not when your `formValue` changes.


##### `disableReinitialize?: boolean`

Default is `false`.

By default any time the `initialValue` prop changes, your Form will be reinitialized with the updated `initialValue`. To prevent this behaviour simply set `disableReinitialize` to `true`.

##### `components?: ComponentTypes<T>`

Another convenience prop which allows you provide component dictionary to match a Field's `component` prop with. For example:

```tsx
  <Form components={{ input: TextInput, number: NumberInput }}>
    ...
    {/* The default HTML input will now be overridden by my custom TextInput */}
    <Field name="firstName" component="input" />

    {/* Renders my custom NumberInput  */}
    <Field name="age" component="number" />
  </Form>
```

##### `onSubmit?: (formValue: T) => boolean | void`

The function to call on form submission. By default the `formValue` argument will contain only fields that are actually mounted. To include all values in your form you can use the `submitUnregisteredValues` prop. If you return false from this function, `submitCount` will not be incremented. Returning nothing or a value of any other type will have no effect on the default behaviour.

##### `submitUnregisteredValues?: boolean`

Default is `false`.

Specify whether values that do not have a corresponding Field, Section or Repeat should be included on submission of your form.


> **Why you might need this: `submitUnregisteredValues`**
>
> For partially updating an object by submitting the unchanged values along with those that you have modified. This is frequently the case when a PUT is done on some API endpoint that is expecting the full value to be sent down the wire.

##### `persistFieldState?: boolean`

Default is `false`.

Specify whether the `touched` and `visited` state of your `<Field />` components should persisted when they are unmounted.


> **Why you might need this: `persistFieldState`**
>
> You're not likely to use the `persistFieldState` prop very often, but it may come in handy when you are working with multi-route forms. By default, whenever a Field's `componentWillUnmount` function is called, the Field will be removed from the Form component's internal state and along with it, any state that is associated with that Field. When you're creating a multi-page Form, you'll probably want to keep this state around while visiting different routes, or areas of your Form where some of your Fields may not currently be mounted!


##### `onFormValueChange?: (prev: T, next: T) => void`

Will get called every time the `formValue` changes.

##### `onStateChange?: (previousState: FormState<T>, nextState: FormState<T>) => void`

Will get called every time the Form state changes.

> **Note:**
>
> `onStateChange` and `onFormValueChange` are implemented inside the Form's `componentDidUpdate` function which means the same cautions apply when calling `setState` in either of these function as do in any component's `componentDidUpdate` function.

##### `children: React.ReactNode | ((props: FormProps<T>) => React.ReactNode)`

The children of your Form. Can be a `ReactNode` or a function with a single parameter which contains props packed with goodies.


### `<Field />`

Field components are the bread and butter of any form library and Yafl's Field's are no exception! The `<Field />` component is more or less equivalent to the Field components found in Formik or Redux-Form. The most important thing to note about the Field component is that you should never name your Field using a 'path' string. Yafl uses a Fields location in the Form's component hierarchy to determine the shape of the resulting form value.

#### Configuration

##### `name: string | number`

Name your field! Providing a number usually indicates that this Field appears in an array.

##### `parse?: (value: any) => T`

Transforms a Field's value before setting it.

> **Why you might need this: `parse`**
>
> This prop is useful for when you need to convert a value from one type to another. A common use case is converting string values that have been typed into a text input into number types.

##### `render?: (props: FieldProps<F, T>) => React.ReactNode`

A render prop that accepts an object containing all the good stuff you'll need to render a your Field.

##### `component?: React.ComponentType<FieldProps<F, T>> | string`

Specify a component to render. If a string is provided then Yafl will attempt to match the string component to one provided in the `components` Form prop and if no match is found then it will call React.createElement with the value provided.

> **Note:**
>
> Any other props will be forwarded (along with any props specified by `sharedProps` on the Form component) to your component or render prop.


#### Field Props

The following is a list of props that are passed to the `render` prop or `component` prop of every Field. `T` and `F` correspond to the generic types for the Field and Form respectively.

| Prop | Description |
| - | - |
| `input: ` [`InputProps<T>`](#field-inputprops) | An object containing the core handlers and props for an input.<br />*Allows for easy use of the spread operator.* |
| `meta: ` [`FieldMeta<F, T>`](#fieldmeta) | An object containing any meta state related to the current field as well as some handy functions. |

##### Field InputProps

| Prop | Description |
| - | - |
| `name: string` | Forwarded from the `name` prop of this Field. |
| `value: T` | The current value of this Field. |
| `onBlur: (e: React.FocusEvent<any>) => void` | The onBlur handler for your input (DOM only).<br />*Useful if you need to keep track of which Fields have been visited.* |
| `onFocus: (e: React.FocusEvent<any>) => void` | The onFocus handler for your input (DOM only).<br />*Useful if you need to keep track of which field is currently active.* |
| `onChange: (e: React.ChangeEvent<any>) => void` | The onChange handler for your input (DOM only).<br />Sets the value of this Field. |

##### FieldMeta

TypeScript: `FieldMeta<F, T>` where `F` and `T` correspond to the generic types for the current Field and Form respectively.

| Prop | Description |
| - | - |
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

### `<Section />`

Section components give your forms depth. The `name` prop of a `<Section />` will become the key of an object value in your Form. If a `<Field />` appears anywhere in a Section's children it will be a property of that Section. So, for example, the following piece of JSX

#### Configuration

##### `name: Name`

Like a Field, a Section also requires a name prop! Corresponds to the name of the object this Section will create on the `formValue`.

##### `fallback?: T`

The `fallback` prop is similar to the `defaultValue` prop on the Form component, except that it never gets merged into the `formValue`.

> **Why you might need this: `fallback`**
>
> A `fallback` is useful if the value for the Section is ever null or undefined. A fallback becomes especially handy if a Section or Field component is rendered within a `<Repeat />`. Since it doesn't often make much sense to assign anything other than an empty array[] as the default value for a list of things, we can specify a `fallback` to prevent warnings about uncontrolled inputs becoming controlled inputs for any Fields rendered inside the Repeat.

##### `children: React.ReactNode`

This usually would not warrent an explanation, but it is important to note if any of the children of a Section (that occur anywhere in the hierarchy) that are of type Section, Field or Repeat will be correctly assigned a corresponding value on the object that this Section will produce.

#### Section Helpers

| Prop | Description |
| - | - |
| `setValue: (value: T) => void` | Sets the value of this Section. |


#### Example

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

### `<Repeat />`

The Repeat component is conceptually similar to the Section component except that it can be used to create what other libraries call "FieldArrays". A `<Repeat />` uses a function as children and comes with a few handy helper methods. Here's an example using TypeScript

#### Configuration

##### `name: Name`

The name of the array this Repeat creates.

##### `fallback?: T[]`

Serves the same purpose as a Section's fallback prop. This is usually more useful when dealing with Repeats since it will allow you to call value.map() without worrying about the value being null or undefined

##### `children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)`

The Repeat Component uses the function as a child pattern. The first argument is the value of this Repeat. The second argument is an object of array helper functions which provide some simple array manipulation functionality.

#### Array Helpers

| Prop | Description |
| - | - |
| `push: (...items: T[]) => number` | Appends new elements to the array, and returns the new length of the array. |
| `pop: () => T \| undefined` | Removes the last element from the array and returns it. |
| `shift: () => T \| undefined` | Removes the first element from the array and returns it. |
| `unshift: (...items: T[]) => number` | Inserts new elements at the start of the array and returns the new length of the array. |
| `insert: (index: number, ...items: T[]) => number` | Inserts new elements into the array at the specified index and returns the new length of the array. |
| `swap: (index1: number, index2: number) => void` | Swaps two elements at the specified indices. |
| `remove: (index: number) => T \| undefined` | Removes an element from the array at the specified index. |
| `setValue: (value: T[]) => void` | Sets the value of the array. |


#### Example

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

### `<ForwardProps />`

Yafl uses React's context API to make values available to all Field components and the `<ForwardProps />` provides a simple but effective way to pass or *forward* certain common props to all of your Fields. These components can be nested so that a `<FowardProps />` component rendered further down the component hierarchy will override any values that might already be forwarded from a parent `<ForwardProps />` component. Any props forwarded to your Fields will arrive on the Field's rendered component on the same object as `input` and `meta`.

#### Configuration

Any number of values can be passed to - and forwarded by - the `<ForwardProps />` component. All props (apart from the single configurable prop listed below) will be forwarded to your `<Field />` components.

>**Why you might need this: `<ForwardProps />`**
>
> - Passing any common values that you might need available on all of your Fields.
> - For things like theming, etc 
> - See the section on [Managing your own state](#managing-your-own-state) for more information on why this component might be useful


##### `mode?: 'default' | 'branch'`

The only configurable prop on the ForwardProps component is `mode`. By default all props will be forwarded *as is* to every `<Field />` in your `<Form />`. However, by specifying `mode="branch"` you are saying that you want all the *additional* props to be *branched* by `name` every time it encounters a `name` prop on a `<Section />`, `<Repeat />` or `<Field />`.


### `<Validator />`

The `<Validator />` component can be 'rendered' to create errors on your Form. The concept of "rendering a validator" might require a small shift in the way you think about form validation since other form libraries usually do validation through the use of a `validate` prop. With Yafl however, you validate your form by simply rendering a Validator. This has some interesting benefits, one of which is that a "rendered" validator solves some of the edge cases around form validation - the most obvious example being that of async validation.

#### Configuration

##### `invalid?: boolean`

Defaults to false. When the invalid prop becomes true the Validator will set an error for the corresponding path.

> **Note:**
>
> If the `invalid` prop is not provided then an error will only be set if and when the `msg` prop is passed a string value.

##### `msg: string`

The error message. If this Validator component is rendered with the same path as another Validator component the msg string will the pushed onto an array of error messages for the same path.

##### `path?: Path`
Override the `path` for a Validator. By default the `path` is determined by what appears above this component in the Form component hierarchy.

>**Why you might need this: `path`**
>
> This is useful assign errors that belong to the domain of a Section, Repeat, at the Form level. Using the `path` prop is also for simply displaying general errors with a custom path or key.

#### Example 

Here's an example:

```jsx
// ValidatorExample.jsx
import { Form, Field, Validator } from 'yafl'

const ValidatorExample = (props) => (
  <Form>
    {({ submit, formValue }) => (
      <form onSubmit={submit}>
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
        {formValue.password !== formValue.confirmPassword && (
          <Validator path="issues" msg="Oops, passwords do not match!" />
        )
      </form>
    )}
  </Form>
)
```

```jsx
// TextInput.jsx
function TextInput({ input, meta, ...props }) {
  const { visited, submitCount, errors, isValid } = meta
  const showErrors = !isValid && (submitCount > 0 || visited)
  return (
    <Fragment>
      <label>{props.label}</label>
			<input type="text" {...input} />
      {showErrors && <span className="error">{errors[0]}</span>}
      <IsRequired message="This field is required" value={input.value} />
      <MinLength message="Too short!" min={props.minLength} value={input.value}  />
    </Fragment>
  )
}
```

```jsx
// IsRequiredValidator.jsx
function IsRequired ({ value, message }) {
  return <Validator invalid={!value} msg={message} />
}
```

```jsx
// MinLengthValidator.jsx
function MinLength ({ value, min, message }) {
  return (
    <Validator msg={message} invalid={value.length < min} />
  )
}

```

> **Note:**
>
> Currently Yafl does not guarantee the order in which error messages will appear in a Field's `errors` array. However this is usually only important when you only want to display the first error message using something like `errors[0]`. Fortunately Yafl provides the syntax that allows you to stop validating Fields "on first failure". You can accomplish this by nesting a `<Validator />` as the child of another `<Validator />`. This works because the children of a Validator are only rendered when Validation passes for any particular `<Validator />`.

#### How to stop validating a Field on first failure

Say you have a custom `<TextInput />` component that accepts a `validate` prop which is a simple array of functions. Let's take a look at how this component might be implemented:

```jsx
const TextInput = ({ input, meta, validators }) => {
  const { visited, submitCount, errors, isValid } = meta
  const showErrors = !isValid && (submitCount > 0 || visited)
  return (
    <div className="form-input">
      <input {...input} />
      {showErrors && <span className="error">{errors[0]}</span>}
      {/* reduceRight, WTF? See note below... */ }
      {validators.reduceRight((ret, validate) => {
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
  if (!value) {
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

### `connect<T>(Component: React.ComponentType<T>)`

Use the connect higher order component to connect any component to the Yafl context.

#### Example

```jsx
// SimpleForm.js
import { Form, Field, QuickForm } from 'yafl'

class SimpleForm extends React.Component {
  render () {
    return (
      <Form {/* ...form props */}>
        <QuickForm>
          ...
          <Field name="year" component="input" />
        </QuickForm>
      </Form>
    )
  }
}
```

```jsx
// QuickForm.js
import { connect } from 'yafl'

const QuickForm = ({ yafl, children, ...props }) => (
  <form onSubmit={yafl.submit} {...props}>{children}</form>
)

export default connect(QuickForm)
```

## Managing your own state

Yafl gives you the ability to implement your own solution for managing the state of your form. The basic idea is this:

1. Override Yafl's default behaviours by plugging into simple input event hooks.
2. Keep track of the state of your Form in your *own* component.
3. Use Yafl's `<ForwardProps />` component with `mode="branch"` and any number of *additional* props to forward only the relevent parts your state on to your Fields.

An example of this in action can be found [here](https://codesandbox.io/s/xrmv9xn684) where I use Yup to handle validation. Note that this doesn't have to be validation either, you could - in theory - opt out of using any (or all) of Yafl's internal state management implementation.

The one important criteria that all of these additional props should conform to is that they should be *branchable*. An object is branchable if it matches the shape of your `formValue`. This concept is probably best illustrated using the following *recursive* type:

```ts
type ExtraProp<F extends object> = { [K in keyof F]?: F[K] extends object ? ExtraProp<F[K]> : any }
```

If you're new to TypeScript the above simply means that every additional prop should be an object with keys that match those of your `formValue`. So, for example if your `formValue` looks like this:

```ts
const formValue = {
  contact: {
    tel: '',
      addresss: {
        streetNo: '',
        streetName: '',
    }
  }
}
```

A valid branchable object might look something like this:

```ts
const errors = {
  contact: {
    tel: { msg: 'some custom error', danger: 'HIGH' },
      addresss: {
        streetNo: { msg: 'some custom error', danger: 'HIGH' },
        streetName: { msg: 'some custom error', danger: 'LOW' },
    }
  }
}
```

Or like this:

```ts
const isTouched = {
  contact: {
    tel: false,
      addresss: {
        streetNo: true,
        streetName: false,
    }
  }
}
```

Again, the important thing to notice here is that while the values can be of `any` type, the keys should match those of your `formValue`. If any of the keys on your object are absent, any Field that exists further down the same path will simply receive `undefined` for that value.

## Top Level API

**Yafl** only exports a single function:

##### `createFormContext` 

`createFormContext` returns all of the same components as those exported by Yafl.

```js
const { Form, Field, Section, Repeat, Validator, connect } = createFormContext()
```

The `createFormContext` function creates an independent form context that will only "listen" to changes made with in components that belong to that context.

> **Why you might need this: `createFormContext`**
>
> There are a few edge cases where you might find this handy. One might for example, want to nest one Form within another. However, since Yafl uses React's context API to pass props from Provider to Consumer, rendering a Form inside another Form will make it impossible to access the outter Form values from anywhere inside the inner Form.

#### Example

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