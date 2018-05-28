import React, { Component } from 'react'
import { Provider, Consumer } from './Context'
import { defaultsDeep, merge, cloneDeep } from 'lodash'

class ForkProvider extends Component {
  componentWillUnmount() {
    const { unregisterField, path } = this.props
    unregisterField(path)
  }

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
      <Provider
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
        {typeof children === 'function' ? children(value[name]) : children}
      </Provider>
    )
  }
}

export default class Section extends Component {
  render() {
    const { children, name } = this.props
    return (
      <Consumer>
        {props => (
          <ForkProvider name={name} {...props}>
            {children}
          </ForkProvider>
        )}
      </Consumer>
    )
  }
}
