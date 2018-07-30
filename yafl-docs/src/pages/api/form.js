import React from 'react'
// import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import NextPage from '../../components/NextPage'
import md from 'react-markings'
import '../../components/custom.css'

const FormMarkDown = () => md`
The \`<Form />\` component contains all the state that tracks what's going on in your form. This state includes things like whether or not a field \`isDirty\` or has been \`visited\`. It also keeps track of what Fields are mounted at any point in time which is useful for determining what values should be submitted collected for submission. All other Yafl components _have_ to be rendered inside the Form. Trying to render a Field outside of a Form, for example, will cause an error to be thrown.

## Configuration

### \`initialValue?: T\`

The initial value of your Form. Once \`initialValue\` becomes a non-null object, your Form will initialize.

### \`defaultValue?: T\`

The \`defaultValue\` is merged with the \`formValue\`. Currently this is done any time the \`defaultValue\` changes and not when your \`formValue\` changes.

### \`disableReinitialize?: boolean\`

Default is \`false\`.

By default any time the \`initialValue\` prop changes, your Form will be reinitialized with the updated \`initialValue\`. To prevent this behaviour simply set \`disableReinitialize\` to \`true\`.

### \`components?: ComponentTypes<T>\`

Another convenience prop which allows you provide component dictionary to match a Field's \`component\` prop with. For example:

### \`onSubmit?: (formValue: T) => boolean | void\`

The function to call on form submission. By default the \`formValue\` argument will contain only fields that are actually mounted. To include all values in your form you can use the \`submitUnregisteredValues\` prop. If you return false from this function, \`submitCount\` will not be incremented. Returning nothing or a value of any other type will have no effect on the default behaviour.

### \`submitUnregisteredValues?: boolean\`

Default is \`false\`.

Specify whether values that do not have a corresponding Field, Section or Repeat should be included on submission of your form.

> **Why you might need this: \`submitUnregisteredValues\`**
>
> For partially updating an object by submitting the unchanged values along with those that you have modified. This is frequently the case when a PUT is done on some API endpoint that is expecting the full value to be sent down the wire.

### \`persistFieldState?: boolean\`

Default is \`false\`.

Specify whether the \`touched\` and \`visited\` state of your \`<Field />\` components should persisted when they are unmounted.

> **Why you might need this: \`persistFieldState\`**
>
> You're not likely to use the \`persistFieldState\` prop very often, but it may come in handy when you are working with multi-route forms. By default, whenever a Field's \`componentWillUnmount\` function is called, the Field will be removed from the Form component's internal state and along with it, any state that is associated with that Field. When you're creating a multi-page Form, you'll probably want to keep this state around while visiting different routes, or areas of your Form where some of your Fields may not currently be mounted!

### \`onFormValueChange?: (prev: T, next: T) => void\`

Will get called every time the \`formValue\` changes.

### \`onStateChange?: (previousState: FormState<T>, nextState: FormState<T>) => void\`

Will get called every time the Form state changes.

> **Note:**
>
> \`onStateChange\` and \`onFormValueChange\` are implemented inside the Form's \`componentDidUpdate\` function which means the same cautions apply when calling \`setState\` in either of these function as do in any component's \`componentDidUpdate\` function.

### \`children: React.ReactNode | ((props: FormProps<T>) => React.ReactNode)\`

The children of your Form. Can be a \`ReactNode\` or a function with a single parameter which contains props packed with goodies.
`

export default () => (
  <DocsLayout title="The <Form /> Component" description="The Form Component">
		<FormMarkDown />
		<NextPage to="/api/field" title="The Field Component"  />
  </DocsLayout>
)
