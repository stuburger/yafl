import React, { Component } from 'react'
import { Consumer } from './Context'
import {
  FormErrors,
  Name,
  Validator,
  ValidatorConfig,
  Provider as P,
  Blurred,
  Touched,
  Path
} from '../sharedTypes'
import * as _ from 'lodash'
import { isEqual } from '../utils'

export interface InputProps<T = any> {
  name: Name
  value: any
  onBlur: (e: React.FocusEvent<any>) => void
  onFocus: (e: React.FocusEvent<any>) => void
  onChange: (e: React.ChangeEvent<any>) => void
}

export interface FieldProps<T = any> {
  input: InputProps<T>
  meta: FieldMeta<T>
  utils: FieldUtils<T>
  [key: string]: any
}

export interface FieldConfig<T = any> {
  name: Name
  validators?: Validator<T>[]
  render?: (state: FieldProps<T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T>>
  [key: string]: any
}

export interface FieldUtils<T = any> {
  resetForm: () => void
  submit: () => void
  setFormValue: ((value: Partial<T>, overwrite: boolean) => void)
  forgetState: () => void
  clearForm: () => void
  setValue: (value: any) => void
}

export interface FieldMeta<T = any> {
  visited: Blurred<T>
  isDirty: boolean
  touched: Touched<T>
  isActive: boolean
  activeField: Path
  submitCount: number
  loaded: boolean
  submitting: boolean
  isValid: boolean
  errors: string[]
  initialValue: any
  defaultValue: any
}

export interface InnerFieldProps<T = any> extends P<T>, Partial<ValidatorConfig<T>> {
  name: Name
  formValue: T
  value: any
  errors: any // string[]
  initialValue: any
  validators: Validator<T>[]
  forwardProps: { [key: string]: any }
  render?: (state: FieldProps<T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T>>
}

class FieldConsumer extends Component<InnerFieldProps> {
  constructor(props: InnerFieldProps) {
    super(props)
    this.registerField = this.registerField.bind(this)
    this.unregisterField = this.unregisterField.bind(this)
    this.setValue = this.setValue.bind(this)
    this.touchField = this.touchField.bind(this)
    this.visitField = this.visitField.bind(this)
    this.validate = this.validate.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.collectProps = this.collectProps.bind(this)
    this.registerField()
  }

  registerField(): void {
    const { registerField, path } = this.props
    registerField(path, this.validate)
  }

  unregisterField(): void {
    const { path, unregisterField } = this.props
    unregisterField(path)
  }

  validate(formValue: any, ret: FormErrors): string[] {
    const { name, path, validators = [] } = this.props
    const nextValue = _.get(formValue, path)
    const errors = validators
      .map(test => test(nextValue, formValue, name))
      .filter(x => x !== undefined)

    if (ret) {
      _.set(ret, path, errors)
    }

    return errors as string[]
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
    const { forwardProps } = this.props
    if (forwardProps.onFocus) {
      forwardProps.onFocus(e)
    }
    // this.setActiveField() todo
  }

  onBlur(e: React.FocusEvent<any>) {
    const { blurred, forwardProps } = this.props
    if (forwardProps.onBlur) {
      forwardProps.onBlur(e)
    }
    // this.setActiveField(null) todo
    if (blurred || e.isDefaultPrevented()) return
    this.visitField(true)
  }

  collectProps(): FieldProps {
    const {
      name,
      formValue,
      value,
      visitField,
      touchField,
      resetForm,
      onSubmit,
      setFormValue,
      forgetState,
      clearForm,
      blurred,
      setValue,
      formIsDirty,
      active,
      touched,
      submitCount,
      submitting,
      errors = [],
      initialFormValue,
      initialValue,
      defaultValue,
      path,
      render,
      loaded,
      component,
      ...props
    } = this.props

    const input: InputProps = {
      name,
      value,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange
    }

    const meta: FieldMeta = {
      visited: blurred,
      touched,
      activeField: active,
      isActive: isEqual(active, path),
      submitCount,
      isDirty: formIsDirty || isEqual(initialValue, formValue),
      errors,
      isValid: errors.length === 0,
      loaded,
      submitting,
      initialValue,
      defaultValue
    }

    const utils: FieldUtils = {
      resetForm,
      submit: onSubmit,
      setFormValue,
      forgetState,
      clearForm,
      setValue: this.setValue
    }

    return { input, meta, utils, ...props }
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

export default class Field extends Component<FieldConfig<any>> {
  render() {
    const { name, validators = [], render, component, children, ...forwardProps } = this.props
    return (
      <Consumer>
        {props => (
          <FieldConsumer
            {...props}
            name={name}
            validators={validators}
            path={props.path.concat([name])}
            value={props.value[name]}
            render={render}
            component={component}
            children={children}
            forwardProps={forwardProps}
          />
        )}
      </Consumer>
    )
  }
}
