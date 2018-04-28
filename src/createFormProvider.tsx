import * as React from 'react'
import { getInitialFieldState } from './getInitialState'
import { bind, transform } from './utils'
import {
  touchField,
  untouchField,
  isDirty,
  resetFields,
  set,
  setFieldValue,
  touchAllFields,
  blurField,
  untouchAllFields,
  clearFields
} from './fieldStateHelpers'
import { trueIfAbsent, isEqual } from './utils'
import initializeState, { reinitializeState } from './getInitialState'
import getStartingState from './getStartingState'
import getFormValue from './getFormValue'
import formIsValid from './formIsValid'
import validateField from './validateField'
import { Validator, FormProviderState, FormProviderConfig } from './form'
import { FormFieldState } from './sharedTypes'

export interface Provider<T, P extends keyof T = keyof T> {
  fields: FormFieldState<T>
  initialValue: T
  loaded: boolean
  submitting: boolean
  isBusy: boolean
  formIsTouched: boolean
  formIsValid: boolean
  formIsDirty: boolean
  unload: (() => void)
  getFormValue: () => T
  forgetState: (() => void)
  submit: (() => void)
  resetForm: (() => void)
  submitCount: number
  clearForm: (() => void)
  validation: { [K in keyof T]: string[] }
  registerValidator: (<K extends keyof T>(fieldName: K, validators: Validator<T, K>[]) => void)
  registerField: (<K extends P>(
    fieldName: K,
    initialValue: T[K],
    validators: Validator<T, K>[]
  ) => void)
  onFieldBlur: (<K extends P>(fieldName: K) => void)
  setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void)
  touch: (<K extends P>(fieldName: K) => void)
  untouch: (<K extends P>(fieldName: K) => void)
}

const noop = () => {}

export function wrapProvider<T>(Provider: React.Provider<Provider<T>>, initialValue?: T) {
  type VR = { [K in keyof T]: string[] }
  type PVS = { [P in keyof T]?: Validator<T, P>[] }
  type FPP = FormProviderConfig<T>
  type FPS = FormProviderState<T>

  type ComputedFormState = {
    formIsDirty: boolean
    formIsTouched: boolean
    formIsValid: boolean
    validation: { [K in keyof T]: string[] }
  }

  return class Form extends React.Component<FPP, FPS> {
    validators: PVS = {}

    constructor(props: FPP) {
      super(props)
      const onlyIfLoaded = (func: any, defaultFunc = noop) => {
        func = bind(this, func)
        return bind(this, function(...params: any[]) {
          if (!this.state.isBusy) {
            return func(...params)
          }
          return defaultFunc
        })
      }
      this.submit = onlyIfLoaded(this.submit)
      this.getFormValue = onlyIfLoaded(this.getFormValue)
      this.setFieldValue = onlyIfLoaded(this.setFieldValue)
      this.onFieldBlur = onlyIfLoaded(this.onFieldBlur)
      this.unload = onlyIfLoaded(this.unload)
      this.forgetState = onlyIfLoaded(this.forgetState)
      this.clearForm = onlyIfLoaded(this.clearForm)
      this.touchField = onlyIfLoaded(this.touchField)
      this.untouchField = onlyIfLoaded(this.untouchField)
      this.resetForm = onlyIfLoaded(this.resetForm)
      this.validateForm = onlyIfLoaded(this.validateForm, () => ({}))
      this.registerField = bind(this, this.registerField)
      this.registerValidator = bind(this, this.registerValidator)
      this.getComputedState = bind(this, this.getComputedState)
      this.getProviderValue = bind(this, this.getProviderValue)
      this.state = getStartingState<T>(initialValue)
    }

    static getDerivedStateFromProps = getGetDerivedStateFromProps<T>()

    registerValidator<K extends keyof T>(fieldName: K, validators: Validator<T, K>[]): void {
      this.validators[fieldName] = validators
    }

    registerField<K extends keyof T>(fieldName: K, value: T[K], validators: Validator<T, K>[]) {
      this.registerValidator(fieldName, validators)
      if (this.state.fields[fieldName]) return // field is already registered
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, getInitialFieldState(value))
      }))
    }

    submit(): void {
      this.setState(({ fields, submitCount }) => ({
        fields: touchAllFields(fields),
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
      if (!this.state.fields[fieldName]) return
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, setFieldValue(fields[fieldName], val))
      }))
    }

    touchField<K extends keyof T>(fieldName: K): void {
      if (!this.state.fields[fieldName]) return
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, touchField(fields[fieldName]))
      }))
    }

    // todo touch/untouch specific fields
    touchFields<K extends keyof T>(fieldNames: K[]): void {
      this.setState(({ fields }) => ({ fields: touchAllFields(fields) }))
    }

    untouchField<K extends keyof T>(fieldName: K): void {
      if (!this.state.fields[fieldName]) return
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, untouchField(fields[fieldName]))
      }))
    }

    untouchFields<K extends keyof T>(fieldNames: K[]): void {
      this.setState(({ fields }) => ({ fields: untouchAllFields(fields) }))
    }

    onFieldBlur<K extends keyof T>(fieldName: K): void {
      if (this.state.fields[fieldName].didBlur) return
      this.setState(({ fields }) => ({
        fields: set(fields, fieldName, blurField(fields[fieldName]))
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
      const form = this.state.fields
      const result = transform<PVS, VR>(this.validators, (ret, validators, fieldName) => {
        ret[fieldName] = validateField<T>(fieldName, form, validators)
        return ret
      })
      return result
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
        const messages = validateField<T>(fieldName, fields, this.validators[fieldName])
        validation[fieldName] = messages
        formIsInvalid = formIsInvalid || messages.length > 0
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
        touch: this.touchField,
        untouch: this.untouchField,
        resetForm: this.resetForm,
        forgetState: this.forgetState,
        getFormValue: this.getFormValue,
        onFieldBlur: this.onFieldBlur,
        setFieldValue: this.setFieldValue,
        registerField: this.registerField,
        registerValidator: this.registerValidator
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
    if (!ps.loaded && loaded) {
      let initialValue = np.initialValue || ({} as T)
      state.initialValue = initialValue
      state.fields = Object.assign({}, ps.fields, initializeState<T>(initialValue))
    } else if (ps.loaded && !loaded) {
      state = getStartingState<T>()
      state.fields = clearFields(ps.fields)
    }

    if (np.allowReinitialize && !isEqual(ps.initialValue, np.initialValue)) {
      if (np.initialValue) {
        if (np.rememberStateOnReinitialize) {
          state.fields = reinitializeState<T>(np.initialValue, ps.fields)
        } else {
          state.fields = initializeState<T>(np.initialValue)
          state.submitCount = 0
        }
        state.initialValue = np.initialValue
      } else {
        if (np.rememberStateOnReinitialize) {
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
