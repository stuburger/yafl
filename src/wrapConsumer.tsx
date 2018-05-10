import * as React from 'react'
import { isEqual, isString } from './utils'
import {
  Validator,
  FieldConfig,
  BaseFieldConfig,
  FieldProps,
  InnerFieldProps,
  InputProps,
  FieldMeta,
  FieldUtils,
  ComponentProps,
  FormUtils,
  FormMeta,
  ComponentConfig,
  Provider,
  FieldState
} from './sharedTypes'
import { isArray } from './utils'

interface InnerGeneralComponentProps<T extends object, K extends keyof T = keyof T> {
  provider: Provider<T, K>
  forwardProps: { [key: string]: any }
  render?: (state: ComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<ComponentProps<T, K>>
}

export function wrapConsumer<T extends object, K extends keyof T = keyof T>(
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
      const { formValue, touched, blurred, initialFormValue } = provider
      const {
        name,
        render,
        component,
        validateOn,
        initialValue,
        validators = emptyArray,
        ...forwardProps
      } = this.props

      const field: FieldState<T[K]> = {
        value: formValue[name],
        didBlur: !!blurred[name],
        touched: !!touched[name],
        originalValue: initialFormValue[name]
      }

      return (
        <InnerField
          name={name}
          field={field}
          render={render}
          provider={provider}
          component={component}
          validateOn={validateOn}
          validators={validators}
          forwardProps={forwardProps}
          initialValue={initialValue}
        />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}

export function getTypedField<T extends object, P extends keyof T = keyof T>(
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

function getInnerField<T extends object, P extends keyof T = keyof T>() {
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

      const { name, provider, validators = emptyValidators, validateOn } = props
      provider.registerField(name, { validators, validateOn })
    }

    shouldComponentUpdate(nextProps: InnerFieldProps<T, P>) {
      const { provider, name, field, forwardProps } = this.props
      const validation = provider.validation[name] || noValidation
      return (
        nextProps.provider.initialMount &&
        (!isEqual(nextProps.provider.registeredFields[name], provider.registeredFields[name]) ||
          !isEqual(nextProps.field, field) ||
          !isEqual(nextProps.forwardProps, forwardProps) ||
          !isEqual(validation, nextProps.provider.validation[name] || noValidation))
      )
    }

    componentDidUpdate(pp: InnerFieldProps<T, P>) {
      const { name, provider, validators = emptyValidators, validateOn } = this.props

      if (validators !== pp.validators) {
        provider.registerValidators(name, { validators, validateOn })
      }
    }

    componentWillUnmount() {
      const { provider, name } = this.props
      provider.unregisterField(name)
    }

    onBlur(e: React.FocusEvent<T[P]>): void {
      const { provider, forwardProps, name, field } = this.props
      if (forwardProps.onBlur) {
        forwardProps.onBlur(e, field)
      }
      if (field.didBlur || e.isDefaultPrevented()) return
      provider.onFieldBlur(name)
    }

    onChange(e: React.ChangeEvent<T[P]>): void {
      const { forwardProps, field } = this.props
      if (forwardProps.onChange) {
        forwardProps.onChange(e, field)
      }
      if (e.isDefaultPrevented()) return
      this.setValue(e.target.value)
    }

    setValue(value: T[P]): void {
      const { provider, name } = this.props
      provider.setFieldValue(name, value)
    }

    touch<K extends keyof T>(fieldNames?: K | (keyof T)[]) {
      const { provider, name } = this.props
      if (fieldNames && isArray(fieldNames)) {
        provider.touchFields(fieldNames)
      } else if (isString(fieldNames)) {
        provider.touchField(fieldNames)
      } else {
        provider.touchField(name)
      }
    }

    untouch<K extends keyof T>(fieldNames?: K | (keyof T)[]) {
      const { provider, name } = this.props
      if (fieldNames && isArray(fieldNames)) {
        provider.untouchFields(fieldNames)
      } else if (isString(fieldNames)) {
        provider.untouchField(fieldNames)
      } else {
        provider.untouchField(name)
      }
    }

    collectInputProps(): InputProps<T, P> {
      const { field, name } = this.props
      const { value } = field
      return {
        name,
        value,
        // checked: field.value, todo
        onBlur: this.onBlur,
        onChange: this.onChange
      }
    }

    collectMetaProps(): FieldMeta<T, P> {
      const { provider, name, field } = this.props
      const validation = provider.validation[name] || emptyValidators
      return {
        isDirty: provider.formIsDirty && !isEqual(field.originalValue, field.value),
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
        submit: provider.submit,
        resetForm: provider.resetForm,
        setFieldValues: provider.setFieldValues,
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
      const { render, component: Component, provider } = this.props
      // delay initial render until this field is registered
      // is this right?
      if (!provider.registeredFields[this.props.name]) return null

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

export function createFormComponent<T extends object>(
  Consumer: React.Consumer<Provider<T>>,
  component: React.ComponentType<ComponentProps<T>>
): React.ComponentClass<ComponentConfig<T>> {
  const FormComponent = wrapFormConsumer<T>(Consumer)
  return class GeneralFormComponent extends React.Component<ComponentConfig<T>> {
    render() {
      return <FormComponent component={component} {...this.props} />
    }
  }
}

export function wrapFormConsumer<T extends object>(Consumer: React.Consumer<Provider<T>>) {
  const Component = getComponent<T>()

  return class FormComponent extends React.Component<ComponentConfig<T>> {
    constructor(props: ComponentConfig<T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(provider: Provider<T>) {
      const { render, component, ...props } = this.props
      return (
        <Component render={render} component={component} provider={provider} forwardProps={props} />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}

function getComponent<T extends object>() {
  class FormComponent extends React.Component<InnerGeneralComponentProps<T>> {
    constructor(props: InnerGeneralComponentProps<T>) {
      super(props)
      this.touch = this.touch.bind(this)
      this.untouch = this.untouch.bind(this)
      this.collectMetaProps = this.collectMetaProps.bind(this)
      this.collectUtilProps = this.collectUtilProps.bind(this)
      this.collectProps = this.collectProps.bind(this)
    }

    shouldComponentUpdate(nextProps: InnerGeneralComponentProps<T>) {
      return nextProps.provider.initialMount
    }

    touch<K extends keyof T>(fieldNames: K | (keyof T)[]) {
      const { provider } = this.props
      if (fieldNames && isArray(fieldNames)) {
        provider.touchFields(fieldNames)
      } else {
        provider.touchField(fieldNames)
      }
    }

    untouch<K extends keyof T>(fieldNames: K | (keyof T)[]) {
      const { provider } = this.props
      if (fieldNames && isArray(fieldNames)) {
        provider.untouchFields(fieldNames)
      } else {
        provider.untouchField(fieldNames)
      }
    }

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
        initialValue: provider.initialFormValue
      }
    }

    collectUtilProps(): FormUtils<T, keyof T> {
      const { provider } = this.props
      return {
        touch: this.touch,
        untouch: this.untouch,
        submit: provider.submit,
        resetForm: provider.resetForm,
        getFormValue: provider.getFormValue,
        setFieldValue: provider.setFieldValue,
        setFieldValues: provider.setFieldValues,
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
      const { render, component: Component, provider } = this.props
      // delay render until initialMount
      // is this right? could it might delay rendering for too long?
      if (!provider.initialMount) return null

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
