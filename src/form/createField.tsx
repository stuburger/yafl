import * as React from 'react'
import { isEqual } from '../utils'
import AbsentField from '../AbsentField'
import {
  ProviderValue,
  FormFieldProps,
  InnerFieldProps,
  TypedFormFieldProps,
  FieldProps,
  InputProps,
  FieldMeta,
  FieldUtils,
  FieldState
} from '../'
import { getInitialFieldState } from './getInitialState'

function wrapConsumer<T, K extends keyof T = keyof T>(
  Consumer: React.Consumer<ProviderValue<T, K>>
): React.ComponentClass<FormFieldProps<T, K>> {
  const InnerField = getInnerField<T, K>()
  const emptyArray = []

  return class FormField extends React.Component<FormFieldProps<T, K>> {
    constructor(props) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render({ fields, loaded, formIsDirty, ...provider }: ProviderValue<T, K>) {
      const { render, component, name, validators, initialValue, ...props } = this.props
      const state: FieldState<T[K]> = fields[name] || getInitialFieldState(initialValue)
      const validation = provider.validation[name] || emptyArray

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
          initialValue={initialValue}
          touch={provider.touch}
          submit={provider.submit}
          unload={provider.unload}
          untouch={provider.untouch}
          clearForm={provider.clearForm}
          submitting={provider.submitting}
          forgetState={provider.forgetState}
          submitCount={provider.submitCount}
          onFieldBlur={provider.onFieldBlur}
          setFieldValue={provider.setFieldValue}
          registerField={provider.registerField}
          registerValidator={provider.registerValidator}
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
    constructor(props: InnerFieldProps<T, P>) {
      super(props)
      this.onChange = this.onChange.bind(this)
      this.onBlur = this.onBlur.bind(this)
      this.setValue = this.setValue.bind(this)
      this.touch = this.touch.bind(this)
      this.untouch = this.untouch.bind(this)
      this.collectInputProps = this.collectInputProps.bind(this)
      this.collectMetaProps = this.collectMetaProps.bind(this)
      this.collectUtilProps = this.collectUtilProps.bind(this)
      this.collectProps = this.collectProps.bind(this)
      const { registerField, name, initialValue = props.value, validators } = props
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

    collectInputProps(): InputProps<T, P> {
      return {
        name: this.props.name,
        value: this.props.value,
        onBlur: this.onBlur,
        onChange: this.onChange
      }
    }

    collectMetaProps(): FieldMeta<T, P> {
      const { validation = emptyArray, ...props } = this.props

      return {
        didBlur: props.didBlur,
        isDirty: props.isDirty,
        touched: props.touched,
        submitCount: props.submitCount,
        loaded: props.loaded,
        submitting: props.submitting,
        isValid: validation.length === 0,
        messages: validation,
        originalValue: props.originalValue
      }
    }

    collectUtilProps(): FieldUtils<T, P> {
      return {
        touch: this.touch,
        untouch: this.untouch,
        unload: this.props.unload,
        submit: this.props.submit,
        setFieldValue: this.props.setFieldValue,
        setValue: this.setValue,
        forgetState: this.props.forgetState,
        clearForm: this.props.clearForm
      }
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
        input: this.collectInputProps(),
        meta: this.collectMetaProps(),
        utils: this.collectUtilProps(),
        forward: props
      }
    }

    render() {
      console.log(this.props.value)
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
