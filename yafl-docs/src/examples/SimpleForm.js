import React, { Component } from 'react'
import { Form, Field } from 'yafl'
import Input from './helpers/Input'
import { required, minLength, email } from './validators'

class SimpleForm extends Component {
  handleSubmit = formValue => {
    alert(JSON.stringify(formValue, null, 2))
  }

  render() {
    return (
      <Form
        initialValue={{
          username: '',
          email: '',
        }}
        onSubmit={this.handleSubmit}
      >
        {yafl => (
          <form
            onSubmit={e => {
              yafl.submit()
              e.preventDefault()
            }}
          >
            <Field
              name="username"
              label="User name"
              required
              validators={[required, minLength(3)]}
              component={Input}
            />
            <Field
              name="email"
              label="Email"
              required
              validators={[required, email('Invalid email, yo!')]}
              placeholder="E.g. 29"
              component={Input}
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </Form>
    )
  }
}

export default SimpleForm
