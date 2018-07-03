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

## The **Form** Component

The Form component contains all the state that makes yafl work. All other yafl components *have* to be rendered as a child of a `<Form>`. Trying to render a Field outside of a Form will cause an error to be thrown.

Note: if you are nesting forms this may cause some pretty strange behaviour. If you have a use case for nested forms you'll have to use yafl's only non-component export: `createFormContext`. To learn more about this "strange behaviour" see the "*how it works section*" at the end of this read me.

### Form Configuration Props

```ts
interface FormConfig<T extends object> {
  // The initial value of your form. Once this value becomes
  // truthy you form will initialize.
  initialValue?: T

  // The defaultValue is merged with initialValue on initialization
  // to replace any missing values.
  defaultValue?: T

  // When true, any time initialValue changes, your form value
  // will update the value of your form.
  allowReinitialize?: boolean

  // Should your form remember what fields have been touched and/or
  // visited and if the submitCount should be reset to 0.
  rememberStateOnReinitialize?: boolean

  // For convenience. These props will become available to all
  // Field components.
  commonFieldProps?: { [key: string]: any }

  // For convenience. Allows you so use the type prop on Field
  // components instead of the render prope or the component prop.
  componentTypes?: ComponentTypes<T>

  // The function to call on form submission
  onSubmit?: (formValue: T) => void
}
```

## The **Field** Component

Field components are the bread and butter of any form library and yafl's Field's are no exception! The `<Field />` component is more or less equivalent to the Field components found in Formik or Redux-Form. The most important thing to note about the Field component is that you should never name your Field using a 'path' string. Yafl uses a Fields location in the Form's component hierarchy to determine where the the resulting form value.

```ts
interface FieldConfig<F extends object, T = any> {
  // Name your field! Providing a number usually indicates that
  // this field appears in an array.
  name: string | number

  // Similar to the type attribute of an HTML input, however this prop
  // is used as a key to match against the object supplied to the
  // componentTypes prop on a Form component.
  type?: string

  // A render prop that accepts an object containing all the good stuff
  // you'll need to render a your Field.
  render?: (props: FieldProps<F, T>) => React.ReactNode
  // Specify a component to render

  component?: React.ComponentType<FieldProps<F, T>>
  // Any other props will be forwarded (along with any props specified by
  // commonFieldProps on the Form component) to your component or render prop.
  [key: string]: any
}
```

## The **Section** Component

Section components give your forms depth. The `name` prop of a `<Section />` will become the key of an object value in your form. If a `<Field />` appears anywhere in a sections children it will be a property of that section. So, for example, the following piece of JSX

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
will produce a form value object with the following shape

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
  // except the difference is that it never gets merged with the form value.
  // Useful if the value for the Section is ever null or undefined. A fallback becomes especially handy
  // if your Section component is rendered within a Repeat. Since it usually doesn't make much sense to assign
  // anything but an empty array[] as the default value for a list of objects, we can specify a fallback value
  // to prevent warnings about uncontrolled inputs become controlled inputs.
  fallback?: T

  children: React.ReactNode
}
```

## The **Repeat** Component

The Repeat component is conceptually similar to the Section component except that can be used to create what other libraries call FieldArrays. A `<Repeat />` uses a function as children and comes with a few handy helper methods. Here's an example using TypeScript

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

## The **Gizmo** Component

Gizmos are general purpose components that can be used to render anything that isn't a field - a submit button is the obvious example, but this could be anything. Another possible use case for the `<Gizmo />` component is to create your own higher order components! Since a Gizmo is a pure Consumer you can render Fields, Sections and Repeats within a Gizmo so it becomes simple to decorate any component of your choice with any or all the functions that you might need. Lets take a look:

```jsx
// withForm.js
import { Gizmo, Form } from 'react-yafl'

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
```tsx
interface GizmoConfig<F extends object> {
	render?: (props: GizmoProps<F>) => React.ReactNode

	component?: React.ComponentType<GizmoProps<F>>

  // Any other props will be forwarded to your component
  [key: string]: any
}
```

## The **Fault** Component

A Fault is a basic component, but that doesn't make them any less useful! In fact you might find yourself rendering quite a few of them! Faults are how yafl does validation and they require a small shift in the way you think about form validation. While other form libraries do validation using a `validate` prop, yafl doesn't have validators. Yup, you read that correctly! So, you might be wondering where you provide your validation function. Field level validation? Async blur/change validation? What about a synchronous validate prop on the form? Nope, nope and definitely nope. Check it out:

```jsx
// FaultExample.js
import { Form, Field, Fault } from 'react-yafl'

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
    render={({ value }) => value.password !== value.confirmPassword && (
      <Fault path="issues" msg="Oops, passwords do not match!" />
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
  if(
    !value &&
    (visted && validateOn === 'blur') ||
    (touched && validateOn === 'change')
  ) {
    return <Fault msg={message} />
  }
  return null
}

function Length ({ value, touched, visited, validateOn = 'change', min, max, message }) {
  if(
    ((value.length < min) || (value.length > max)) &&
    (visted && validateOn === 'blur') ||
    (touched && validateOn === 'change')
  ) {
    return <Fault msg={message} />
  }
  return null
}

```

Nice and declaritive.

### Fault Configuration Props

```ts
interface FaultProps {
  // The error message. If this Fault component is rendered
  // with the same path as another Fault component
  // the msg string will the pushed onto an array of error messages for the same path.
  msg: string

  // Override the path for a Fault. By default the path is determined by what
  // appears above this component in the Form component heirachy. Useful for errors
  // that belong in the domain of a Section, Repeat, at the Form level
  // or for general errors.
  path?: Path
}
```


## Top Level API

`react-yafl` only exports a single function:

`createFormContext` returns all of the same components as those exported by yafl.

```js
const { Form, Field, Section, Repeat, Gizmo, Fault } = createFormContext()
```

There are a few cases where one might want to nest one Form within another. However, since yafl uses React's context API to pass props from Provider to Consumer, rendering a Form inside another Form will make it impossible to access the outter Form values within a Field, Section or Repeat that are rendered within the inner Form. The following example serves to illustrate the problem:

```js
import { Form, Field, Section } from 'react-yafl'

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
import { Form as FormA, Field as FieldA, Section as SectionA, createFormContext } from 'react-yafl'

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