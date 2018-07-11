# Yet. Another. Form. Library.

[![Build Status](https://travis-ci.org/stuburger/yafl.svg?branch=master)](https://travis-ci.org/stuburger/yafl)

YAFL - Yet Another Form Library

## Motivation

Development on yafl only started after the release of React 16.3 and uses the React Context API behind the scenes to pass props between components. It has drawn a lot of inspiration from Redux-Form and Formik (both awesome projects!)

yafl's philosophy is to "keep it super simple". While it provides a lot of functionality out the box, it aims to keep it's API surface area as small as possible while still remaining flexible and easy to use.

## Why use YAFL?

- Use TypeScript to create strongly typed forms to give you peace of mind and a good nights sleep.
- Create multi-page forms without needing to use specialized components or a state management library like flux or redux.
- Create deeply nested forms or forms within forms.
- Structure your Components to match the shape of your data. This means no more accessing field values using string paths!
- Render a Validator!
- Fully featured and weighing in at less than 8KB! Thats almost half the size of libraries offering similar functionality!

## Installation

_Not available on npm yet._

# API

## The **Form** Component

The Form component contains all the state that makes yafl work. All other yafl components *have* to be rendered as a child of a `<Form>`. Trying to render a Field outside of a Form, for example, will cause an error to be thrown.

Note: if you are nesting forms this may cause some pretty strange behaviour. If you have a use case for nested forms you'll have to use yafl's only non-component export: `createFormContext`.

### Form Configuration Props

```ts
interface FormConfig<T extends object> {
  // The initial value of your Form. Once this value becomes
  // truthy your Form will initialize.
  initialValue?: T
  
  // The defaultValue is merged with initialValue on initialization
  // to replace any missing values.
  defaultValue?: T
  
  // When true, any time the initialValue prop changes your Form will be reinitialized
  allowReinitialize?: boolean
  
  // Specify whether values that are not matched with a rendered Field, Section or Repeat
  // should be included on submission of the form. Default is false.
  submitUnregisteredValues?: boolean
  
  // Specify whether your Form should remember what fields have been touched and/or
  // visited and if the submitCount should be reset to 0 when the initialValue prop changes.
  rememberStateOnReinitialize?: boolean
  
  // For convenience. Uses React's context API to make these values available to all
  // Field components.
  commonFieldProps?: { [key: string]: any }
  
  // For convenience. Allows you specify component dictionary to match a Fields component prop with.
  componentTypes?: ComponentTypes<T>
  
  // The function to call on form submission
  onSubmit?: (formValue: T) => void
}
```

## The **Field** Component

Field components are the bread and butter of any form library and yafl's Field's are no exception! The `<Field />` component is more or less equivalent to the Field components found in Formik or Redux-Form. The most important thing to note about the Field component is that you should never name your Field using a 'path' string. Yafl uses a Fields location in the Form's component hierarchy to determine the shape of the resulting form value.

```ts
interface FieldConfig<F extends object, T = any> {
  // Name your field! Providing a number usually indicates that
  // this field appears in an array.
  name: string | number

  // Transforms a Field's value before setting it. Useful for number inputs and the like.
  parse?: (value: any) => T

  // A render prop that accepts an object containing all the good stuff
  // you'll need to render a your Field.
  render?: (props: FieldProps<F, T>) => React.ReactNode
	
	// Specify a component to render. If a string is provided then yafl will attempt to 
	// match the string component to one provided in the componentTypes Form prop
	// and if no match is found then it will call React.createElement with the value provided.
  component?: React.ComponentType<FieldProps<F, T>> | string
  // Any other props will be forwarded (along with any props specified by
  // commonFieldProps on the Form component) to your component or render prop.
  [key: string]: any
}
```

### Field Props

The following is a list of props that are passed to the render prop or component prop for every Field where `T` and `F` correspond to the generic types for the Field and Form respectively.

| Prop | Description |
| - | - |
| `input: ` [`InputProps<T>`](#field-inputprops) | An object containing the core handlers and props for an input. Allows for easy use of the spread operator. |
| `path: string` | The path for this field. |
| `visited: boolean` | Indicates whether this Field has been visited. Automatically set to true on when input.onBlur() is called. |
| `touched: boolean` | Indicates whether this Field has been touched. Automatically set to true the first time a Field's value is changed. |
| `isDirty: boolean` | Indicates whether the initialValue for this Field is different from its current value. |
| `isActive: boolean` | Indicates whether this Field is currently in Focus. |
| `isValid: boolean` | Indicates whether this Field is valid based on whether there are any Validators rendered that match the path of this Field. |
| `errors: string[]` |  An array containing any errors for this Field based on whether there are any Validators rendered that match the path of this Field. |
| `initialValue: T` | The value this Field was initialized with. |
| `defaultValue: T` | The default value that this Field was initialized with. |
| `setValue: (value: T, touch?: boolean) => void` | Sets the value for this Field. Optionally specify if this Field should be touched when this function is called. Default is true. |
| `formValue: F` | The current value of the Form |
| `submitCount: number` | The number of times the Form has been submitted.  |
| `resetForm: () => void` |  Clears all Form state. `formValue` is reset to its initialValue. |
| `submit: () => void` |  Calls the onSubmit function supplied to the Form component  |
| `forgetState: () => void` |  Resets submitCount, touched and visited. The `formValue` is not reset. |
| `clearForm: () => void` |  Clears all Form state. `formValue` is reset to its defaultValue. |
| `setFormValue: (set: SetFormValueFunc<F>) => void` |  Sets the `formValue` imperatively. |
| `setFormVisited: (set: SetFormVisitedFunc<F>) => void` |  Sets the Form's visited state imperatively. Accepts a callback with the Form's previous value. |
| `setFormTouched: (set: SetFormTouchedFunc<F>) => void` | Sets the Form's touched state imperatively. Accepts a callback with the Form's previous visited state. |

### Field InputProps

| Prop | Description |
| - | - |
| `name: string` | Forwarded from the name prop of this Field. |
| `value: T` | The current value of this Field. |
| `onBlur: (e: React.FocusEvent<any>) => void` | The onBlur handler for your input (DOM only). Useful if you need to keep track of which Fields have been visited. |
| `onFocus: (e: React.FocusEvent<any>) => void` | The onFocus handler for your input (DOM only). Useful if you need to keep track of which field is currently active. |
| `onChange: (e: React.ChangeEvent<any>) => void` | The onChange handler for your input (DOM only). Sets the value of this Field. |


## The **Section** Component

Section components give your forms depth. The `name` prop of a `<Section />` will become the key of an object value in your Form. If a `<Field />` appears anywhere in a sections children it will be a property of that section. So, for example, the following piece of JSX

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

### Section Configuration Props

```ts
interface SectionConfig<T> {
  // Like a Field, a Section also requires a name prop!
  name: Name

  // The fallback prop is similar to the default value prop on the Form component,
  // except the difference is that it never gets merged with the formValue.
  // Useful if the value for the Section is ever null or undefined. A fallback becomes especially handy
  // if your Section component is rendered within a Repeat. Since it usually doesn't make much sense to assign
  // anything but an empty array[] as the default value for a list of objects, we can specify a fallback value
  // to prevent warnings about uncontrolled inputs become controlled inputs.
  fallback?: T

  children: React.ReactNode
}
```

## The **Repeat** Component

The Repeat component is conceptually similar to the Section component except that it can be used to create what other libraries call "FieldArrays". A `<Repeat />` uses a function as children and comes with a few handy helper methods. Here's an example using TypeScript

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

### Repeat Configuration Props

```ts
interface RepeatConfig<T> {
  name: Name

  // Serves the same purpose as a Section's fallback prop. This is usually more useful when dealing with arrays
  // since is allows you to call value.map() without worrying about value null or undefined
  fallback?: T[]

  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
}
```

### Repeat Props

The Repeat Component uses the function as a child pattern. The first argument is the value of this Repeat section. The second argument is an object of array helper functions which provide some simple array manipulation functionality.

`children: (value: T[], utils: ArrayHelpers<T>) => React.ReactNode`

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

## The **Gizmo** Component

Gizmos are general purpose components that can be used to render anything that isn't a field - a submit button is the obvious example, but this could be anything. Another possible use case for the `<Gizmo />` component is to create your own higher order components! Since a Gizmo is a pure Consumer you can render Fields, Sections and Repeats within a Gizmo so it becomes simple to decorate any component of your choice with any or all the functions that you might need. Lets take a look:

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

### Gizmo Configuration Props
```ts
interface GizmoConfig<F extends object> {
 render?: (props: GizmoProps<F>) => React.ReactNode

 component?: React.ComponentType<GizmoProps<F>>

// Any other props will be forwarded to your component
 [key: string]: any
}
```

## The **Validator** Component

The `<Validator />` component can be 'rendered' to create errors on your Form. The concept of "rendering a validator" might require a small shift in the way you think about form validation since other form libraries usually do validation through the use of a `validate` prop. With yafl however, you validate your form by simply rendering a Validator. This has some interesting benefits, one of which is that a "rendered" validator solves some of the edge cases around form validation - the most obvious example being that of async validation. 

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

Nice and declaritive.

### Validator Configuration Props

```ts
interface ValidatorProps {

  // Defaults to false. When the invalid prop becomes true the Validator will set a Form
  // Error for the corresponding path. If the invalid prop is not provided then an error will only
  // be set if and when the msg prop is passed a string value.
  invalid?: boolean

  // The error message. If this Validator component is rendered
  // with the same path as another Validator component
  // the msg string will the pushed onto an array of error messages for the same path.
  msg: string

  // Override the path for a Validator. By default the path is determined by what
  // appears above this component in the Form component hierarchy. Useful for errors
  // that belong in the domain of a Section, Repeat, at the Form level
  // or for general errors.
  path?: Path
}
```

## Top Level API

**yafl** only exports a single function:

`createFormContext` returns all of the same components as those exported by yafl.

```js
const { Form, Field, Section, Repeat, Gizmo, Validator } = createFormContext()
```

There are a few cases where one might want to nest one Form within another. However, since yafl uses React's context API to pass props from Provider to Consumer, rendering a Form inside another Form will make it impossible to access the outter Form values within a Field, Section or Repeat that are rendered within the inner Form. The following example serves to illustrate the problem:

```js
import { Form, Field, Section } from 'yafl'

const ProblemForm = (props) => {
  return (
    <Form> // Call me Form A!
      <Section name="sectionA">
        <Field
          name="formAField1"
          render={(props) => {
            // I correctly belong to Form A
            return null
          }}
          />
        <Form>  // I am Form B!
          <Section name="sectionB">
            <Field
              name="formBField1"
              render={(props) => {
                // I correctly belong to Form B
                return null
              }}
            />
            <Field
              name="formAField2"
              render={(props) => {
                // Oops! I belong to Form B!
                return null
              }}
            />
          </Section>
        </Form>
      </Section>
    </Form>
  )
}

```
So how do we solve this?

```js
import { Form as FormA, Field as FieldA, Section as SectionA, createFormContext } from 'yafl'

const context = createFormContext()

const FormB = context.Form
const FieldB = context.Field
const SectionB = context.Section

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