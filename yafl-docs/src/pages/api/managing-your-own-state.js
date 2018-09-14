import React from 'react'
// import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import NextPage from '../../components/NextPage'
import md from 'react-markings'
import '../../components/custom.css'

const Connect = () => md`
Yafl gives you the ability to implement your own solution for managing the state of your form. The basic idea is this:

1. Override Yafl's default behaviours by plugging into simple input event hooks.
2. Keep track of the state of your Form in your _own_ component.
3. Use Yafl's \`<ForwardProps />\` component with \`mode="branch"\` and any number of _additional_ props to forward only the relevent parts your state on to your Fields.

An example of this in action can be found [here](https://codesandbox.io/s/xrmv9xn684) where I use Yup to handle validation. Note that this doesn't have to be validation either, you could - in theory - opt out of using any (or all) of Yafl's internal state management implementation.
`

export default () => (
  <DocsLayout
    title="Managing your own state"
    description="Managing your own state"
  >
    <Connect />
    <NextPage to="/api/create-form-context" title="Examples" />
  </DocsLayout>
)
