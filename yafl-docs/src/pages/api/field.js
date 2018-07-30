import React from 'react'
// import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import NextPage from '../../components/NextPage'
import md from 'react-markings'
import '../../components/custom.css'

const FormMarkDown = () => md`
Field components are the bread and butter of any form library and Yafl's Field's are no exception! The \`<Field />\` component is more or less equivalent to the Field components found in Formik or Redux-Form. The most important thing to note about the Field component is that you should never name your Field using a 'path' string. Yafl uses a Fields location in the Form's component hierarchy to determine the shape of the resulting form value.

## Configuration

### \`name: string | number\`

Name your field! Providing a number usually indicates that this Field appears in an array.

### \`parse?: (value: any) => T\`

Transforms a Field's value before setting it.

> **Why you might need this: \`parse\`**
>
> This prop is useful for when you need to convert a value from one type to another. A common use case is converting string values that have been typed into a text input into number types.

### \`render?: (props: FieldProps<F, T>) => React.ReactNode\`

A render prop that accepts an object containing all the good stuff you'll need to render a your Field.

### \`component?: React.ComponentType<FieldProps<F, T>> | string\`

Specify a component to render. If a string is provided then Yafl will attempt to match the string component to one provided in the \`components\` Form prop and if no match is found then it will call React.createElement with the value provided.

> **Note:**
>
> Any other props will be forwarded (along with any props specified by \`sharedProps\` on the Form component) to your component or render prop.

### \`forwardRef?: React.Ref<any>\`

If you want to gain access to your rendered component you can use the forwardRef prop. As you might expect, \`forwardRef\` does not work with stateless function components.

> **Why you might need this: \`forwardRef\`**
>
> Any time you need to access the functions of a rendered component from within a parent. Common uses cases cited in the [React](https://reactjs.org/docs/refs-and-the-dom.html) docs include, but are not limited to:
>
> - Managing focus, text selection, or media playback.
> - Triggering imperative animations.
> - Integrating with third-party DOM libraries.

${<br />}

## Field Props

The following is a list of props that are passed to the \`render\` prop or \`component\` prop of every Field. \`T\` and \`F\` correspond to the generic types for the Field and Form respectively.

${(
  <table>
    <thead>
      <tr>
        <th>Prop</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{md`
\`input:\`[\`InputProps<T>\`](#field-inputprops)
        `}</td>
        <td>
          An object containing the core handlers and props for an input.
          <br />
          Allows for easy use of the spread operator.
        </td>
      </tr>
      <tr>
        <td>{md`\`meta:\`[\`FieldMeta<F,T>\`](#fieldmeta)`}</td>
        <td>
          An object containing any meta state related to the current field as
          well as some handy functions.
        </td>
      </tr>
    </tbody>
  </table>
)}


### Field InputProps

| Prop                                            | Description                                                                                                                |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| \`name: string\`                                  | Forwarded from the \`name\` prop of this Field.                                                                              |
| \`value: T\`                                      | The current value of this Field.                                                                                           |
| \`onBlur: (e: React.FocusEvent<any>) => void\`    | The onBlur handler for your input (DOM only).<br />_Useful if you need to keep track of which Fields have been visited._   |
| \`onFocus: (e: React.FocusEvent<any>) => void\`   | The onFocus handler for your input (DOM only).<br />_Useful if you need to keep track of which field is currently active._ |
| \`onChange: (e: React.ChangeEvent<any>) => void\` | The onChange handler for your input (DOM only).<br />Sets the value of this Field.                                         |

### FieldMeta

TypeScript: \`FieldMeta<F, T>\` where \`F\` and \`T\` correspond to the generic types for the current Field and Form respectively.

| Prop                                                   | Description                                                                                                                                                                                 |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \`path: string\`                                         | The path for this field.                                                                                                                                                                    |
| \`visited: boolean\`                                     | Indicates whether this Field has been visited.<br />_Automatically set to true on when input.onBlur() is called._                                                                           |
| \`touched: boolean\`                                     | Indicates whether this Field has been touched.<br />_Automatically set to true the first time a Field's value is changed._                                                                  |
| \`isDirty: boolean\`                                     | Indicates whether the \`initialValue\` for this Field is different from the current \`formValue\`.                                                                                              |
| \`isActive: boolean\`                                    | Indicates whether this Field is currently in focus.                                                                                                                                         |
| \`isValid: boolean\`                                     | Indicates whether this Field is valid based on whether there are any Validators rendered that match the \`path\` of this Field.                                                               |
| \`errors: string[]\`                                     | An array containing any errors for this Field based on whether there are any Validators rendered that match the path of this Field.                                                         |
| \`initialValue: T\`                                      | The value this Field was initialized with.                                                                                                                                                  |
| \`defaultValue: T\`                                      | The default value of this Field.                                                                                                                                                            |
| \`setValue: (value: T, touch?: boolean) => void\`        | Sets the value for this Field.<br />Optionally specify if this Field should be touched when this function is called.<br />_If the \`touch\` paramater is not provided it defaults to \`true\`._ |
| \`formValue: F\`                                         | The current value of the Form                                                                                                                                                               |
| \`submitCount: number\`                                  | The number of times the Form has been submitted.                                                                                                                                            |
| \`resetForm: () => void\`                                | Clears all Form state. \`formValue\` is reset to its initialValue.                                                                                                                            |
| \`submit: () => void\`                                   | Calls the onSubmit function supplied to the Form component                                                                                                                                  |
| \`forgetState: () => void\`                              | Resets \`submitCount\`, \`touched\` and \`visited\`. The \`formValue\` is not reset.                                                                                                                |
| \`clearForm: () => void\`                                | Clears all Form state. \`formValue\` is reset to its \`defaultValue\`.                                                                                                                          |
| \`setFormValue: (set: SetFormValueFunc<F>) => void\`     | Sets the \`formValue\` imperatively.                                                                                                                                                          |
| \`setFormVisited: (set: SetFormVisitedFunc<F>) => void\` | Sets the Form's \`visited\` state imperatively.<br />Accepts a callback with the Form's previous value.                                                                                       |
| \`setFormTouched: (set: SetFormTouchedFunc<F>) => void\` | Sets the Form's \`touched\` state imperatively.<br />Accepts a callback with the Form's previous visited state.                                                                               |
`

export default () => (
  <DocsLayout title="The <Field /> Component" description="The Field Component">
    <FormMarkDown />
    <NextPage />
  </DocsLayout>
)
