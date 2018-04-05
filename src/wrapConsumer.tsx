import * as React from 'react'
import { ProviderValue, FormFieldProps, FieldState, InnerFieldProps } from 'types/index'

const defaultFieldState: FieldState = {
  value: '',
  originalValue: '',
  isValid: false,
  isDirty: false,
  didBlur: false,
  isTouched: false
}

function wrapConsumer<T>(Consumer: React.Consumer<ProviderValue<T>>) {
  const InnerField = getInnerField<T>()

  return class FormField extends React.Component<FormFieldProps<T>> {
    _render = (state: ProviderValue<T>) => {
      const { name, render, validators = [] } = this.props
      const value = state.loaded ? state.value[name] : defaultFieldState
      return (
        <InnerField
          {...value}
          name={name}
          submit={state.submit}
          validators={validators}
          setFieldValue={state.setFieldValue}
          validationResult={state.validateField(name, value)}
          registerValidator={state.registerValidator}
          render={render}
        />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}

function getInnerField<T>() {
  return class InnerField extends React.Component<InnerFieldProps<T>> {
    state = { isMounted: false }
    componentDidMount() {
      const { registerValidator, name, validators = [] } = this.props
      registerValidator(name, validators)
    }

    onChange = e => {
      const { setFieldValue, name } = this.props
      setFieldValue(name, e.target.value)
    }

    componentDidUpdate(pp) {
      const { validators = [], registerValidator, name } = this.props
      if (validators !== pp.validators) {
        registerValidator(name, validators)
      }
    }

    render() {
      const { render, value, isDirty, submit, validationResult } = this.props
      return render({
        value,
        isDirty,
        submit,
        onChange: this.onChange,
        validation: validationResult
      })
    }
  }
}

export default wrapConsumer
