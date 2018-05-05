import * as React from 'react'
import { bind, transform, isString, isArray } from './utils'
import {
  set,
  touchField,
  untouchField,
  isDirty,
  resetFields,
  setFieldValue,
  blurField,
  untouchAllFields,
  validateField,
  clearFields,
  getFormValue,
  formIsValid,
  getInitialFieldState,
  getStartingState,
  initializeState,
  reinitializeState,
  setAll,
  modifyFields
} from './state'
import { trueIfAbsent, isEqual } from './utils'
import {
  FormProviderConfig,
  FormProviderState,
  Provider,
  FieldState,
  FieldOptions,
  ValidationType,
  ValidatorConfig
} from './sharedTypes'

const noop = (...params: any[]) => {
  console.log('not loaded or field non existent')
}

const default_validate_on: ValidationType = 'submit'

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
    if (this.state.fields[fieldName]) {
      return func(fieldName, ...params)
    }
    return defaultFunc(...params)
  })
}

const incl = (arrayOrString: ValidationType[] | ValidationType, value: ValidationType) => {
  return (arrayOrString as string[] & string).includes(value)
}

const defaultMessages: string[] = []

export function wrapProvider<T>(Provider: React.Provider<Provider<T>>, defaultValue?: T) {
  type VR = { [K in keyof T]: string[] }
  type FVC = { [P in keyof T]: ValidatorConfig<T, P> }
  type FPP = FormProviderConfig<T>
  type FPS = FormProviderState<T>

  type ComputedFormState = {
    formIsDirty: boolean
    formIsTouched: boolean
    formIsValid: boolean
    validation: { [K in keyof T]: string[] }
  }

  return class Form extends React.Component<FPP, FPS> {
    validators = {} as FVC
    // validationOptions = {} as FVO

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
      this.unload = loadedGuard(this.unload)
      this.forgetState = loadedGuard(this.forgetState)
      this.clearForm = loadedGuard(this.clearForm)
      this.touchField = loadedAndExists(this.touchField)
      this.untouchField = loadedAndExists(this.untouchField)
      this.resetForm = loadedGuard(this.resetForm)
      this.validateForm = loadedGuard(this.validateForm, () => ({}))
      this.registerField = bind(this, this.registerField)
      this.registerValidator = bind(this, this.registerValidator)
      this.getComputedState = bind(this, this.getComputedState)
      this.getProviderValue = bind(this, this.getProviderValue)
      this.shouldFieldValidate = loadedAndExists(this.shouldFieldValidate, () => false)
      this.getMessagesFor = loadedAndExists(this.getMessagesFor, () => [])
      this.state = getStartingState<T>(defaultValue)
    }

    static getDerivedStateFromProps = getGetDerivedStateFromProps<T>()

    static defaultProps = {
      allowReinitialize: false,
      validateOn: default_validate_on
    }

    registerValidator<K extends keyof T>(fieldName: K, opts: ValidatorConfig<T, K>): void {
      this.validators[fieldName] = opts
    }

    registerField<K extends keyof T>(fieldName: K, opts: FieldOptions<T, K>): void {
      const { initialValue, ...validationOptions } = opts
      this.registerValidator(fieldName, validationOptions)
      if (this.state.fields[fieldName]) return // field is already registered
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, () => getInitialFieldState(initialValue))
      }))
    }

    submit(): void {
      this.setState(({ fields, submitCount }) => ({
        submitCount: submitCount + 1
      }))

      if (formIsValid<T>(this.validateForm())) {
        const { submit = noop } = this.props
        submit(this.getFormValue())
      } else {
        console.warn('cannot submit, form is not valid...')
      }
    }

    getFormValue(): T {
      return getFormValue<T>(this.state.fields)
    }

    setFieldValue<P extends keyof T>(fieldName: P, val: T[P]): void {
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, (field: FieldState<T[P]>) => setFieldValue(field, val))
      }))
    }

    setFieldValues(partialUpdate: Partial<T>): void {
      this.setState(({ fields }) => ({
        fields: modifyFields(fields, partialUpdate, setFieldValue)
      }))
    }

    touchField<K extends keyof T>(fieldName: K): void {
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, touchField)
      }))
    }

    touchFields(fieldNames: (keyof T)[]): void {
      fieldNames = fieldNames || (Object.keys(this.state.fields) as (keyof T)[])
      this.setState(({ fields }) => ({ fields: setAll(fields, fieldNames, touchField) }))
    }

    untouchField<K extends keyof T>(fieldName: K): void {
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, untouchField)
      }))
    }

    untouchFields(fieldNames: (keyof T)[]): void {
      fieldNames = fieldNames || (Object.keys(this.state.fields) as (keyof T)[])
      this.setState(({ fields }) => ({ fields: setAll(fields, fieldNames, untouchField) }))
    }

    onFieldBlur<K extends keyof T>(fieldName: K): void {
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, blurField)
      }))
    }

    clearForm(): void {
      this.setState({ fields: clearFields<T>(this.state.fields) })
    }

    resetForm(): void {
      this.setState({ fields: resetFields<T>(this.state.fields) })
    }

    unload(): void {
      this.setState(getStartingState<T>())
    }

    forgetState(): void {
      this.setState(({ fields }) => ({ fields: untouchAllFields(fields), submitCount: 0 }))
    }

    validateForm(): VR {
      const { fields } = this.state
      const result = transform<FVC, VR>(this.validators, (ret, config, fieldName) => {
        ret[fieldName] = validateField<T>(fieldName, fields, config.validators)
        return ret
      })
      return result
    }

    shouldFieldValidate(fieldName: keyof T): boolean {
      const o = this.validators[fieldName]
      // if a field was not registered the below will be
      // have to return false. this is the case when a field is 'registered'
      // via an initial value on the provider but no field consumer was mounted
      // todo register fields from initial value on provider props
      if (!o) return false
      const validateOn = o.validateOn || this.props.validateOn || default_validate_on
      const { fields, submitCount } = this.state
      const field = fields[fieldName]

      if (typeof validateOn === 'function') {
        return validateOn(field.value, fields, fieldName)
      }
      if (!isArray(validateOn) && !isString(validateOn)) {
        return false
      }
      if (incl(validateOn, 'change') && field.touched) {
        return true
      }
      if (incl(validateOn, 'blur') && field.didBlur) {
        return true
      }
      if (incl(validateOn, 'submit') && submitCount > 0) {
        return true
      }
      return false
    }

    getMessagesFor(fieldName: keyof T): string[] {
      if (this.shouldFieldValidate(fieldName)) {
        return validateField<T>(fieldName, this.state.fields, this.validators[fieldName].validators)
      }
      return defaultMessages
    }

    getComputedState(): ComputedFormState {
      const { fields } = this.state
      const keys = Object.keys(fields) as (keyof T)[]
      let formIsDirty = false
      let formIsInvalid = false
      let formIsTouched = false
      let validation = {} as VR

      for (let fieldName of keys) {
        formIsDirty = formIsDirty || isDirty(fields[fieldName])
        formIsTouched = formIsTouched || fields[fieldName].touched
        validation[fieldName] = this.getMessagesFor(fieldName)
        formIsInvalid = formIsInvalid || validation[fieldName].length > 0
      }

      return {
        formIsDirty,
        formIsTouched,
        validation,
        formIsValid: !formIsInvalid
      }
    }

    getProviderValue(): Provider<T> {
      return {
        ...this.state,
        ...this.getComputedState(),
        unload: this.unload,
        submit: this.submit,
        clearForm: this.clearForm,
        touchFields: this.touchFields,
        untouchFields: this.untouchFields,
        touchField: this.touchField,
        untouchField: this.untouchField,
        resetForm: this.resetForm,
        forgetState: this.forgetState,
        getFormValue: this.getFormValue,
        onFieldBlur: this.onFieldBlur,
        setFieldValue: this.setFieldValue,
        setFieldValues: this.setFieldValues,
        registerField: this.registerField,
        registerValidators: this.registerValidator
      }
    }

    render() {
      return <Provider value={this.getProviderValue()}>{this.props.children}</Provider>
    }
  }
}

function getGetDerivedStateFromProps<T>() {
  return (np: FormProviderConfig<T>, ps: FormProviderState<T>): Partial<FormProviderState<T>> => {
    let state: Partial<FormProviderState<T>> = {}
    const loaded = trueIfAbsent(np.loaded)

    const formWillLoad = !ps.loaded && loaded
    const formWillUnload = ps.loaded && !loaded

    if (formWillLoad) {
      let initialValue = np.initialValue || ({} as T)
      state.initialValue = initialValue
      state.fields = Object.assign({}, ps.fields, initializeState<T>(initialValue))
    } else if (formWillUnload) {
      state = getStartingState<T>()
      state.fields = clearFields(ps.fields)
    }

    const initialValueDidChange = !isEqual(ps.initialValue, np.initialValue)
    if (np.allowReinitialize && initialValueDidChange) {
      if (np.initialValue) {
        if (np.rememberStateOnReinitialize) {
          state.fields = reinitializeState<T>(np.initialValue, ps.fields)
        } else {
          state.fields = initializeState<T>(np.initialValue)
          state.submitCount = 0
        }
        state.initialValue = np.initialValue
      } else {
        if (!np.rememberStateOnReinitialize) {
          state.submitCount = 0
        }
        state.initialValue = getFormValue<T>(clearFields(ps.fields))
        state.fields = initializeState<T>(state.initialValue)
      }
    }

    if (!ps.loaded) {
      state.loaded = loaded
    }

    state.submitting = np.submitting
    state.isBusy = !loaded || np.submitting || false

    return state
  }
}
