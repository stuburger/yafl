import * as React from 'react'
import { isEqual } from '../utils'
import AbsentField from '../AbsentField'
import {
  ProviderValue,
  FormFieldProps,
  FieldState,
  InnerFieldProps,
  TypedFormFieldProps,
  FieldProps
} from '../'
import { getInitialFieldState } from './getInitialState'

const defaultFieldState: FieldState<null> = getInitialFieldState(null)

function wrapConsumer<T, K extends keyof T = keyof T>(
  Consumer: React.Consumer<ProviderValue<T, K>>
): React.ComponentClass<FormFieldProps<T, K>> {
  const InnerField = getInnerField<T, K>()
  const emptyArray = []

  return class FormField extends React.Component<FormFieldProps<T, K>> {
    _render = ({ value, loaded, formIsDirty, ...providerValue }: ProviderValue<T, K>) => {
      const { render, component, name, validators, ...props } = this.props
      const state = value[name] || defaultFieldState
      const validation = providerValue.validation[name] || emptyArray

      return (
        <InnerField
          {...state}
          {...props}
          name={name}
          loaded={loaded}
          render={render}
          component={component}
          validation={validation}
          validators={validators}
          formIsDirty={formIsDirty}
          touch={providerValue.touch}
          submit={providerValue.submit}
          unload={providerValue.unload}
          untouch={providerValue.untouch}
          clearForm={providerValue.clearForm}
          submitting={providerValue.submitting}
          forgetState={providerValue.forgetState}
          submitCount={providerValue.submitCount}
          onFieldBlur={providerValue.onFieldBlur}
          setFieldValue={providerValue.setFieldValue}
          registerField={providerValue.registerField}
          registerValidator={providerValue.registerValidator}
          isDirty={formIsDirty && !isEqual(state.originalValue, state.value)}
        />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}

export function getTypedField<T, P extends keyof T = keyof T>(
  Consumer: React.Consumer<ProviderValue<T, P>>,
  fieldName: P,
  component?: React.ComponentType<FieldProps<T, P>>
): React.ComponentClass<TypedFormFieldProps<T, P>> {
  const FormField = wrapConsumer<T, P>(Consumer)
  return class TypedField extends React.Component<TypedFormFieldProps<T, P>> {
    render() {
      return <FormField component={component} {...this.props} name={fieldName} />
    }
  }
}

function getInnerField<T, P extends keyof T = keyof T>() {
  const emptyArray = []
  class InnerField extends React.Component<InnerFieldProps<T, P>> {
    constructor(props) {
      super(props)
      this.onChange = this.onChange.bind(this)
      this.onBlur = this.onBlur.bind(this)
      this.setValue = this.setValue.bind(this)
      this.touch = this.touch.bind(this)
      this.untouch = this.untouch.bind(this)
      this.collectProps = this.collectProps.bind(this)
    }

    componentDidMount() {
      const { registerField, name, initialValue = null, validators } = this.props
      registerField(name, initialValue, validators || emptyArray)
    }

    componentDidUpdate(pp: InnerFieldProps<T, P>) {
      const { validators = emptyArray, registerValidator, name } = this.props
      if (validators !== pp.validators) {
        registerValidator(name, validators)
      }
    }

    onBlur(e) {
      const { onFieldBlur, name, onBlur } = this.props
      onFieldBlur(name)
      if (onBlur) {
        onBlur(e)
      }
    }

    onChange(e) {
      this.setValue(e.target.value)
    }

    setValue(value: T[P]) {
      const { setFieldValue, name } = this.props
      setFieldValue(name, value)
    }

    touch(name = this.props.name) {
      const { touch } = this.props
      touch(this.props.name)
    }

    untouch(name = this.props.name) {
      const { untouch } = this.props
      untouch(name)
    }

    collectProps(): FieldProps<T, P> {
      const {
        touch,
        untouch,
        render,
        component,
        initialValue,
        registerField,
        registerValidator,
        validation = emptyArray,
        ...props
      } = this.props
      return {
        // spread safe: input, forwardedProps
        // spread unsafe: meta, utils

        input: {
          name: this.props.name,
          value: this.props.value,
          onBlur: this.onBlur,
          onChange: this.onChange
        },
        meta: {
          didBlur: this.props.didBlur,
          isDirty: this.props.isDirty,
          touched: this.props.touched,
          submitCount: this.props.submitCount,
          loaded: this.props.loaded,
          submitting: this.props.submitting,
          isValid: validation.length === 0,
          messages: validation,
          originalValue: this.props.originalValue
        },
        utils: {
          touch: this.touch,
          untouch: this.untouch,
          unload: this.props.unload,
          submit: this.props.submit,
          setFieldValue: this.props.setFieldValue,
          setValue: this.setValue,
          forgetState: this.props.forgetState,
          clearForm: this.props.clearForm
        },
        forward: props
      }
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

      return (
        <AbsentField
          message={`Please provide render or component prop for field: '${this.props.name}'`}
        />
      )
    }
  }

  return InnerField
}

export default wrapConsumer
