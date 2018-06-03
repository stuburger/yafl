import * as React from 'react'
import { Provider, Consumer } from './Context'
// import * as _ from 'lodash'
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

// const updateFor: (keyof ForkProviderConfig)[] = ['errors', 'activeField', 'value']

class ForkProvider extends React.Component<ForkProviderConfig> {
  constructor(props: ForkProviderConfig) {
    super(props)
    this.push = this.push.bind(this)
  }

  // shouldComponentUpdate(np: ForkProviderConfig) {
  //   return updateFor.some(key => !_.isEqual(np[key], this.props[key]))
  // }

  componentWillUnmount() {
    const { unregisterField, path } = this.props
    unregisterField(path)
  }

  push(valueToPush: any) {
    const { setValue, value, path } = this.props
    setValue(path, [...value, valueToPush], false)
  }

  render() {
    const { name, children, ...props } = this.props

    return (
      <Provider value={props}>
        {typeof children === 'function' ? children(props.value, { push: this.push }) : children}
      </Provider>
    )
  }
}

export default class Section extends React.PureComponent<SectionConfig> {
  constructor(props: SectionConfig) {
    super(props)
    this._render = this._render.bind(this)
  }

  _render(incomingProps: P<any>) {
    const { children, name } = this.props
    const {
      value = {},
      touched = {},
      visited = {},
      errors = {},
      defaultValue = {},
      initialValue = {},
      path = [],
      ...props
    } = incomingProps

    return (
      <ForkProvider
        {...props}
        name={name}
        value={value[name]}
        initialValue={initialValue[name]}
        defaultValue={defaultValue[name]}
        errors={errors[name] as FormErrors}
        touched={touched[name] as Touched}
        visited={visited[name] as Visited}
        path={path.concat([name])}
      >
        {children}
      </ForkProvider>
    )
  }

  render() {
    return <Consumer>{this._render}</Consumer>
  }
}
