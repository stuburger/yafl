import * as React from 'react'
import { bind, transform, isString, isArray, shallowCopy } from './utils'
import { validateField, formIsValid, getDefaultInitialState, getFormState } from './state'
import { trueIfAbsent, isEqual } from './utils'
import {
  FormProviderConfig,
  FormProviderState,
  Provider,
  FieldOptions,
  ValidationType,
  ValidatorConfig,
  Touched,
  RegisteredFields
} from './sharedTypes'

const noop = (...params: any[]) => {
  console.log('not loaded or field non existent')
}

const default_validate_on: ValidationType = 'blur'

/*
  guard function for functions that rely on the form being loaded - ie. async loading
  of form data.
*/
function onlyIfLoaded(func: Function, defaultFunc = noop) {
  func = bind(this, func)
  return bind(this, function(...params: any[]) {
    if (!this.state.isBusy) {
      return func(...params)
    }
    return defaultFunc(...params)
  })
}

/*
  for functions that rely on the existance of a field - wrap the function
  in a guard function to prevent any unexpected behaviour. i.e. if a field
  does not exist it could accidently be dynamically created when setting a value
  todo perhaps this is a feature that is desirable in some situations
*/
function onlyIfFieldExists(func: Function, defaultFunc = noop) {
  func = bind(this, func)
  return bind(this, function(fieldName: string, ...params: any[]) {
    if (this.state.registeredFields[fieldName]) {
      return func(fieldName, ...params)
    }
    return defaultFunc(...params)
  })
}

const incl = (arrayOrString: ValidationType[] | ValidationType, value: ValidationType) => {
  return (arrayOrString as string[] & string).includes(value)
}

const defaultMessages: string[] = []

export function wrapProvider<T extends object>(
  Provider: React.Provider<Provider<T>>,
  defaultValue?: T
) {
  type VR = { [K in keyof T]: string[] }
  type FVC = { [P in keyof T]: ValidatorConfig<T, P> }
  type FPP = FormProviderConfig<T>
  type FPS = FormProviderState<T>

  type ComputedFormState = {
    formIsDirty: boolean
    formIsTouched: boolean
    formIsValid: boolean
    errors: { [K in keyof T]: string[] }
  }

  return class Form extends React.Component<FPP, FPS> {
    validators = {} as FVC

    constructor(props: FPP) {
      super(props)

      const loadedGuard = bind(this, onlyIfLoaded)
      const existsGuard = bind(this, onlyIfFieldExists)
      const loadedAndExists = (func: Function, defaultFunc = noop) => {
        func = loadedGuard(func, defaultFunc)
        func = existsGuard(func, defaultFunc)
        return func as any
      }

      this.submit = loadedGuard(this.submit)
      this.getFormValue = loadedGuard(this.getFormValue)
      this.setFieldValue = loadedAndExists(this.setFieldValue)
      this.setFieldValues = loadedGuard(this.setFieldValues)
      this.onFieldBlur = loadedAndExists(this.onFieldBlur)
      this.forgetState = loadedGuard(this.forgetState)
      this.clearForm = loadedGuard(this.clearForm)
      this.touchField = loadedAndExists(this.touchField)
      this.untouchField = loadedAndExists(this.untouchField)
      this.setActiveField = loadedGuard(this.setActiveField)
      this.renameField = loadedAndExists(this.renameField)
      this.resetForm = loadedGuard(this.resetForm)
      this.validateForm = loadedGuard(this.validateForm, () => ({}))
      this.registerField = bind(this, this.registerField)
      this.unregisterField = bind(this, this.unregisterField)
      this.registerValidators = bind(this, this.registerValidators)
      this.unregisterValidator = bind(this, this.unregisterValidator)
      this.getComputedState = bind(this, this.getComputedState)
      this.getProviderValue = bind(this, this.getProviderValue)
      this.shouldFieldValidate = loadedAndExists(this.shouldFieldValidate, () => false)
      this.getMessagesFor = loadedAndExists(this.getMessagesFor, () => [])
      this.state = getDefaultInitialState<T>()
    }

    static getDerivedStateFromProps = getGetDerivedStateFromProps<T>()

    static defaultProps = {
      initialValue: {},
      defaultValue: defaultValue || {},
      rememberStateOnReinitialize: false,
      allowReinitialize: false,
      validateOn: default_validate_on
    }

    componentDidMount() {
      this.setState({ initialMount: true })
    }

    registerValidators<K extends keyof T>(fieldName: K, opts: ValidatorConfig<T, K>): void {
      this.validators[fieldName] = opts
    }

    unregisterValidator<K extends keyof T>(fieldName: K): void {
      delete this.validators[fieldName]
    }

    registerField<K extends keyof T>(fieldName: K, opts: FieldOptions<T, K>): void {
      if (this.state.registeredFields[fieldName]) {
        // warn about having multiple fields with same name?
        return
      }
      this.registerValidators(fieldName, opts)
      this.setState(({ registeredFields }) => ({
        registeredFields: Object.assign({}, registeredFields, { [fieldName]: true })
      }))
    }

    unregisterField<K extends keyof T>(fieldName: K): void {
      this.unregisterValidator(fieldName)
      this.setState(({ registeredFields: prev }) => {
        const registeredFields = shallowCopy(prev)
        delete registeredFields[fieldName]
        return { registeredFields }
      })
    }

    submit(): void {
      this.setState(({ submitCount }) => ({
        submitCount: submitCount + 1
      }))

      if (formIsValid<T>(this.validateForm())) {
        const { onSubmit = noop } = this.props
        onSubmit(this.state.formValue)
      } else {
        console.warn('cannot submit, form is not valid...')
      }
    }

    getFormValue(inclueUnregisteredFields = false): T {
      const { formValue, registeredFields } = this.state
      if (inclueUnregisteredFields) {
        return formValue
      }
      const result = {} as T
      for (let fieldName in registeredFields) {
        result[fieldName] = formValue[fieldName]
      }
      return result
    }

    setFieldValue<P extends keyof T>(fieldName: P, val: T[P]): void {
      this.setState(({ formValue, touched }) => ({
        formValue: Object.assign({}, formValue, { [fieldName]: val }), // todo this isnt strongly typed
        touched: Object.assign({}, touched, { [fieldName]: true }) // todo this isnt strongly typed
      }))
    }

    setFieldValues(partialUpdate: Partial<T>): void {
      this.setState(({ formValue }) => ({ formValue: Object.assign({}, formValue, partialUpdate) }))
    }

    renameField<K extends keyof T>(prevName: K, nextName: K): void {
      this.registerValidators(nextName, this.validators[prevName])
      this.unregisterValidator(prevName)
      this.setState(({ touched: a1, blurred: a2, formValue: a3, registeredFields: a4 }) => {
        const touched = shallowCopy(a1)
        const blurred = shallowCopy(a2)
        const formValue = shallowCopy(a3)
        const registeredFields = shallowCopy(a4)

        touched[nextName] = touched[prevName]
        blurred[nextName] = blurred[prevName]
        formValue[nextName] = formValue[prevName]
        registeredFields[nextName] = registeredFields[prevName]

        delete touched[prevName]
        delete blurred[prevName]
        delete formValue[prevName]
        delete registeredFields[prevName]

        return { touched, blurred, formValue, registeredFields }
      })
    }

    touchField<K extends keyof T>(fieldName: K): void {
      this.setState(({ touched }) => ({
        touched: Object.assign({}, touched, { [fieldName]: true })
      }))
    }

    setActiveField<K extends keyof T>(fieldName: K | null): void {
      this.setState(() => ({ active: fieldName }))
    }

    touchFields(fieldNames: (keyof T)[]): void {
      fieldNames = fieldNames || (Object.keys(this.state.registeredFields) as (keyof T)[])
      const updated: Touched<T> = {}
      fieldNames.forEach(fieldName => (updated[fieldName] = true))
      this.setState(({ touched }) => ({
        touched: Object.assign({}, touched, updated)
      }))
    }

    untouchField<K extends keyof T>(fieldName: K): void {
      this.setState(({ touched: prev }) => {
        const touched = shallowCopy(prev)
        delete touched[fieldName]
        return { touched }
      })
    }

    untouchFields(fieldNames: (keyof T)[]): void {
      fieldNames = fieldNames || (Object.keys(this.state.registeredFields) as (keyof T)[])
      this.setState(({ touched: prev }) => {
        const touched = shallowCopy(prev)
        fieldNames.forEach(fieldName => delete touched[fieldName])
        return { touched }
      })
    }

    onFieldBlur<K extends keyof T>(fieldName: K): void {
      this.setState(({ blurred }) => ({
        blurred: Object.assign({}, blurred, { [fieldName]: true })
      }))
    }

    clearForm(): void {
      const { defaultValue = {} as T } = this.props
      this.setState({
        formValue: defaultValue,
        touched: {},
        blurred: {},
        submitCount: 0
      })
    }

    resetForm(): void {
      this.setState(({ initialFormValue }) => ({ formValue: initialFormValue, submitCount: 0 }))
    }

    forgetState(): void {
      this.setState(({ touched, blurred }) => ({
        touched: {},
        blurred: {},
        submitCount: 0
      }))
    }

    validateForm(): VR {
      const { formValue, registeredFields } = this.state
      return transform<RegisteredFields<T>, VR>(registeredFields, (ret, config, fieldName) => {
        const { validators } = this.validators[fieldName]
        ret[fieldName] = validateField(fieldName, formValue, validators)
        return ret
      })
    }

    shouldFieldValidate(fieldName: keyof T): boolean {
      const o = this.validators[fieldName]
      // if a field was not registered the below will be
      // have to return false. this is the case when a field is 'registered'
      // via an initial value on the provider but no field consumer was mounted
      // todo register fields from initial value on provider props
      if (!o) return false
      const { defaultValue = {} as T } = this.props
      const validateOn = o.validateOn || this.props.validateOn || default_validate_on
      const { submitCount, touched, blurred } = this.state
      if (typeof validateOn === 'function') {
        const fields = getFormState(this.state, defaultValue)
        const field = fields[fieldName]
        return validateOn(field.value, fields, fieldName)
      }
      if (!isArray(validateOn) && !isString(validateOn)) {
        return false
      }
      if (incl(validateOn, 'change') && touched[fieldName]) {
        return true
      }
      if (incl(validateOn, 'blur') && blurred[fieldName]) {
        return true
      }
      if (incl(validateOn, 'submit') && submitCount > 0) {
        return true
      }

      return false
    }

    getMessagesFor(fieldName: keyof T): string[] {
      if (this.shouldFieldValidate(fieldName)) {
        return validateField<T>(
          fieldName,
          this.state.formValue,
          this.validators[fieldName].validators
        )
      }
      return defaultMessages
    }

    getComputedState(): ComputedFormState {
      const { formValue, initialFormValue, touched, registeredFields } = this.state
      let formIsDirty = false
      let formIsInvalid = false
      let formIsTouched = false
      let errors = {} as VR

      for (let fieldName in registeredFields) {
        formIsDirty = formIsDirty || !isEqual(formValue, initialFormValue)
        formIsTouched = formIsTouched || !!touched[fieldName]
        errors[fieldName] = this.getMessagesFor(fieldName)
        formIsInvalid = formIsInvalid || errors[fieldName].length > 0
      }

      return {
        formIsDirty,
        formIsTouched,
        errors,
        formIsValid: !formIsInvalid
      }
    }

    getProviderValue(): Provider<T> {
      return {
        ...this.state,
        ...this.getComputedState(),
        onSubmit: this.submit,
        clearForm: this.clearForm,
        touchFields: this.touchFields,
        untouchFields: this.untouchFields,
        touchField: this.touchField,
        untouchField: this.untouchField,
        renameField: this.renameField,
        resetForm: this.resetForm,
        forgetState: this.forgetState,
        getFormValue: this.getFormValue,
        onFieldBlur: this.onFieldBlur,
        setActiveField: this.setActiveField,
        setFieldValue: this.setFieldValue,
        setFieldValues: this.setFieldValues,
        registerField: this.registerField,
        unregisterField: this.unregisterField,
        registerValidators: this.registerValidators
      }
    }

    render() {
      return <Provider value={this.getProviderValue()}>{this.props.children}</Provider>
    }
  }
}

function getGetDerivedStateFromProps<T extends object>() {
  return (np: FormProviderConfig<T>, ps: FormProviderState<T>): Partial<FormProviderState<T>> => {
    const loaded = trueIfAbsent(np.loaded)
    const submitting = !!np.submitting

    let state: Partial<FormProviderState<T>> = {
      loaded,
      submitting,
      isBusy: !loaded || submitting
    }

    const initialValue = Object.assign({}, np.defaultValue, np.initialValue)
    // form will load
    if (!ps.loaded && loaded) {
      state.initialFormValue = initialValue
      state.formValue = initialValue
      return state
    }

    if (np.loaded && np.allowReinitialize && !isEqual(ps.initialFormValue, initialValue)) {
      state.initialFormValue = initialValue
      state.formValue = initialValue
      if (!np.rememberStateOnReinitialize) {
        state.submitCount = 0
        state.touched = {}
        state.blurred = {}
      }
    }

    return state
  }
}
