import React, { Component } from 'react'
import { Provider, Consumer } from './Context'
import { Name, Provider as P, FormErrors, Blurred, Touched, RegisteredFields } from '../sharedTypes'

export interface ForkProviderConfig<T = any> extends P<T> {
  name: Name
  children: React.ReactNode | ((value: any) => React.ReactNode)
}

class ForkProvider extends Component<ForkProviderConfig> {
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
      registeredFields = {},
      defaultValue = {},
      initialValue = {},
      path = [],
      ...props
    } = this.props

    return (
      <Provider
        value={{
          ...props,
          value: value[name],
          initialValue: initialValue[name],
          defaultValue: defaultValue[name],
          errors: errors[name] as FormErrors,
          touched: touched[name] as Touched,
          blurred: blurred[name] as Blurred,
          registeredFields: registeredFields[name] as RegisteredFields,
          path: path.concat([name])
        }}
      >
        {typeof children === 'function' ? children(value[name]) : children}
      </Provider>
    )
  }
}

export interface SectionConfig<T = any> {
  name: Name
  children: React.ReactNode | ((value: any) => React.ReactNode)
}

export default class Section extends Component<SectionConfig> {
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
