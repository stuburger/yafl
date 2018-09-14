import React from 'react'
// import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import NextPage from '../../components/NextPage'
import md from 'react-markings'
import '../../components/custom.css'

const Connect = () => md`
\`createFormContext\` returns all of the same components as those exported by Yafl.


\`const { Form, Field, Section, Repeat, Validator, connect } = createFormContext()\`


The \`createFormContext\` function creates an independent form context that will only "listen" to changes made with in components that belong to that context.

> **Why you might need this: \`createFormContext\`**
>
> There are a few edge cases where you might find this handy. One might for example, want to nest one Form within another. However, since Yafl uses React's context API to pass props from Provider to Consumer, rendering a Form inside another Form will make it impossible to access the outter Form values from anywhere inside the inner Form.
`

export default () => (
  <DocsLayout title="Using createFormContext()" description="Using createFormContext">
    <Connect />
    <NextPage to="/api/managing-your-own-state" title="Managing your own state" />
  </DocsLayout>
)
