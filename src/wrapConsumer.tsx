import * as React from 'react'
import { isEqual } from './utils'
import { isDirty } from './state'
import {
  FieldConfig,
  Validator,
  BaseFieldConfig,
  FieldProps,
  InnerFieldProps,
  InputProps,
  FieldMeta,
  FieldUtils,
  ComponentProps,
  FormUtils,
  FormMeta,
  ComponentConfig
} from './form'
import { Provider } from './wrapProvider'

interface InnerGeneralComponentProps<T, K extends keyof T = keyof T> {
  provider: Provider<T, K>
  forwardProps: { [key: string]: any }
  render?: (state: ComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<ComponentProps<T, K>>
}

export function wrapConsumer<T, K extends keyof T = keyof T>(
  Consumer: React.Consumer<Provider<T, K>>
): React.ComponentClass<FieldConfig<T, K>> {
  const InnerField = getInnerField<T, K>()
  const emptyArray: Validator<T, K>[] = []

  return class FormField extends React.Component<FieldConfig<T, K>> {
    constructor(props: FieldConfig<T, K>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(provider: Provider<T, K>) {
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
  Consumer: React.Consumer<Provider<T, P>>,
  fieldName: P,
  component?: React.ComponentType<FieldProps<T, P>>
): React.ComponentClass<BaseFieldConfig<T, P>> {
  const FormField = wrapConsumer<T, P>(Consumer)
  return class TypedField extends React.Component<BaseFieldConfig<T, P>> {
    render() {
      return <FormField component={component} {...this.props} name={fieldName} />
    }
  }
}

function getInnerField<T, P extends keyof T = keyof T>() {
  const noValidation: string[] = []
  const emptyValidators: Validator<T, P>[] = []
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
      const { provider, name } = this.props
      const validation = provider.validation[name] || noValidation
      return (
        !isEqual(nextProps.field, this.props.field) ||
        !isEqual(validation, nextProps.provider.validation[name] || noValidation)
      )
    }

    componentDidUpdate(pp: InnerFieldProps<T, P>) {
      const { name, validators = emptyValidators, provider } = this.props
      if (validators !== pp.validators) {
        provider.registerValidator(name, validators)
      }
    }

    onBlur(e: any): void {
      const { provider, forwardProps, name } = this.props
      provider.onFieldBlur(name)
      if (forwardProps.onBlur) {
        forwardProps.onBlur(e)
      }
    }

    onChange(e: any): void {
      this.setValue(e.target.value)
    }

    setValue(value: T[P]): void {
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
      const validation = provider.validation[name] || emptyValidators
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

      return null
    }
  }

  return InnerField
}

export function wrapFormConsumer<T>(Consumer: React.Consumer<Provider<T>>) {
  const Component = getComponent<T>()

  return class FormComponent extends React.Component<ComponentConfig<T>> {
    constructor(props: ComponentConfig<T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(provider: Provider<T>) {
      const { name, render, component, initialValue, validators, ...props } = this.props
      return (
        <Component render={render} component={component} provider={provider} forwardProps={props} />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}

function getComponent<T>() {
  class FormComponent extends React.Component<InnerGeneralComponentProps<T, keyof T>> {
    collectMetaProps(): FormMeta<T> {
      const { provider } = this.props
      return {
        loaded: provider.loaded,
        submitting: provider.submitting,
        isDirty: provider.formIsDirty,
        touched: provider.formIsTouched,
        submitCount: provider.submitCount,
        isValid: provider.formIsValid,
        validation: provider.validation,
        initialValue: provider.initialValue
      }
    }

    collectUtilProps(): FormUtils<T, keyof T> {
      const { provider } = this.props
      return {
        touch: provider.touch,
        untouch: provider.untouch,
        unload: provider.unload,
        submit: provider.submit,
        resetForm: provider.resetForm,
        getFormValue: provider.getFormValue,
        setFieldValue: provider.setFieldValue,
        forgetState: provider.forgetState,
        clearForm: provider.clearForm
      }
    }

    collectProps(): ComponentProps<T> {
      return {
        state: this.collectMetaProps(),
        utils: this.collectUtilProps(),
        ...this.props.forwardProps
      }
    }

    render() {
      const { render, component: Component } = this.props

      const props = this.collectProps()
      if (render) {
        return render(props)
      }

      if (Component) {
        return <Component {...props} />
      }

      return null
    }
  }

  return FormComponent
}
