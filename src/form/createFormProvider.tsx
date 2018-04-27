import * as React from 'react'
import { getInitialFieldState } from './getInitialState'
import {
  getGetDerivedStateFromProps,
  getStartingState,
  validateField,
  untouchAllFields,
  touchAllFields,
  formIsValid,
  getFormValue,
  clearFields,
  setFieldValue,
  blurField
} from './index'
import { bind, transform } from '../utils'
import { touchField, untouchField, isDirty, resetFields, set } from './fieldStateHelpers'
import {
  FormProviderState,
  ValidatorSet,
  ProviderValueLoaded,
  ComputedFormState
} from '../internal'
import { Validator, FormValidationResult, FormProviderProps } from '../export'

const noop = () => {}

function wrapFormProvider<T>(Provider: React.Provider<ProviderValueLoaded<T>>, initialValue?: T) {
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

    validateForm(): FormValidationResult<T> {
      type PVS = Partial<ValidatorSet<T>>
      const form = this.state.fields
      const result = transform<PVS, FormValidationResult<T>>(
        this.validators,
        (ret, validators, fieldName) => {
          ret[fieldName] = validateField<T>(fieldName, form, validators)
          return ret
        }
      )
      return result
    }

    getComputedState(): ComputedFormState<T> {
      const { fields } = this.state
      const keys = Object.keys(fields) as (keyof T)[]
      let formIsDirty = false
      let formIsInvalid = false
      let formIsTouched = false
      let validation = {} as FormValidationResult<T>

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

    getProviderValue(): ProviderValueLoaded<T> {
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

export default wrapFormProvider
