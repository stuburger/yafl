import * as React from 'react'
import { Provider, Consumer } from './Context'
import { isEqual, toArray, incl } from './utils'
import * as _ from 'lodash'
import {
  Name,
  FormProvider,
  FormErrors,
  Validator,
  Visited,
  Touched,
  FormState,
  ValidateOn
} from './sharedTypes'

export interface ArrayHelpers<T = any> {
  push: (value: any) => void
}

export interface ForkProviderConfig<T = any> extends FormProvider<T> {
  name: Name
  validators: Validator<T>[]
  validateOn: ValidateOn<T>
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

export interface SectionConfig<T = any> {
  name: Name
  defaultValue?: any
  validateOn?: ValidateOn<T>
  validators?: Validator<T>[]
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

const listenForProps: (keyof ForkProviderConfig)[] = [
  'activeField',
  'value',
  'touched',
  'visited',
  'errors'
]

class ForkProvider extends React.Component<ForkProviderConfig> {
  constructor(props: ForkProviderConfig) {
    super(props)
    this.push = this.push.bind(this)
    this.validate = this.validate.bind(this)
    this.registerField = this.registerField.bind(this)
    this.shouldValidate = this.shouldValidate.bind(this)
    this.registerField()
  }

  shouldComponentUpdate(nextProps: ForkProviderConfig) {
    return listenForProps.some(key => !isEqual(nextProps[key], this.props[key]))
  }

  componentDidUpdate(pp: ForkProviderConfig) {
    const { registeredFields, path } = this.props
    if (!registeredFields[path.join('.')]) {
      this.registerField()
    }
  }

  componentWillUnmount() {
    const { unregisterField, path } = this.props
    unregisterField(path)
  }

  shouldValidate(state: FormState): boolean {
    const { name, path, validateOn, initialValue, validators } = this.props
    if (!validators || !validators.length) return false
    if (typeof validateOn === 'function') {
      return validateOn(
        {
          name,
          value: _.get(state.formValue, path),
          touched: !!_.get(path, state.touched as any), // todo
          visited: !!_.get(path, state.visited as any),
          originalValue: initialValue
        },
        name,
        {
          visited: state.visited,
          touched: state.touched,
          initialValue: state.initialFormValue
        }
      )
    } else {
      return (
        (!!state.visited && incl(validateOn, 'blur')) ||
        (!!state.touched && incl(validateOn, 'change')) ||
        (state.submitCount > 0 && incl(validateOn, 'submit'))
      )
    }
  }

  registerField() {
    const { path, registerField } = this.props
    registerField(path, 'section', { validate: this.validate, shouldValidate: this.shouldValidate })
  }

  validate(state: FormState, ret: FormErrors): string[] {
    const { validators = [], path, name } = this.props
    let errors: string[] = []
    const value = _.get(state.formValue, path)
    errors = validators.reduce(
      (ret, validate) => {
        const result = validate(value, state.formValue, name)
        return result === undefined ? ret : [...ret, ...toArray(result)]
      },
      [] as string[]
    )

    if (ret && errors.length) {
      _.set(ret, path.concat('_error'), errors)
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
