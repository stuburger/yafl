import * as React from 'react'
// import * as methods from './prototypeFunctions'
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
  resetFields
} from './index'
import {
  FormProviderState,
  FormProviderOptions,
  FormFieldState,
  FormProviderProps,
  ProviderValue,
  Validator,
  FormValidationResult,
  FieldName,
  ValidationResult,
  ValidatorSet
} from '../'
import { bind, clone, transform, isEqual } from '../utils'

export type FPS<T> = FormProviderState<T>
export type FFS<T> = FormFieldState<T>
export type FCS<T> = FPS<FFS<T>> //FormComponentState
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
      const onlyIfLoaded = func => {
        func = bind(this, func)
        return bind(this, function(...params) {
          if (!this.state.isBusy) {
            return func(...params)
          }
          return noop
        })
      }
      this.submit = onlyIfLoaded(this.submit)
      this.setFieldValue = onlyIfLoaded(this.setFieldValue)
      this.onFieldBlur = onlyIfLoaded(this.onFieldBlur)
      this.unload = onlyIfLoaded(this.unload)
      this.forgetState = onlyIfLoaded(this.forgetState)
      this.clearForm = onlyIfLoaded(this.clearForm)
      this.validateForm = bind(this, this.validateForm)
      this.validateField = bind(this, this.validateField)
      this.registerField = bind(this, this.registerField)
      this.formIsDirty = bind(this, this.formIsDirty)
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
        const { submit = () => {} } = this.props
        submit(getFormValue<T>(this.state.value))
      } else {
        console.warn('cannot submit, form is not valid...')
      }
    }

    setFieldValue(fieldName: FieldName<T>, value: any) {
      const state = clone(this.state)
      state.value[fieldName].value = value
      state.value[fieldName].touched = true
      this.setState(state)
    }

    onFieldBlur(fieldName: FieldName<T>) {
      if (this.state.value[fieldName].didBlur) return
      const state = clone(this.state)
      state.value[fieldName].didBlur = true
      this.setState(state)
    }

    unload() {
      this.setState(getNullState<T>())
    }

    forgetState() {
      this.setState(({ value }) => ({ value: untouchAllFields(value), submitCount: 0 }))
    }

    validateForm(): FormValidationResult<T> {
      if (!this.state.loaded) return {} as FormValidationResult<T>
      let result = {} as FormValidationResult<T>
      for (let v in this.validators) {
        result[v] = this.validateField(v)
      }
      return result
    }

    validateField(fieldName: FieldName<T>): ValidationResult {
      const form = this.state.value
      const value = form[fieldName]
      const validators = this.validators[fieldName]
      return validateField<T>(value, form, validators)
    }

    clearForm() {
      this.setState({ value: resetFields<T>(this.state.value) })
    }

    registerField(fieldName: FieldName<T>, value: T[keyof T], validators: Validator[]) {
      this.registerValidator(fieldName, validators)
      this.setState(s => {
        const state = clone(s)
        state.value[fieldName] = getInitialFieldState(value)
        return state
      })
    }

    formIsDirty(): boolean {
      const { loaded, value } = this.state
      let clean = true
      if (loaded) {
        clean = transform(
          value,
          (ret, field, key) => ret && isEqual(field.value, field.originalValue),
          clean
        )
      }
      return !clean
    }

    registerValidator(fieldName: FieldName<T>, validators: Validator[]) {
      this.validators[fieldName] = validators
    }

    getProviderValue(): ProviderValue<T> {
      return {
        ...this.state,
        unload: this.unload,
        submit: this.submit,
        clearForm: this.clearForm,
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
