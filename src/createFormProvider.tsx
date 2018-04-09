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

const initialValidation: ValidationResult = []

export type FPS<T> = FormProviderState<T>
export type FFS<T> = FormFieldState<T>
export type FCS<T> = FPS<FFS<T>> //FormComponentState
export type FPP<T> = FormProviderProps<T>
export type FPO<T> = FormProviderOptions<T>
export type FVR<T> = FormValidationResult<T>

interface FieldUpdater {
  (fields: FieldState): FieldState
}

function createFormUpdater(update: FieldUpdater) {
  return function<T>(fields: FFS<T>) {
    const state: FFS<T> = {}
    for (let key in fields) {
      state[key] = update(fields[key])
    }
    return state
  }
}

function getNullState<T>() {
  const state: FCS<T> = {
    value: null,
    loaded: false,
    isBusy: true,
    submitting: false,
    submitCount: 0
  }
  return state
}

function getFormValue<T>(fields: FFS<T>): T {
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
    noopSubmit: (formValue: T) => {
      console.error('submit: form not loaded')
    },
    noopOnFieldBlur: (fieldName: FieldName<T>) => {
      console.error('blur: form not loaded')
    },
    noopSetFieldValue: (fieldName: FieldName<T>, value) => {
      console.error('setFieldValue: form not loaded')
    },
    noopValidateForm: (): FVR<T> => ({}),
    noopValidateField: (fieldName: FieldName<T>): ValidationResult => initialValidation
  }
}

function getGetDerivedStateFromProps<T>(opts: FPO<T>) {
  return (np: FPP<T>, ps: FCS<T>): Partial<FCS<T>> => {
    const loading = np.loading || opts.loading
    const submitting = np.submitting || opts.submitting

    // no derived state to be handled since these props were not passed in
    if (!loading && !submitting) {
      return null
    }

    const state: Partial<FCS<T>> = {}

    if (!ps.loaded || typeof loading === 'function') {
      const isLoading = loading(np)
      state.loaded = !isLoading
      state.isBusy = isLoading
    }

    if (typeof submitting === 'function') {
      state.submitting = submitting(np)
      state.isBusy = state.isBusy || state.submitting
    }

    if (!ps.loaded && state.loaded) {
      let initialValue = np.initialValue || opts.initialValue
      const { getInitialValueFromProps = props => ({} as T) } = opts
      initialValue = initialValue || getInitialValueFromProps(np)

      if (initialValue) {
        state.value = getInitialState(initialValue)
      }
    }
    console.log(state)
    return state
  }
}

function wrapFormProvider<T>(
  Provider: React.Provider<FPS<T>>,
  opts: FPO<T>
): React.ComponentClass<FPP<T>> {
  const initialState = getNullState<T>()

  const {
    noopSubmit,
    noopOnFieldBlur,
    noopSetFieldValue,
    noopValidateForm,
    noopValidateField
  } = getNoops<T>()

  const formIsValid = (validation: FVR<T>) => {
    for (let k in validation) {
      if (validation[k].length > 0) {
        return false
      }
    }
    return true
  }

  function validateField(
    value: FieldState,
    fieldName: FieldName<T>,
    form: FFS<T>,
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

  return class Form extends React.Component<FPP<T>, FCS<T>> {
    validators: ValidatorSet<T> = {}

    static getDerivedStateFromProps = getGetDerivedStateFromProps<T>(opts)

    state = initialState

    componentDidMount() {
      let load = this.props.getInitialValueAsync || opts.getInitialValueAsync
      if (this.state.loaded) {
        this.assignFuncs(true)
      } else if (load) {
        load().then(this.init)
      }
    }

    componentDidUpdate(pp: FPP<T>, ps: FCS<T>) {
      if (ps.isBusy !== this.state.isBusy) {
        this.handleAssign(true)
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
      this.handleAssign = this.unassignFuncs
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
      this.handleAssign = this.assignFuncs
    }

    handleAssign = this.assignFuncs

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
      const state = cloneDeep<FCS<T>>(this.state)
      state.value[fieldName].value = value
      state.value[fieldName].isTouched = true
      this.setState(state)
    }

    _onFieldBlur = (fieldName: FieldName<T>) => {
      if (this.state.value[fieldName].didBlur) return
      const state = cloneDeep<FCS<T>>(this.state)
      state.value[fieldName].didBlur = true
      this.setState(state)
    }

    registerValidator = (fieldName: FieldName<T>, validators: Validator[]) => {
      this.validators[fieldName] = validators
      this.forceUpdate()
    }

    clearForm = () => {
      this.setState({ value: resetFields(this.state.value) })
    }

    unload = () => {
      this.setState(initialState)
    }

    forgetState = () => {
      this.setState(({ value }) => ({ value: untouchAllFields(value), submitCount: 0 }))
    }

    _validateForm = (): FVR<T> => {
      let result: FVR<T> = {}
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
