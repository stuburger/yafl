import React, { Component } from 'react'
import { Provider, Consumer } from './Context'
import { Name, Provider as P, FormErrors, Visited, Touched } from '../sharedTypes'

export interface ArrayHelpers<T = any> {
  push: (value: any) => void
}

export interface ForkProviderConfig<T = any> extends P<T> {
  name: Name
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

export interface SectionConfig<T = any> {
  name: Name
  defaultValue?: any
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

class ForkProvider extends Component<ForkProviderConfig> {
  constructor(props: ForkProviderConfig) {
    super(props)
    this.push = this.push.bind(this)
  }

  componentWillUnmount() {
    const { unregisterField, path } = this.props
    unregisterField(path)
  }

  push(valueToPush: any) {
    // See below comment
    const { setValue, value = {}, path, name } = this.props
    setValue([...path, name], [...value[name], valueToPush])
  }

  render() {
    // the assigning of default values might be better suited for the Section Component below
    const {
      name,
      children,
      value = {},
      touched = {},
      visited = {},
      errors = {},
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
          visited: visited[name] as Visited,
          path: path.concat([name])
        }}
      >
        {typeof children === 'function' ? children(value[name], { push: this.push }) : children}
      </Provider>
    )
  }
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
