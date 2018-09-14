import React from 'react'
// import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import NextPage from '../../components/NextPage'
import md from 'react-markings'
import '../../components/custom.css'

const Section = () => md`
Section components give your forms depth. The \`name\` prop of a \`<Section />\` will become the key of an object value in your Form. If a \`<Field />\` appears anywhere in a Section's children it will be a property of that Section. So, for example, the following piece of JSX

## Configuration

### \`name: Name\`

Like a Field, a Section also requires a name prop! Corresponds to the name of the object this Section will create on the \`formValue\`.

### \`fallback?: T\`

The \`fallback\` prop is similar to the \`defaultValue\` prop on the Form component, except that it never gets merged into the \`formValue\`.

> **Why you might need this: \`fallback\`**
>
> A \`fallback\` is useful if the value for the Section is ever null or undefined. A fallback becomes especially handy if a Section or Field component is rendered within a \`<Repeat />\`. Since it doesn't often make much sense to assign anything other than an empty array[] as the default value for a list of things, we can specify a \`fallback\` to prevent warnings about uncontrolled inputs becoming controlled inputs for any Fields rendered inside the Repeat.

### \`children: React.ReactNode\`

This usually would not warrent an explanation, but it is important to note if any of the children of a Section (that occur anywhere in the hierarchy) that are of type Section, Field or Repeat will be correctly assigned a corresponding value on the object that this Section will produce.

## Section Helpers

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
\`setValue: (value: T) => void\`
        `}</td>
        <td>Sets the value of this Section.</td>
      </tr>
    </tbody>
  </table>
)}

`

export default () => (
  <DocsLayout
    title="The <Section /> Component"
    description="The Section Component"
  >
    <Section />
    <NextPage to="/api/repeat" title="The Repeat Component" />
  </DocsLayout>
)
