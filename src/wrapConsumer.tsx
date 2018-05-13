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
  FieldState,
  InnerFieldState
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
        visited: !!blurred[name],
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
  class InnerField extends React.Component<InnerFieldProps<T, P>, InnerFieldState<T, P>> {
    constructor(props: InnerFieldProps<T, P>) {
      super(props)
      this.onChange = this.onChange.bind(this)
      this.onBlur = this.onBlur.bind(this)
      this.setValue = this.setValue.bind(this)
      this.touch = this.touch.bind(this)
      this.untouch = this.untouch.bind(this)
      this.onFocus = this.onFocus.bind(this)
      this.collectInputProps = this.collectInputProps.bind(this)
      this.collectMetaProps = this.collectMetaProps.bind(this)
      this.collectUtilProps = this.collectUtilProps.bind(this)
      this.collectProps = this.collectProps.bind(this)
      this.state = {
        _name: props.name
      }
      const { name, provider, validators = emptyValidators, validateOn } = props
      provider.registerField(name, { validators, validateOn })
    }

    static getDerivedStateFromProps(
      np: InnerFieldProps<T, P>,
      ps: InnerFieldState<T, P>
    ): Partial<InnerFieldState<T, P>> | null {
      const { initialMount, registeredFields: curr } = np.provider
      // the field was renamed - the reason I duplidate (this.props.name) in state here
      // is because without it there would be a single render phase when this field would
      // not yet be registered with its new name. This way the field will continue
      // to be rendered without every rendering null
      if (initialMount && curr[np.name] && !curr[ps._name]) {
        return { _name: np.name }
      } else {
        return null
      }
    }

    shouldComponentUpdate(np: InnerFieldProps<T, P>, ns: InnerFieldState<T, P>) {
      const { provider, field, forwardProps } = this.props
      const { _name } = this.state
      const validation = provider.errors[_name] || noValidation
      return (
        np.provider.initialMount &&
        (!isEqual(np.provider.registeredFields[np.name], provider.registeredFields[_name]) ||
          !isEqual(np.field, field) ||
          !isEqual(np.forwardProps, forwardProps) ||
          !isEqual(validation, np.provider.errors[ns._name] || noValidation))
      )
    }

    componentDidUpdate(pp: InnerFieldProps<T, P>, ps: InnerFieldState<T, P>) {
      const { provider, name, validators = emptyValidators, validateOn } = this.props
      const { _name } = this.state

      if (validators !== pp.validators) {
        provider.registerValidators(_name, { validators, validateOn })
      }
      const { registeredFields: curr } = provider

      if (curr[ps._name] && !curr[name]) {
        provider.renameField(ps._name, name)
      }
    }

    componentWillUnmount() {
      const { provider } = this.props
      provider.unregisterField(this.state._name)
    }

    onFocus(e: React.FocusEvent<any>): void {
      const { provider, forwardProps, field } = this.props
      if (forwardProps.onFocus) {
        forwardProps.onFocus(e, field)
      }
      provider.setActiveField(this.state._name)
    }

    onBlur(e: React.FocusEvent<any>): void {
      const { provider, forwardProps, field } = this.props
      if (forwardProps.onBlur) {
        forwardProps.onBlur(e, field)
      }
      provider.setActiveField(null)
      if (field.visited || e.isDefaultPrevented()) return
      provider.onFieldBlur(this.state._name)
    }

    onChange(e: React.ChangeEvent<any>): void {
      const { forwardProps, field } = this.props
      if (forwardProps.onChange) {
        forwardProps.onChange(e, field)
      }
      if (e.isDefaultPrevented()) return
      this.setValue(e.target.value)
    }

    setValue(value: T[P]): void {
      const { provider } = this.props
      provider.setFieldValue(this.state._name, value)
    }

    touch<K extends keyof T>(fieldNames?: K | (keyof T)[]) {
      const { provider } = this.props
      if (fieldNames && isArray(fieldNames)) {
        provider.touchFields(fieldNames)
      } else if (isString(fieldNames)) {
        provider.touchField(fieldNames)
      } else {
        provider.touchField(this.state._name)
      }
    }

    untouch<K extends keyof T>(fieldNames?: K | (keyof T)[]) {
      const { provider } = this.props
      if (fieldNames && isArray(fieldNames)) {
        provider.untouchFields(fieldNames)
      } else if (isString(fieldNames)) {
        provider.untouchField(fieldNames)
      } else {
        provider.untouchField(this.state._name)
      }
    }

    collectInputProps(): InputProps<T, P> {
      const { field } = this.props
      const { value } = field
      return {
        name: this.state._name,
        value,
        // checked: field.value, todo
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        onChange: this.onChange
      }
    }

    collectMetaProps(): FieldMeta<T, P> {
      const { provider, field } = this.props
      const { _name } = this.state
      const errors = provider.errors[_name] || emptyValidators
      return {
        isDirty: provider.formIsDirty && !isEqual(field.originalValue, field.value),
        visited: field.visited,
        touched: field.touched,
        isActive: provider.active === _name,
        activeField: provider.active,
        submitCount: provider.submitCount,
        loaded: provider.loaded,
        submitting: provider.submitting,
        isValid: errors.length === 0,
        messages: errors,
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
      if (!provider.registeredFields[this.state._name]) return null

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
        activeField: provider.active,
        isValid: provider.formIsValid,
        errors: provider.errors,
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
