import * as React from 'react'
import { Provider, Consumer } from './Context'
import * as _ from 'lodash'
import { isEqual } from '../utils'
import { Name, FormProvider, FormErrors, Visited, Touched, Validator } from '../sharedTypes'

export interface ArrayHelpers<T = any> {
  push: (value: any) => void
}

export interface ForkProviderConfig<T = any> extends FormProvider<T> {
  name: Name
  validators: Validator<T>[]
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

export interface SectionConfig<T = any> {
  name: Name
  defaultValue?: any
  validators?: Validator<T>[]
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

const ignoreProps: (keyof ForkProviderConfig)[] = [
  'path',
  'errors',
  'formValue',
  'registeredFields',
  'touchedState',
  'visitedState',
  'errorState',
  'children'
]

class ForkProvider extends React.Component<ForkProviderConfig> {
  constructor(props: ForkProviderConfig) {
    super(props)
    this.push = this.push.bind(this)
    this.validate = this.validate.bind(this)
    this.registerSection = this.registerSection.bind(this)
  }

  shouldComponentUpdate(np: ForkProviderConfig) {
    let k: keyof ForkProviderConfig
    let shouldUpdate = false
    for (k in np) {
      if (shouldUpdate) break
      if (ignoreProps.includes(k)) continue
      shouldUpdate = isEqual(np[k], this.props[k])
    }
    return shouldUpdate
  }

  componentWillUnmount() {
    const { unregisterSection, path } = this.props
    unregisterSection(path, this.validate)
  }

  registerSection() {
    const { path, registerSection } = this.props
    registerSection(path, this.validate)
  }

  validate(formValue: any, ret: FormErrors) {
    const { path, validators, name } = this.props
    const errors: string[] = []

    if (validators.length === 0) {
      return errors
    }

    const nextValue = _.get(formValue, path)
    for (let test of validators) {
      const error = test(nextValue, formValue, name)
      if (typeof error === 'string') {
        errors.push(error)
      }
    }

    return errors
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

  _render(incomingProps: FormProvider<any>) {
    const { children, name, validators = [] } = this.props
    const {
      value = {},
      touched = {},
      visited = {},
      errors = {},
      defaultValue = {},
      initialValue = {},
      path = [],
      activeField,
      ...props
    } = incomingProps

    const nextPath = [...path, name]

    return (
      <ForkProvider
        {...props}
        name={name}
        validators={validators}
        activeField={activeField}
        value={value[name]}
        initialValue={initialValue[name]}
        defaultValue={defaultValue[name]}
        errors={errors[name] as FormErrors}
        touched={touched[name] as Touched}
        visited={visited[name] as Visited}
        path={nextPath}
      >
        {children}
      </ForkProvider>
    )
  }

  render() {
    return <Consumer>{this._render}</Consumer>
  }
}
