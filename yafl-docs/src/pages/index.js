import React from 'react'
import { ExampleContainer } from '../components/ExampleContainer'
import DocsLayout from '../components/DocsLayout'
import NextPage from '../components/NextPage'
// import md from 'react-markings'
import CodeSnippet from '../components/CodeSnippet'
import BasicForm from '../examples/SimpleForm'

import '../components/yafl.css'
import '../components/layout.css'
import '../components/prism.css'
const BasicFormCode = require('!raw-loader!../examples/SimpleForm.js')

const Wrapped = () => (
  <ExampleContainer className="yafl">
    <BasicForm />
  </ExampleContainer>
)

export default () => (
  <DocsLayout
    title="API Reference"
    description="API Reference for Yet Another Form Library"
  >
    <Wrapped title="Basic Usage" />
    <CodeSnippet js={BasicFormCode} />
    <NextPage to="/api/form-component" title="The Form component" />
  </DocsLayout>
)
