import * as React from 'react'
import { clone } from '../utils'

import getInitialState, { getInitialFieldState } from './getInitialState'
import {
  validateField,
  noops,
  resetFields,
  touchAllFields,
  untouchAllFields,
  getGetDerivedStateFromProps,
  getFormValue,
  getNullState,
  formIsValid
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

// todo
// distinguish between loading / loaded / isBusy
// i.e. form can be !loaded === true && !isBusy === true at the same time
// pass function loadForm from trigger load from from form component

export type FPS<T> = FormProviderState<T>
export type FFS<T> = FormFieldState<T>
export type FCS<T> = FPS<FFS<T>> //FormComponentState
export type FPP<T> = FormProviderProps<T>
export type FPO<T> = FormProviderOptions<T>
export type FVR<T> = FormValidationResult<T>

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
  } = noops<T>()

  return class Form extends React.Component<FPP<T>, FCS<T>> {
    validators: Partial<ValidatorSet<T>> = {}

    static getDerivedStateFromProps = getGetDerivedStateFromProps<T>(opts)

    state = initialState

    componentDidMount() {
      const { getInitialValueAsync } = opts
      if (this.state.loaded) {
        this.assignFuncs(true)
      } else if (getInitialValueAsync) {
        getInitialValueAsync().then((value: T) => {
          this.assignFuncs()
          this.setState({ value: getInitialState(value), loaded: true })
        })
      }
    }

    // getSnapshotBeforeUpdate(pp: FPP<T>, ps: FCS<T>, snapshot?: SnapShot) {
    //   return null
    // }

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

      if (formIsValid<T>(this._validateForm())) {
        const { submit = opts.submit || noopSubmit } = this.props
        submit(getFormValue<T>(this.state.value))
      } else {
        console.warn('cannot submit, form is not valid...')
      }
    }

    _setFieldValue = (fieldName: FieldName<T>, value: any) => {
      const state = clone(this.state)
      state.value[fieldName].value = value
      state.value[fieldName].touched = true
      this.setState(state)
    }

    _onFieldBlur = (fieldName: FieldName<T>) => {
      if (this.state.value[fieldName].didBlur) return
      const state = clone(this.state)
      state.value[fieldName].didBlur = true
      this.setState(state)
    }

    registerValidator = (fieldName: FieldName<T>, validators: Validator[]) => {
      this.validators[fieldName] = validators
    }

    _registerValidator = (fieldName: FieldName<T>, validators: Validator[]) => {
      this.registerValidator(fieldName, validators)
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
      if (!this.state.loaded) return {} as FVR<T>
      let result = {} as FVR<T>
      for (let v in this.validators) {
        result[v] = this.validateField(v)
      }
      return result
    }

    _validateField = (fieldName: FieldName<T>): ValidationResult => {
      const form = this.state.value
      const value = form[fieldName]
      const validators = this.validators[fieldName]
      return validateField<T>(value, form, validators)
    }

    registerField = (fieldName: FieldName<T>, value: T[keyof T], validators: Validator[]) => {
      this.registerValidator(fieldName, validators)
      this.setState(s => {
        const state = clone(s)
        state.value[fieldName] = getInitialFieldState(value)
        return state
      })
    }

    getProviderValue = (): ProviderValue<T> => {
      return {
        ...this.state,
        unload: this.unload,
        submit: this.submit,
        clearForm: this.clearForm,
        forgetState: this.forgetState,
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
