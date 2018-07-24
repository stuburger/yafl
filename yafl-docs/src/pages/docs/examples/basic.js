import React from 'react'
import styled from 'styled-components'
import DocsLayout from '../../../components/DocsLayout'
// import NextPage from '../../../components/NextPage'
// import md from 'react-markings'
import CodeSnippet from '../../../components/CodeSnippet'
import BasicForm from '../../../examples/SimpleForm'
import rem from '../../../utils/rem'

const BasicFormCode = require('!raw-loader!../../../examples/SimpleForm.js')

const Yafl = styled.div`
  max-width: 500px;
  margin: 40px auto;
  border-radius: 5px;
  padding: ${rem(10)} ${rem(50)};
`

const Wrapped = () => (
  <Yafl className="yafl">
    <BasicForm />
  </Yafl>
)

export default () => (
  <DocsLayout
    title="API Reference"
    description="API Reference of styled-components"
  >
    <Wrapped title="Basic Usage" />
    <CodeSnippet js={BasicFormCode} />
  </DocsLayout>
)
// <NextPage to="/docs/tooling" title="Tooling" />

// import React from 'react'
// import { Link } from 'gatsby'

// // import Layout from 'components/layout'

// const SecondPage = () => (
//   <div>
//     <h1>Hi from the second page</h1>
//     <p>Welcome to page 2</p>
//     <Link to="/">Go back to the homepage</Link>
//   </div>
// )

// export default SecondPage
