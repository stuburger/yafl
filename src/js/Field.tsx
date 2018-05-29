import React, { Component } from 'react'
import { Consumer } from './Context'
import { InnerFieldProps, FieldConfig, FormErrors } from '../sharedTypes'
import { get, set } from 'lodash'

// formValue here cannot be accessed via this.props.formValue
// since this function is only called in the parent form to
// compute form errors (errors are not stored in state)
class FieldConsumer extends Component<InnerFieldProps> {
  constructor(props: InnerFieldProps) {
    super(props)
    this.registerField = this.registerField.bind(this)
    this.unregisterField = this.unregisterField.bind(this)
    this.setValue = this.setValue.bind(this)
    this.touchField = this.touchField.bind(this)
    this.visitField = this.visitField.bind(this)
    this.validate = this.validate.bind(this)
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
    const nextValue = get(formValue, path)
    const errors = validators
      .map(test => test(nextValue, formValue, name))
      .filter(x => x !== undefined)

    if (ret) {
      set(ret, path, errors)
    }

    return errors as string[]
  }

  setValue(value: any): void {
    const { path, setValue } = this.props
    setValue(path, value, this.validate)
  }

  touchField(touched: boolean): void {
    const { touchField, path } = this.props
    touchField(path, touched)
  }

  visitField(visited: boolean): void {
    const { visitField, path } = this.props
    visitField(path, visited)
  }

  render() {
    const { render, component: Component, ...props } = this.props

    if (Component) {
      return <Component {...props} />
    }

    if (render) {
      return render({
        ...props,
        setValue: this.setValue,
        onBlur: this.visitField
      })
    }
    return null
  }
}

export default class Field extends Component<FieldConfig> {
  render() {
    const { name, validators, render } = this.props
    return (
      <Consumer>
        {props => (
          <FieldConsumer
            name={name}
            validators={validators}
            {...props}
            path={props.path.concat([name])}
            value={props.value[name]}
            render={render}
          />
        )}
      </Consumer>
    )
  }
}
