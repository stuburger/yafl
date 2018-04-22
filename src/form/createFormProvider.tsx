import * as React from 'react'
import { getInitialFieldState } from './getInitialState'
import {
  // noops,
  getGetDerivedStateFromProps,
  getNullState,
  validateField,
  untouchAllFields,
  touchAllFields,
  formIsValid,
  getFormValue,
  resetFields,
  formIsDirty,
  setFieldValue,
  blurField
} from './index'
import {
  FormProviderState,
  FormProviderOptions,
  FormProviderProps,
  ProviderValue,
  Validator,
  FormValidationResult,
  ValidatorSet
} from '../'
import { bind, clone, transform } from '../utils'
import { touchField, untouchField } from './fieldStateHelpers'

const noop = () => {}

function wrapFormProvider<T>(
  Provider: React.Provider<ProviderValue<T>>,
  opts: FormProviderOptions<T>
) {
  return class Form extends React.Component<FormProviderProps<T>, FormProviderState<T>> {
    validators: Partial<ValidatorSet<T>> = {}

    constructor(props) {
      super(props)
      const onlyIfLoaded = (func, defaultFunc = noop) => {
        func = bind(this, func)
        return bind(this, function(...params) {
          if (!this.state.isBusy) {
            return func(...params)
          }
          return defaultFunc
        })
      }
      this.submit = onlyIfLoaded(this.submit)
      this.setFieldValue = onlyIfLoaded(this.setFieldValue)
      this.onFieldBlur = onlyIfLoaded(this.onFieldBlur)
      this.unload = onlyIfLoaded(this.unload)
      this.forgetState = onlyIfLoaded(this.forgetState)
      this.clearForm = onlyIfLoaded(this.clearForm)
      this.touchField = onlyIfLoaded(this.touchField)
      this.untouchField = onlyIfLoaded(this.untouchField)
      this.formIsDirty = onlyIfLoaded(this.formIsDirty, () => false)
      this.validateForm = onlyIfLoaded(this.validateForm, () => ({}))
      this.registerField = bind(this, this.registerField)
      this.registerValidator = bind(this, this.registerValidator)
      this.getProviderValue = bind(this, this.getProviderValue)
    }

    static getDerivedStateFromProps = getGetDerivedStateFromProps<T>(opts)

    state = getNullState<T>()

    submit() {
      this.setState(({ value, submitCount }) => ({
        value: touchAllFields(value),
        submitCount: submitCount + 1
      }))

      if (formIsValid<T>(this.validateForm())) {
        const { submit = noop } = this.props
        submit(getFormValue<T>(this.state.value))
      } else {
        console.warn('cannot submit, form is not valid...')
      }
    }

    setFieldValue<P extends keyof T>(fieldName: P, val: T[P]) {
      if (!this.state.value[fieldName]) return
      const value = clone(this.state.value)
      value[fieldName] = setFieldValue(value[fieldName], val)
      this.setState(state => ({ value }))
    }

    touchField<K extends keyof T>(fieldName: K) {
      if (!this.state.value[fieldName]) return
      const value = clone(this.state.value)
      value[fieldName] = touchField(value[fieldName])
      this.setState(state => ({ value }))
    }

    touchFields<K extends keyof T>(fieldNames: K[]) {
      let didUpdate = false
      const value = clone(this.state.value)
      fieldNames.forEach(fieldName => {
        if (value[fieldName]) {
          value[fieldName] = touchField(value[fieldName])
          didUpdate = true
        }
      })

      if (didUpdate) this.setState(state => ({ value }))
    }

    untouchField<K extends keyof T>(fieldName: K) {
      if (!this.state.value[fieldName]) return
      const value = clone(this.state.value)
      value[fieldName] = untouchField(value[fieldName])
      this.setState(state => ({ value }))
    }

    untouchFields<K extends keyof T>(fieldNames: K[]) {
      let didUpdate = false
      const value = clone(this.state.value)
      fieldNames.forEach(fieldName => {
        if (value[fieldName]) {
          value[fieldName] = untouchField(value[fieldName])
          didUpdate = true
        }
      })

      if (didUpdate) this.setState(state => ({ value }))
    }

    onFieldBlur<K extends keyof T>(fieldName: K) {
      if (this.state.value[fieldName].didBlur) return
      const value = clone(this.state.value)
      value[fieldName] = blurField(value[fieldName])
      this.setState({ value })
    }

    unload() {
      this.setState(getNullState<T>())
    }

    forgetState() {
      this.setState(({ value }) => ({ value: untouchAllFields(value), submitCount: 0 }))
    }

    validateForm(): FormValidationResult<T> {
      type PVS = Partial<ValidatorSet<T>>
      const form = this.state.value
      const result = transform<PVS, FormValidationResult<T>>(
        this.validators,
        (ret, validators, fieldName) => {
          ret[fieldName] = validateField<T>(fieldName, form, validators)
          return ret
        }
      )
      return result
    }

    clearForm() {
      this.setState({ value: resetFields<T>(this.state.value) })
    }

    registerField<K extends keyof T>(fieldName: K, value: T[K], validators: Validator<T, K>[]) {
      this.registerValidator(fieldName, validators)
      if (this.state.value[fieldName]) return // field is already registered
      this.setState(s => {
        const state = clone(s)
        const field = state.value[fieldName]
        const val = field ? field.value || value : value
        state.value[fieldName] = getInitialFieldState(val || value)
        return state
      })
    }

    formIsDirty(): boolean {
      return formIsDirty(this.state.value)
    }

    registerValidator<K extends keyof T>(fieldName: K, validators: Validator<T, K>[]) {
      this.validators[fieldName] = validators
    }

    getProviderValue(): ProviderValue<T> {
      return {
        ...this.state,
        unload: this.unload,
        submit: this.submit,
        clearForm: this.clearForm,
        touch: this.touchField,
        untouch: this.untouchField,
        forgetState: this.forgetState,
        formIsDirty: this.formIsDirty(),
        onFieldBlur: this.onFieldBlur,
        validation: this.validateForm(),
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

export default wrapFormProvider
