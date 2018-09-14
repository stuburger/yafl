import React from 'react'
// import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import NextPage from '../../components/NextPage'
import md from 'react-markings'
import '../../components/custom.css'

const Validator = () => md`
The \`<Validator />\` component can be 'rendered' to create errors on your Form. The concept of "rendering a validator" might require a small shift in the way you think about form validation since other form libraries usually do validation through the use of a \`validate\` prop. With Yafl however, you validate your form by simply rendering a Validator. This has some interesting benefits, one of which is that a "rendered" validator solves some of the edge cases around form validation - the most obvious example being that of async validation.

## Configuration

### \`invalid?: boolean\`

Defaults to false. When the invalid prop becomes true the Validator will set an error for the corresponding path.

> **Note:**
>
> If the \`invalid\` prop is not provided then an error will only be set if and when the \`msg\` prop is passed a string value.

### \`msg: string\`

The error message. If this Validator component is rendered with the same path as another Validator component the msg string will the pushed onto an array of error messages for the same path.

### \`path?: Path\`

Override the \`path\` for a Validator. By default the \`path\` is determined by what appears above this component in the Form component hierarchy.

> **Why you might need this: \`path\`**
>
> This is useful assign errors that belong to the domain of a Section, Repeat, at the Form level. Using the \`path\` prop is also for simply displaying general errors with a custom path or key.

> **Note:**
>
> Currently Yafl does not guarantee the order in which error messages will appear in a Field's \`errors\`array. However this is usually only important when you only want to display the first error message using something like\`errors[0]\`. Fortunately Yafl provides the syntax that allows you to stop validating Fields "on first failure". You can accomplish this by nesting a\`<Validator />\`as the child of another\`<Validator />\`. This works because the children of a Validator are only rendered when Validation passes for any particular\`<Validator />\`.
`

export default () => (
  <DocsLayout
    title="The <Validator /> Component"
    description="The Validator Component"
  >
    <Validator />
    <NextPage to="/api/connect" title="connect()" />
  </DocsLayout>
)
