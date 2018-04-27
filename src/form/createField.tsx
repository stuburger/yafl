import * as React from 'react'
import { isEqual } from '../utils'
import AbsentField from '../AbsentField'
import { InnerFieldProps, ProviderValueLoaded } from '../internal'
import {
  FormFieldProps,
  TypedFormFieldProps,
  FieldProps,
  InputProps,
  FieldMeta,
  FieldUtils
} from '../export'
import { isDirty } from './fieldStateHelpers'

function wrapConsumer<T, K extends keyof T = keyof T>(
  Consumer: React.Consumer<ProviderValueLoaded<T, K>>
): React.ComponentClass<FormFieldProps<T, K>> {
  const InnerField = getInnerField<T, K>()
  const emptyArray = []

  return class FormField extends React.Component<FormFieldProps<T, K>> {
    constructor(props) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(provider: ProviderValueLoaded<T, K>) {
      const { fields } = provider
      const {
        name,
        render,
        component,
        initialValue,
        validators = emptyArray,
        ...props
      } = this.props

      return (
        <InnerField
          name={name}
          validators={validators}
          initialValue={initialValue}
          render={render}
          component={component}
          field={fields[name]}
          provider={provider}
          forwardProps={props}
        />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}

export function getTypedField<T, P extends keyof T = keyof T>(
  Consumer: React.Consumer<ProviderValueLoaded<T, P>>,
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

      const { name, validators, initialValue = props.field.value, provider } = props
      provider.registerField(name, initialValue, validators)
    }

    shouldComponentUpdate(nextProps: InnerFieldProps<T, P>) {
      const { provider } = this.props
      const validation = provider.validation[name] || emptyArray
      return (
        !isEqual(nextProps.field, this.props.field) ||
        !isEqual(validation, nextProps.provider.validation[name] || emptyArray)
      )
    }

    componentDidUpdate(pp: InnerFieldProps<T, P>) {
      const { name, validators = emptyArray, provider } = this.props
      if (validators !== pp.validators) {
        provider.registerValidator(name, validators)
      }
    }

    onBlur(e) {
      const { provider, forwardProps, name } = this.props
      provider.onFieldBlur(name)
      if (forwardProps.onBlur) {
        forwardProps.onBlur(e)
      }
    }

    onChange(e) {
      this.setValue(e.target.value)
    }

    setValue(value: T[P]) {
      const { provider, name } = this.props
      provider.setFieldValue(name, value)
    }

    touch() {
      const { provider, name } = this.props
      provider.touch(name)
    }

    untouch() {
      const { provider, name } = this.props
      provider.untouch(name)
    }

    collectInputProps(): InputProps<T, P> {
      const { field, name, initialValue } = this.props
      return {
        name,
        value: field.value || initialValue,
        // checked: field.value, todo
        onBlur: this.onBlur,
        onChange: this.onChange
      }
    }

    collectMetaProps(): FieldMeta<T, P> {
      const { provider, name, field } = this.props
      const validation = provider.validation[name] || emptyArray
      return {
        isDirty: provider.formIsDirty && isDirty(field),
        didBlur: field.didBlur,
        touched: field.touched,
        submitCount: provider.submitCount,
        loaded: provider.loaded,
        submitting: provider.submitting,
        isValid: validation.length === 0,
        messages: validation,
        originalValue: field.originalValue
      }
    }

    collectUtilProps(): FieldUtils<T, P> {
      const { provider } = this.props
      return {
        touch: this.touch,
        untouch: this.untouch,
        unload: provider.unload,
        submit: provider.submit,
        resetForm: provider.resetForm,
        setFieldValue: provider.setFieldValue,
        setValue: this.setValue,
        forgetState: provider.forgetState,
        clearForm: provider.clearForm,
        getFormValue: provider.getFormValue
      }
    }

    collectProps(): FieldProps<T, P> {
      return {
        input: this.collectInputProps(),
        meta: this.collectMetaProps(),
        utils: this.collectUtilProps(),
        ...this.props.forwardProps
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
