import React from 'react'
// import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import NextPage from '../../components/NextPage'
import md from 'react-markings'
import '../../components/custom.css'

const Connect = () => md`
## \`connect<T, F>(Component: React.ComponentType<T & { yafl: FormProps<F> }>)\`

Use the \`connect\` higher order component to connect any component to the Yafl context.
`

export default () => (
  <DocsLayout title="connect()" description="Connecting components">
    <Connect />
    <NextPage to="/api/create-form-context" title="createFormContext()" />
  </DocsLayout>
)
