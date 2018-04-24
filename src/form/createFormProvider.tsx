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
      this.state = getStartingState<T>(opts.initialValue)
    }

    static getDerivedStateFromProps = getGetDerivedStateFromProps<T>()

    submit() {
      this.setState(({ fields, submitCount }) => ({
        fields: touchAllFields(fields),
        submitCount: submitCount + 1
      }))

      if (formIsValid<T>(this.validateForm())) {
        const { submit = noop } = this.props
        submit(getFormValue<T>(this.state.fields))
      } else {
        console.warn('cannot submit, form is not valid...')
      }
    }

    setFieldValue<P extends keyof T>(fieldName: P, val: T[P]) {
      if (!this.state.fields[fieldName]) return
      const fields = clone(this.state.fields)
      fields[fieldName] = setFieldValue(fields[fieldName], val)
      this.setState(state => ({ fields }))
    }

    touchField<K extends keyof T>(fieldName: K) {
      if (!this.state.fields[fieldName]) return
      const fields = clone(this.state.fields)
      fields[fieldName] = touchField(fields[fieldName])
      this.setState(state => ({ fields }))
    }

    touchFields<K extends keyof T>(fieldNames: K[]) {
      let didUpdate = false
      const fields = clone(this.state.fields)
      fieldNames.forEach(fieldName => {
        if (fields[fieldName]) {
          fields[fieldName] = touchField(fields[fieldName])
          didUpdate = true
        }
      })

      if (didUpdate) this.setState(state => ({ fields }))
    }

    untouchField<K extends keyof T>(fieldName: K) {
      if (!this.state.fields[fieldName]) return
      const fields = clone(this.state.fields)
      fields[fieldName] = untouchField(fields[fieldName])
      this.setState(state => ({ fields }))
    }

    untouchFields<K extends keyof T>(fieldNames: K[]) {
      let didUpdate = false
      const fields = clone(this.state.fields)
      fieldNames.forEach(fieldName => {
        if (fields[fieldName]) {
          fields[fieldName] = untouchField(fields[fieldName])
          didUpdate = true
        }
      })

      if (didUpdate) this.setState(state => ({ fields }))
    }

    onFieldBlur<K extends keyof T>(fieldName: K) {
      if (this.state.fields[fieldName].didBlur) return
      const fields = clone(this.state.fields)
      fields[fieldName] = blurField(fields[fieldName])
      this.setState({ fields })
    }

    unload() {
      this.setState(getStartingState<T>())
    }

    forgetState() {
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

    clearForm() {
      this.setState({ fields: resetFields<T>(this.state.fields) })
    }

    registerField<K extends keyof T>(fieldName: K, value: T[K], validators: Validator<T, K>[]) {
      this.registerValidator(fieldName, validators)
      if (this.state.fields[fieldName]) return // field is already registered
      this.setState(s => {
        const state = clone(s)
        state.fields[fieldName] = getInitialFieldState(value)
        return state
      })
    }

    formIsDirty(): boolean {
      return formIsDirty(this.state.fields)
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
