import React, { Component } from 'react'
import { FormContextConsumer, FormContextProvider } from './Context'
import { defaultsDeep, merge, cloneDeep } from 'lodash'

class Fork extends Component {
  render() {
    const {
      name,
      children,
      value = {},
      touched = {},
      blurred = {},
      errors = {},
      defaultValue = {},
      registeredFields = {},
      path,
      ...props
    } = this.props

    return (
      <FormContextProvider
        value={{
          ...props,
          value: value[name],
          errors: errors[name],
          touched: touched[name],
          blurred: blurred[name],
          defaultValue: defaultValue[name],
          registeredFields: registeredFields[name],
          path: path ? path.concat([name]) : []
        }}
      >
        {children}
      </FormContextProvider>
    )
  }
}

class Section extends Component {
  render() {
    const { children, name, value } = this.props
    return (
      <Fork {...this.props}>
        {typeof children === 'function' ? children(value[name]) : children}
      </Fork>
    )
  }
}

export default class extends Component {
  render() {
    const { children, name } = this.props
    return (
      <FormContextConsumer>
        {props => (
          <Section name={name} {...props}>
            {children}
          </Section>
        )}
      </FormContextConsumer>
    )
  }
}