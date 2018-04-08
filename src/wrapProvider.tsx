import * as React from 'react'
import { cloneDeep } from 'lodash'
import {
  FormProviderState,
  FormProviderOptions,
  FormFieldState,
  FormProviderProps,
  ProviderValue,
  Validator,
  FieldState,
  FormValidationResult,
  FieldName,
  ValidationResult
} from './types/index'
import getInitialState from './getInitialState'

export type ValidatorSet<T> = { [P in FieldName<T>]?: Validator[] }

const defaultInitialState = {
  value: null,
  loaded: false,
  submitCount: 0
}

const initialValidation: ValidationResult = []

interface FieldUpdater {
  (fields: FieldState): FieldState
}

function createFormUpdater(update: FieldUpdater) {
  return function<T>(fields: FormFieldState<T>) {
    const state: FormFieldState<T> = {}
    for (let key in fields) {
      state[key] = update(fields[key])
    }
    return state
  }
}

function getFormValue<T>(fields: FormFieldState<T>): T {
  const result: T = {} as T
  for (let fieldName in fields) {
    result[fieldName] = fields[fieldName].value
  }
  return result
}

const touchField: FieldUpdater = (field: FieldState) => {
  return {
    isTouched: true,
    value: field.value,
    didBlur: field.didBlur,
    originalValue: field.originalValue
  }
}

function untouchField(field: FieldState): FieldState {
  return {
    isTouched: false,
    didBlur: false,
    value: field.value,
    originalValue: field.originalValue
  }
}

function resetField(field: FieldState): FieldState {
  return {
    isTouched: false,
    didBlur: false,
    value: '',
    originalValue: ''
  }
}

const touchAllFields = createFormUpdater(touchField)
const untouchAllFields = createFormUpdater(untouchField)
const resetFields = createFormUpdater(resetField)

function getNoops<T>() {
  return {
    noopSubmit: (formValue: T) => {},
    noopOnFieldBlur: (fieldName: FieldName<T>) => {},
    noopSetFieldValue: (fieldName: FieldName<T>, value) => {},
    noopValidateForm: (): FormValidationResult<T> => ({}),
    noopValidateField: (fieldName: FieldName<T>): ValidationResult => initialValidation
  }
}

function wrapFormProvider<T>(
  Provider: React.Provider<FormProviderState<T>>,
  opts: FormProviderOptions<T>
): React.ComponentClass<FormProviderProps<T>> {
  const {
    noopSubmit,
    noopOnFieldBlur,
    noopSetFieldValue,
    noopValidateForm,
    noopValidateField
  } = getNoops<T>()

  const formIsValid = (validation: FormValidationResult<T>) => {
    for (let k in validation) {
      if (validation[k].length > 0) {
        return false
      }
    }
    return true
  }

  function validateField<T>(
    value: FieldState,
    fieldName: FieldName<T>,
    form: T,
    validators: Validator[]
  ): ValidationResult {
    const messages: ValidationResult = []
    for (let validate of validators) {
      const message = validate(value, fieldName, form)
      if (message) {
        messages.push(message)
      }
    }
    return messages
  }

  return class Form extends React.Component<
    FormProviderProps<T>,
    FormProviderState<FormFieldState<T>>
  > {
    validators: ValidatorSet<T> = {}

    constructor(props: FormProviderProps<T>) {
      super(props)
      const initialValue = props.initialValue || opts.initialValue
      if (initialValue) {
        this.assignFuncs()
        this.state = { value: getInitialState(initialValue), loaded: true, submitCount: 0 }
      } else {
        this.state = defaultInitialState
      }
    }

    componentDidMount() {
      let load = this.props.loadAsync || opts.loadAsync
      if (load) {
        load().then(this.init)
      }
    }

    submit = noopSubmit
    setFieldValue = noopSetFieldValue
    onFieldBlur = noopOnFieldBlur
    validateForm = noopValidateForm
    validateField = noopValidateField

    init = (value: T) => {
      this.assignFuncs()
      this.setState({ value: getInitialState(value), loaded: true })
    }

    assignFuncs = (forceUpdate = false) => {
      this.submit = this._submit
      this.setFieldValue = this._setFieldValue
      this.onFieldBlur = this._onFieldBlur
      this.validateForm = this._validateForm
      this.validateField = this._validateField
      if (forceUpdate) {
        this.forceUpdate()
      }
    }

    unassignFuncs = (forceUpdate = false) => {
      this.submit = noopSubmit
      this.setFieldValue = noopSetFieldValue
      this.onFieldBlur = noopOnFieldBlur
      this.validateForm = noopValidateForm
      this.validateField = noopValidateField
      if (forceUpdate) {
        this.forceUpdate()
      }
    }

    _submit = () => {
      this.setState(({ value, submitCount }) => ({
        value: touchAllFields(value),
        submitCount: submitCount + 1
      }))

      if (formIsValid(this._validateForm())) {
        const { submit = opts.submit || noopSubmit } = this.props
        submit(getFormValue(this.state.value))
      } else {
        console.warn('cannot submit, form is not valid...')
      }
    }

    _setFieldValue = (fieldName: FieldName<T>, value: any) => {
      const state = cloneDeep<FormProviderState<FormFieldState<T>>>(this.state)
      state.value[fieldName].value = value
      state.value[fieldName].isTouched = true
      this.setState(state)
    }

    _onFieldBlur = (fieldName: FieldName<T>) => {
      if (this.state.value[fieldName].didBlur) return
      const state = cloneDeep<FormProviderState<FormFieldState<T>>>(this.state)
      state.value[fieldName].didBlur = true
      this.setState(state)
    }

    registerValidator = (fieldName: FieldName<T>, validators: Validator[]) => {
      this.validators[fieldName] = validators
      this.forceUpdate()
    }

    clearForm = () => {
      this.setState({ value: resetFields<T>(this.state.value) })
    }

    unload = () => {
      this.setState({ value: resetFields<T>(this.state.value), loaded: false })
    }

    forgetState = () => {
      this.setState(({ value }) => ({ value: untouchAllFields(value), submitCount: 0 }))
    }

    _validateForm = (): FormValidationResult<T> => {
      let result: FormValidationResult<T> = {}
      for (let v in this.validators) {
        result[v] = this._validateField(v)
      }
      return result
    }

    _validateField = (fieldName: FieldName<T>): ValidationResult => {
      const form = this.state.value
      const value = form[fieldName]
      const validators = this.validators[fieldName]
      if (value) {
        return validateField(value, fieldName, form, validators)
      } else {
        return initialValidation
      }
    }

    getProviderValue = (): ProviderValue<T> => {
      return {
        ...this.state,
        submit: this.submit,
        clearForm: this.clearForm,
        onFieldBlur: this.onFieldBlur,
        validation: this.validateForm(),
        setFieldValue: this.setFieldValue,
        registerValidator: this.registerValidator
      }
    }

    render() {
      return <Provider value={this.getProviderValue()}>{this.props.children}</Provider>
    }
  }
}

export default wrapFormProvider
