import * as React from 'react'
import { cloneDeep } from 'lodash'
import {
  FormProviderState,
  FormProviderOptions,
  FormFieldState,
  FormProviderProps,
  ProviderValue,
  ValidationResult,
  Validator
} from './types/index'
import getInitialState from './getInitialState'

export type ValidatorSet<T> = { [P in keyof T]?: Validator[] }

const defaultInitialState = {
  value: null,
  loaded: false
}

const initialValidationResult = {
  messages: [],
  isValid: true
}

function wrapFormProvider<T>(
  Provider: React.Provider<FormProviderState<T>>,
  opts: FormProviderOptions<T>
): React.ComponentClass<FormProviderProps<T>> {
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

    init = (value: T) => {
      const initialValue = getInitialState(value)
      this.setState({ value: initialValue, loaded: true })
    }

    submit = () => {}

    setFieldValue = (fieldName: keyof T, value: any) => {
      if (!this.state.loaded) {
        return
      }
      const state: FormProviderState<FormFieldState<T>> = cloneDeep(this.state)
      state.value[fieldName].value = value
      state.value[fieldName].isTouched = true
      this.setState(state)
    }

    onFieldBlur = (fieldName: keyof T) => {
      if (this.state.value[fieldName].didBlur) return
      const state: FormProviderState<FormFieldState<T>> = cloneDeep(this.state)
      state.value[fieldName].didBlur = true
      this.setState(state)
    }

    registerValidator = (fieldName: keyof T, validators: Validator[]) => {
      this.validators[fieldName] = validators
      this.forceUpdate()
    }

    validateForm = (): ValidationResult => {
      if (!this.state.loaded) {
        return initialValidationResult
      }
      let messages: string[] = []
      for (let v in this.validators) {
        messages = messages.concat(this.validateField(v, this.state.value[v]).messages)
      }
      return {
        messages,
        isValid: messages.length === 0
      }
    }

    validateField = (fieldName: keyof T, value: any): ValidationResult => {
      if (!this.state.loaded) {
        return initialValidationResult
      }
      const validators = this.validators[fieldName] || []
      const messages = validators.map(f => f(value, fieldName, this.state.value)).filter(x => !!x)
      return {
        messages,
        isValid: messages.length === 0
      }
    }

    getProviderValue = (): ProviderValue<T> => {
      return {
        loaded: this.state.loaded,
        submit: this.submit,
        value: this.state.value,
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
