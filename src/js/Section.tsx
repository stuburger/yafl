import * as React from 'react'
import { Provider, Consumer } from './Context'
import { isEqual } from '../utils'
import { Name, Path, FormProvider, FormErrors, Validator, Visited, Touched } from '../sharedTypes'

export interface ArrayHelpers<T = any> {
  push: (value: any) => void
}

export interface ForkProviderConfig<T = any> extends FormProvider<T> {
  name: Name
  validators: Validator<T>[]
  setErrors: ((path: Path, errors: string[]) => void)
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

export interface SectionConfig<T = any> {
  name: Name
  defaultValue?: any
  validators?: Validator<T>[]
  setErrors: ((path: Path, errors: string[]) => void)
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

const listenForProps: (keyof ForkProviderConfig)[] = ['activeField', 'value', 'touched', 'visited']

class ForkProvider extends React.Component<ForkProviderConfig> {
  constructor(props: ForkProviderConfig) {
    super(props)
    this.push = this.push.bind(this)
    this.validate = this.validate.bind(this)
    this.registerField = this.registerField.bind(this)
    this.registerField()
  }

  shouldComponentUpdate(nextProps: ForkProviderConfig) {
    return true || listenForProps.some(key => !isEqual(nextProps[key], this.props[key]))
  }

  componentDidMount() {
    this.validate()
  }

  componentDidUpdate() {
    this.validate()
  }

  componentWillUnmount() {
    const { unregisterField, path } = this.props
    unregisterField(path) // 'section'
  }

  registerField() {
    const { path, registerField } = this.props
    registerField(path, 'section')
  }

  validate() {
    const { path, setErrors, errors = {}, value, validators, formValue, name } = this.props
    if (validators.length === 0) return
    const nextErrors: string[] = []

    for (let test of validators) {
      const error = test(value, formValue, name)
      if (typeof error === 'string') {
        nextErrors.push(error)
      }
    }
    const sectionErrors = (errors as any)._errors || []
    if (!isEqual(nextErrors, sectionErrors)) {
      setErrors([...path, '_errors'], nextErrors)
    }
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

class Section extends React.PureComponent<SectionConfig> {
  constructor(props: SectionConfig) {
    super(props)
    this._render = this._render.bind(this)
  }

  _render(incomingProps: FormProvider<any>) {
    const { children, name, validators = [] } = this.props
    const {
      value = {},
      errors = {},
      formErrors = {},
      touched = {},
      visited = {},
      defaultValue = {},
      initialValue = {},
      path = [],
      activeField,
      ...props
    } = incomingProps

    const nextPath = [...path, name]
    // todo what if value is null for a section and not undefined.
    // yafl needs to make a guarentee that every section has a value,
    // which is ALWAYS either an array or an object
    return (
      <ForkProvider
        {...props}
        name={name}
        validators={validators}
        activeField={activeField}
        value={value[name]}
        touched={touched[name] as Touched}
        visited={visited[name] as Visited}
        initialValue={initialValue[name]}
        defaultValue={defaultValue[name]}
        errors={errors[name] as FormErrors}
        formErrors={formErrors[name] as FormErrors}
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

export default Section
