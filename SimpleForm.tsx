import * as React from 'react'
import { createFormContext } from './src/form'

interface Guy {
  name: string
  friends: Array<Guy>
}

const { Form, Field, FieldMap } = createFormContext<Guy>({ name: '', friends: [] })

const GuyFields = props => {
  return (
    <>
      <Field
        name="name"
        parent={props.parent}
        render={({ input, ...props }) => <TextInput {...input} />}
      />
      <FieldMap
        name="friends"
        parent={props.parent}
        render={props => {
          return <GuyFields {...props} />
        }}
      />
    </>
  )
}

class SimpleForm extends React.Component<any> {
  render() {
    return (
      <Form>
        <GuyFields />
      </Form>
    )
  }
}

function TextInput(props) {
  return (
    <div>
      <label>{props.forwardProps.label}</label>
      <input {...props.input} />
    </div>
  )
}
