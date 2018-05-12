import { clone } from './utils'
import { FormFieldState, Validator, FormProviderState } from './sharedTypes'

export function getDefaultInitialState<T extends object>(
  defaultValue: T = {} as T
): FormProviderState<T> {
  return {
    initialMount: false,
    formValue: clone(defaultValue),
    active: null,
    touched: {},
    blurred: {},
    loaded: false,
    isBusy: false,
    registeredFields: {},
    submitting: false,
    submitCount: 0,
    initialFormValue: defaultValue
  }
}

export function getFormState<T extends object>(
  { formValue, initialFormValue, registeredFields, touched, blurred }: FormProviderState<T>,
  defaultFormValue: T
): FormFieldState<T> {
  const state = {} as FormFieldState<T>
  for (let fieldName in registeredFields) {
    const value =
      formValue[fieldName] === undefined ? defaultFormValue[fieldName] : formValue[fieldName]
    state[fieldName] = {
      value,
      visited: !!blurred[fieldName],
      touched: !!touched[fieldName],
      originalValue: initialFormValue[fieldName]
    }
  }
  return state
}

export function validateField<T extends object>(
  fieldName: keyof T,
  form: T,
  validators = [] as Validator<T, keyof T>[]
): string[] {
  const messages: string[] = []
  const value = form[fieldName]
  for (let validate of validators) {
    const message = validate(value, form, fieldName)
    if (message) {
      messages.push(message)
    }
  }
  return messages
}

export function formIsValid<T>(validation: { [K in keyof T]: string[] }): boolean {
  for (let k in validation) {
    if (validation[k].length > 0) {
      return false
    }
  }
  return true
}
