import * as React from 'react'
import { cloneDeep } from 'lodash'
import {
  FormProviderState,
  FormProviderOptions,
  FormFieldState,
  FormProviderProps,
  ProviderValue,
  FieldValidationResult,
  Validator
} from './types/index'
import getInitialState from './getInitialState'

export type ValidatorSet<T> = { [P in keyof T]?: Validator[] }

function wrapFormProvider<T>(
  Provider: React.Provider<FormProviderState<T>>,
  opts: FormProviderOptions<T>
): any {
  // const getInitialValue = (props): FormFieldState<T> =>
  //   props.initialValue || opts.initialValue || ({} as FormFieldState<T>)

  return class Form extends React.Component<
    FormProviderProps<T>,
    FormProviderState<FormFieldState<T>>
  > {
    validators: ValidatorSet<T> = {}
    // state = { value: getInitialValue(this.props) } // here be errors
    constructor(props) {
      super(props)
      this.state = { value: null, loaded: false } // here be errors
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
      state.value[fieldName].isDirty =
        JSON.stringify(value) !== JSON.stringify(state.value[fieldName].originalValue)
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
    }

    validateField = (fieldName: keyof T, value: any): FieldValidationResult => {
      const validators = this.validators[fieldName] || []
      const messages = validators.map(f => f(value, fieldName, this.state.value)).filter(x => !!x)
      return {
        messages,
        isValid: messages.length === 0
      }
    }

    getProviderValue = (): ProviderValue<T> => {
      return {
        loaded: this.state.loaded, // shouldnt have to pass this down
        submit: this.submit,
        value: this.state.value,
        setFieldValue: this.setFieldValue,
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
