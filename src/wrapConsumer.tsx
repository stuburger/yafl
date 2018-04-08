import * as React from 'react'
import { ProviderValue, FormFieldProps, FieldState, InnerFieldProps } from './types/index'
import AbsentField from './AbsentField'

const defaultFieldState: FieldState = {
  value: '',
  originalValue: '',
  didBlur: false,
  isTouched: false
}

function isEqual(val1, val2): boolean {
  return val1 === val2 || JSON.stringify(val1) === JSON.stringify(val2)
}

function wrapConsumer<T>(Consumer: React.Consumer<ProviderValue<T>>) {
  const InnerField = getInnerField<T>()
  const emptyValidators = []

  return class FormField extends React.Component<FormFieldProps<T>> {
    _render = ({ value, loaded, ...providerValue }: ProviderValue<T>) => {
      const { render, component, name, validators = emptyValidators, ...props } = this.props
      if (loaded && value[name] === undefined) {
        return <AbsentField name={name} />
      }
      const state = loaded ? value[name] : defaultFieldState
      return (
        <InnerField
          {...state}
          {...props}
          name={name}
          state={state}
          render={render}
          component={component}
          validators={validators}
          submit={providerValue.submit}
          clearForm={providerValue.clearForm}
          submitCount={providerValue.submitCount}
          onFieldBlur={providerValue.onFieldBlur}
          validation={providerValue.validation[name]}
          setFieldValue={providerValue.setFieldValue}
          isDirty={isEqual(state.originalValue, state.value)}
          registerValidator={providerValue.registerValidator}
        />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}

function getInnerField<T>() {
  const emptyArray = []
  class InnerField extends React.Component<InnerFieldProps<T>> {
    componentDidMount() {
      const { registerValidator, name, validators = emptyArray } = this.props
      registerValidator(name, validators)
    }

    componentDidUpdate(pp: InnerFieldProps<T>) {
      const { validators, registerValidator, name } = this.props
      if (validators !== pp.validators) {
        registerValidator(name, validators)
      }
    }

    onBlur = e => {
      const { onFieldBlur, name, onBlur } = this.props
      onFieldBlur(name)
      if (onBlur) {
        onBlur(e)
      }
    }

    onChange = e => {
      const { setFieldValue, name } = this.props
      setFieldValue(name, e.target.value)
    }

    collectProps = () => {
      const { validation = emptyArray, ...props } = this.props
      return {
        ...props,
        validation: {
          isValid: validation.length === 0,
          messages: validation
        },
        onBlur: this.onBlur,
        onChange: this.onChange
      }
    }

    render() {
      const { render, component: Component, name } = this.props

      const props = this.collectProps()
      if (render) {
        return render(props)
      }

      if (Component) {
        return <Component {...props} />
      }

      return (
        <AbsentField message={`Please provide render or component prop for field: '${name}'`} />
      )
    }
  }

  return InnerField
}

export default wrapConsumer
