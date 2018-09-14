import React from 'react'
// import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import NextPage from '../../components/NextPage'
import md from 'react-markings'
import '../../components/custom.css'

const ForwardProps = () => md`
Yafl uses React's context API to make values available to all Field components and \`<ForwardProps />\` provides a simple but effective way to pass or _forward_ certain common props to all of your Fields. These components can be nested so that a \`<FowardProps />\` component rendered further down the component hierarchy will override any values that might already be forwarded from a parent \`<ForwardProps />\` component. Any props forwarded to your Fields will arrive on the Field's rendered component at the same level as \`input\` and \`meta\`.

## Configuration

Any number of values can be passed to - and forwarded by - the \`<ForwardProps />\` component. All props (apart from the single configurable prop listed below) will be forwarded to your \`<Field />\` components.

> **Why you might need this: \`<ForwardProps />\`**
>
> - Passing any common values that you might need available on all of your Fields.
> - For things like theming, etc
> - See the section on [Managing your own state](#managing-your-own-state) for more information on why this component might be useful

### \`mode?: 'default' | 'branch'\`

The only configurable prop on the ForwardProps component is \`mode\`. By default all props will be forwarded _as is_ to every \`<Field />\` in your \`<Form />\`. However, by specifying \`mode="branch"\` you are saying that you want all the _additional_ props to be _branched_ by \`name\` every time it encounters a \`name\` prop on a \`<Section />\`, \`<Repeat />\` or \`<Field />\`.
`

export default () => (
  <DocsLayout
    title="The <ForwardProps /> Component"
    description="The ForwardProps Component"
  >
    <ForwardProps />
    <NextPage to="/api/repeat" title="The Repeat Component" />
  </DocsLayout>
)
