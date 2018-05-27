import React, { Component } from 'react'
import { FormContextConsumer } from './Context'

class BaseConsumer extends Component {
  constructor(props) {
    super(props)
    this.registerField = this.registerField.bind(this)
    this.unregisterField = this.unregisterField.bind(this)
    this.setValue = this.setValue.bind(this)
    this.touchField = this.touchField.bind(this)
    this.visitField = this.visitField.bind(this)
    this.validate = this.validate.bind(this)
    this.registerField()
  }

  registerField() {
    const { registerField, path, validators = [], name } = this.props
    registerField(path, this.validate)
  }

  unregisterField() {
    const { path, unregisterField } = this.props
    unregisterField(path)
  }

  validate(value, formValue) {
    const { name, validators = [] } = this.props
    return validators.map(test => test(value, formValue, name)).filter(x => x)
  }

  setValue(value) {
    const { path, setValue } = this.props
    setValue(path, value, this.validate)
  }

  touchField() {
    const { touchField, path } = this.props
    touchField(path)
  }

  visitField() {
    const { visitField, path } = this.props
    visitField(path)
  }

  render() {
    const { render, ...props } = this.props
    return render({
      ...props,
      setValue: this.setValue,
      onBlur: this.visitField
    })
  }
}

export default class Field extends Component {
  render() {
    const { name, validators, render } = this.props
    return (
      <FormContextConsumer>
        {props => (
          <BaseConsumer
            name={name}
            validators={validators}
            {...props}
            path={props.path.concat([name])}
            value={props.value[name]}
            render={render}
          />
        )}
      </FormContextConsumer>
    )
  }
}
