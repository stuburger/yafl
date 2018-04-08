import * as React from 'react'
import { cloneDeep } from 'lodash'
import {
  FormProviderState,
  FormProviderOptions,
  FormFieldState,
  FormProviderProps,
  ProviderValue,
  ValidationResult,
  Validator,
  FieldState
} from './types/index'
import getInitialState from './getInitialState'

export type ValidatorSet<T> = { [P in keyof T]?: Validator[] }

const defaultInitialState = {
  value: null,
  loaded: false,
  submitCount: 0
}

const initialValidationResult = {
  messages: [],
  isValid: true
}

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

const touchField: FieldUpdater = (field: FieldState) => {
  return {
    isTouched: true,
    value: field.value,
    didBlur: field.didBlur,
    originalValue: field.originalValue
  }
}

// function untouchField(field: FieldState): FieldState {
//   return {
//     isTouched: false,
//     didBlur: false,
//     value: field.value,
//     originalValue: field.originalValue
//   }
// }

function resetField(field: FieldState): FieldState {
  return {
    isTouched: false,
    didBlur: false,
    value: '',
    originalValue: ''
  }
}

const touchAllFields = createFormUpdater(touchField)
// const untouchAllFields = createFormUpdater(untouchField)
const resetFields = createFormUpdater(resetField)

function wrapFormProvider<T>(
  Provider: React.Provider<FormProviderState<T>>,
  opts: FormProviderOptions<T>
): React.ComponentClass<FormProviderProps<T>> {
  const noopSubmit = () => {}
  const noopOnFieldBlur = (fieldName: keyof T) => {}
  const noopSetFieldValue = (fieldName: keyof T, value) => {
    console.log('form is still loading')
  }
  const noopValidateForm = (): ValidationResult => {
    return initialValidationResult
  }
  const noopValidateField = (fieldName: keyof T, value: FieldState): ValidationResult => {
    return initialValidationResult
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
        this.init(initialValue)
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
    }

    _setFieldValue = (fieldName: keyof T, value: any) => {
      const state = cloneDeep<FormProviderState<FormFieldState<T>>>(this.state)
      state.value[fieldName].value = value
      state.value[fieldName].isTouched = true
      this.setState(state)
    }

    _onFieldBlur = (fieldName: keyof T) => {
      if (this.state.value[fieldName].didBlur) return
      const state = cloneDeep<FormProviderState<FormFieldState<T>>>(this.state)
      state.value[fieldName].didBlur = true
      this.setState(state)
    }

    registerValidator = (fieldName: keyof T, validators: Validator[]) => {
      this.validators[fieldName] = validators
      this.forceUpdate()
    }

    clearForm = () => {
      this.setState({ value: resetFields<T>(this.state.value) })
    }

    _validateForm = (): ValidationResult => {
      let messages: string[] = []
      for (let v in this.validators) {
        messages = messages.concat(this._validateField(v).messages)
      }
      return {
        messages,
        isValid: messages.length === 0
      }
    }

    _validateField = (fieldName: keyof T): ValidationResult => {
      const validators = this.validators[fieldName]
      const value = this.state.value[fieldName]

      if (!value) {
        return initialValidationResult
      }

      const messages = validators.map(f => f(value, fieldName, this.state.value)).filter(x => !!x)
      return {
        messages,
        isValid: messages.length === 0
      }
    }

    getProviderValue = (): ProviderValue<T> => {
      return {
        ...this.state,
        submit: this.submit,
        clearForm: this.clearForm,
        setFieldValue: this.setFieldValue,
        validation: this.validateForm(),
        registerValidator: this.registerValidator,
        validateField: this.validateField,
        onFieldBlur: this.onFieldBlur
      }
    }

    render() {
      return <Provider value={this.getProviderValue()}>{this.props.children}</Provider>
    }
  }
}

export default wrapFormProvider
