import * as React from 'react'
import * as _ from 'lodash'
import {
  FormMeta,
  Name,
  FormProvider,
  Validator,
  ValidateOn,
  FormState,
  FormErrors,
  FieldValidator
} from './sharedTypes'
import { Consumer } from './Context'
import { isEqual, toArray, incl, conv } from './utils'

export interface InputProps<T = any> {
  name: Name
  value: any
  onBlur: (e: React.FocusEvent<any>) => void
  onFocus: (e: React.FocusEvent<any>) => void
  onChange: (e: React.ChangeEvent<any>) => void
}

export interface FieldProps<T = any> {
  input: InputProps<T>
  field: FieldMeta<T>
  form: FormMeta<T>
  [key: string]: any
}

export interface FieldConfig<T = any> {
  name: Name
  validate?: Validator<T>[]
  validateOn?: ValidateOn<T>
  render?: (state: FieldProps<T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T>>
  [key: string]: any
}

export interface FieldMeta<T = any> {
  visited: boolean
  isDirty: boolean
  touched: boolean
  isActive: boolean
  isValid: boolean
  errors: string[]
  initialValue: any
  defaultValue: any
  setValue: (value: any) => void
  setVisited: (value: boolean) => void
  setTouched: (value: boolean) => void
}

export interface InnerFieldProps<T extends object = {}> extends FormProvider<any> {
  name: Name
  formValue: T
  value: any
  initialValue: any
  validate: FieldValidator<T>
  forwardProps: { [key: string]: any }
  validateOn: ValidateOn<T>
  render?: (state: FieldProps<T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T>>
}

const listenForProps: (keyof InnerFieldProps)[] = [
  'errors',
  'name',
  'value',
  'touched',
  'visited',
  'validate',
  'validateOn',
  'forwardProps'
]

class FieldConsumer extends React.Component<InnerFieldProps> {
  constructor(props: InnerFieldProps) {
    super(props)
    this.registerField = this.registerField.bind(this)
    this.unregisterField = this.unregisterField.bind(this)
    this.setValue = this.setValue.bind(this)
    this.touchField = this.touchField.bind(this)
    this.visitField = this.visitField.bind(this)
    this.validate = this.validate.bind(this)
    this.shouldValidate = this.shouldValidate.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.collectProps = this.collectProps.bind(this)
    this.registerField()
  }

  shouldComponentUpdate(nextProps: InnerFieldProps) {
    return listenForProps.some(key => !isEqual(nextProps[key], this.props[key]))
  }

  componentDidUpdate(pp: InnerFieldProps) {
    const { registeredFields, path, name } = this.props
    if (pp.name !== name || !registeredFields[conv.toString(path)]) {
      this.registerField()
    }
  }

  componentWillUnmount() {
    this.unregisterField()
  }

  registerField(): void {
    const { registerField, path } = this.props
    registerField(path, 'field', { validate: this.validate, shouldValidate: this.shouldValidate })
  }

  unregisterField(): void {
    const { path, unregisterField } = this.props
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
        (state.visited && incl(validateOn, 'blur')) ||
        (state.touched && incl(validateOn, 'change')) ||
        (state.submitCount > 0 && incl(validateOn, 'submit'))
      )
    }
  }

  validate(state: FormState, ret: FormErrors): string[] {
    const { validate, path, name } = this.props
    const validators = toArray(validate)
    let errors: string[] = []
    const value = _.get(state.formValue, path)
    errors = validators.reduce((ret, validate) => {
      const result = validate(value, state.formValue, name)
      return result === undefined ? ret : [...ret, ...toArray(result)]
    }, errors)

    if (ret && errors.length) {
      _.set(ret, path, errors)
    }

    return errors
  }

  setValue(value: any): void {
    const { path, setValue } = this.props
    setValue(path, value)
  }

  touchField(touched: boolean): void {
    const { touchField, path } = this.props
    touchField(path, touched)
  }

  visitField(visited: boolean): void {
    const { visitField, path } = this.props
    visitField(path, visited)
  }

  onChange(e: React.ChangeEvent<any>) {
    const { forwardProps } = this.props
    if (forwardProps.onChange) {
      forwardProps.onChange(e)
    }
    if (e.isDefaultPrevented()) return
    this.setValue(e.target.value)
  }

  onFocus(e: React.FocusEvent<any>): void {
    const { forwardProps, setActiveField, path } = this.props
    if (forwardProps.onFocus) {
      forwardProps.onFocus(e)
    }
    setActiveField(conv.toString(path))
  }

  onBlur(e: React.FocusEvent<any>) {
    const { visited, setActiveField, forwardProps } = this.props
    if (forwardProps.onBlur) {
      forwardProps.onBlur(e)
    }
    setActiveField(null)
    if (visited || e.isDefaultPrevented()) return
    this.visitField(true)
  }

  collectProps(): FieldProps {
    const p = this.props
    const input: InputProps = {
      name: p.name,
      value: p.value,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange
    }

    const field: FieldMeta = {
      errors: (p.errors || []) as any,
      visited: !!p.visited,
      touched: !!p.touched,
      setValue: this.setValue,
      setTouched: this.touchField,
      setVisited: this.visitField,
      initialValue: p.initialValue,
      defaultValue: p.defaultValue,
      isValid: ((p.errors || []) as any).length === 0,
      isActive: p.activeField === conv.toString(p.path),
      isDirty: p.formIsDirty && p.initialValue === p.value
    }

    const form: FormMeta = {
      submitting: p.submitting,
      loaded: p.loaded,
      resetForm: p.resetForm,
      submit: p.onSubmit,
      setFormValue: p.setFormValue,
      forgetState: p.forgetState,
      setVisited: p.setVisited,
      setTouched: p.setTouched,
      clearForm: p.clearForm,
      visitField: p.visitField,
      touchField: p.touchField
    }

    return { input, field, form, ...p.forwardProps }
  }

  render() {
    const { render, component: Component } = this.props

    const props = this.collectProps()
    if (Component) {
      return <Component {...props} />
    }

    if (render) {
      return render(props)
    }
    return null
  }
}

const emptyValidators: Validator<any>[] = []

class Field extends React.PureComponent<FieldConfig> {
  constructor(props: FieldConfig) {
    super(props)
    this._render = this._render.bind(this)
  }

  _render(ip: FormProvider) {
    const {
      name,
      render,
      children,
      component,
      validateOn = ip.validateOn || 'blur',
      validate = emptyValidators,
      ...forwardProps
    } = this.props

    const { value, errors, touched, visited, initialValue, defaultValue, ...props } = ip

    return (
      <FieldConsumer
        {...props}
        name={name}
        render={render}
        children={children}
        component={component}
        validate={validate}
        path={ip.path.concat(name)}
        validateOn={validateOn}
        forwardProps={forwardProps}
        value={value && value[name]}
        errors={errors && (errors as any)[name]}
        touched={touched && (touched as any)[name]}
        visited={visited && (visited as any)[name]}
        initialValue={initialValue && initialValue[name]}
        defaultValue={defaultValue && defaultValue[name]}
      />
    )
  }

  render() {
    return <Consumer>{this._render}</Consumer>
  }
}

export default Field
