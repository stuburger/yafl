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
  FieldName,
  ValidatorSet
} from '../'
import { bind, clone, transform } from '../utils'
import { touchField, untouchField } from './fieldStateHelpers'

export type FPS<T> = FormProviderState<T>
export type FCS<T> = FPS<T> //FormComponentState
export type FPP<T> = FormProviderProps<T>
export type FPO<T> = FormProviderOptions<T>
export type FVR<T> = FormValidationResult<T>

const noop = () => {}

function wrapFormProvider<T>(
  Provider: React.Provider<FPS<T>>,
  opts: FPO<T>
): React.ComponentClass<FPP<T>> {
  class Form extends React.Component<FPP<T>, FCS<T>> {
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

    setFieldValue(fieldName: FieldName<T>, val: any) {
      if (!this.state.value[fieldName]) return
      const value = clone(this.state.value)
      value[fieldName] = setFieldValue(value[fieldName], val)
      this.setState(state => ({ value }))
    }

    touchField(fieldName: FieldName<T>) {
      if (!this.state.value[fieldName]) return
      const value = clone(this.state.value)
      value[fieldName] = touchField(value[fieldName])
      this.setState(state => ({ value }))
    }

    touchFields(fieldNames: FieldName<T>[]) {
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

    untouchField(fieldName: FieldName<T>) {
      if (!this.state.value[fieldName]) return
      const value = clone(this.state.value)
      value[fieldName] = untouchField(value[fieldName])
      this.setState(state => ({ value }))
    }

    untouchFields(fieldNames: FieldName<T>[]) {
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

    onFieldBlur(fieldName: FieldName<T>) {
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
      const result = transform<PVS, FVR<T>>(this.validators, (ret, validators, fieldName) => {
        ret[fieldName] = validateField<T>(fieldName, form, validators)
        return ret
      })
      return result
    }

    clearForm() {
      this.setState({ value: resetFields<T>(this.state.value) })
    }

    registerField(
      fieldName: FieldName<T>,
      value: T[keyof T],
      validators: Validator<T, FieldName<T>>[]
    ) {
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

    registerValidator(fieldName: FieldName<T>, validators: Validator<T, FieldName<T>>[]) {
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

  return Form
}

export default wrapFormProvider
