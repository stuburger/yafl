import * as React from 'react'
import { Provider, Consumer } from './Context'
import { isEqual, toArray, incl, conv } from './utils'
import * as _ from 'lodash'
import {
  Name,
  FormProvider,
  FormErrors,
  FormState,
  ValidateOn,
  FieldValidator
} from './sharedTypes'

export interface ArrayHelpers<T = any> {
  push: (value: any) => void
}

export interface ForkProviderConfig<T extends object = {}> extends FormProvider<T> {
  name: Name
  validate: FieldValidator<T>
  validateOn: ValidateOn<T>
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

export interface SectionConfig<T extends object = {}> {
  name: Name
  defaultValue?: any
  validateOn?: ValidateOn<T>
  validate: FieldValidator<T>
  children: React.ReactNode | ((value: any, utils: ArrayHelpers<T>) => React.ReactNode)
}

const listenForProps: (keyof ForkProviderConfig)[] = [
  'activeField',
  'value',
  'touched',
  'visited',
  'errors',
  'validate',
  'validateOn'
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
    const { registeredFields, path, name } = this.props
    if (pp.name !== name || !registeredFields[conv.toString(path)]) {
      this.registerField()
    }
  }

  componentWillUnmount() {
    const { unregisterField, path } = this.props
    unregisterField(path)
  }

  shouldValidate(state: FormState): boolean {
    const { name, path, validateOn, initialValue, validate } = this.props
    if (!validate || !validate.length) return false
    if (typeof validateOn === 'function') {
      return validateOn(
        {
          name,
          value: _.get(path, state.formValue),
          touched: _.get(state.touched, path) as any, // todo
          visited: _.get(state.visited, path) as any,
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
    const { validate = [], path, name } = this.props
    let errors: string[] = []
    const validators = toArray(validate)
    const value = _.get(state.formValue, path)
    errors = validators.reduce((ret, validate) => {
      const result = validate(value, state.formValue, name)
      return result === undefined ? ret : [...ret, ...toArray(result)]
    }, errors)

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

  _render(incomingProps: FormProvider) {
    const { children, name, validate, validateOn = 'blur' } = this.props
    const {
      path,
      value = {},
      errors = {},
      touched = {},
      visited = {},
      defaultValue = {},
      initialValue = {},
      ...props
    } = incomingProps

    // todo what if value is null for a section and not undefined.
    // yafl needs to make a guarentee that every section has a value,
    // which is ALWAYS either an array or an object
    return (
      <ForkProvider
        {...props}
        name={name}
        validate={validate}
        value={value[name]}
        validateOn={validateOn}
        touched={touched[name]}
        visited={visited[name]}
        path={path.concat(name)}
        errors={(errors as any)[name]}
        initialValue={initialValue[name]}
        defaultValue={defaultValue[name]}
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
