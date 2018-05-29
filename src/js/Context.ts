import React from 'react'
import {
  Provider as P,
  FormProviderState,
  Noop,
  FormErrors,
  Path,
  AggregateValidator,
  Blurred,
  Touched,
  RegisteredFields
} from '../sharedTypes'

/* @internal */
interface DefaultProviderValue<T> extends FormProviderState<T> {
  value: T
  path: Path
  defaultValue: T
  submitCount: number
  formIsValid: boolean
  formIsDirty: boolean
  formIsTouched: boolean
  errors: FormErrors<T>
  onSubmit: (() => void) | Noop
  resetForm: (() => void) | Noop
  clearForm: (() => void) | Noop
  forgetState: (() => void) | Noop
  setValue: ((path: Path, value: boolean) => void) | Noop
  touchField: ((path: Path, touched: boolean) => void) | Noop
  visitField: ((path: Path, visited: boolean) => void) | Noop
  renameField: ((prevName: Path, nextName: Path) => void) | Noop
  registerField: ((path: Path, validator: AggregateValidator) => void) | Noop
  unregisterField: ((path: Path, validator?: AggregateValidator) => void) | Noop
}

function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

function getDefaultProviderValue<T>(): DefaultProviderValue<T> {
  return {
    path: [],
    touched: {} as Touched<T>,
    blurred: {} as Blurred<T>,
    active: null,
    initialMount: false,
    registeredFields: {} as RegisteredFields<T>,
    defaultValue: {} as T,
    formValue: {} as T,
    value: {} as T,
    initialFormValue: {} as T,
    isBusy: false,
    loaded: false,
    formIsTouched: false,
    formIsValid: true,
    submitCount: 0,
    submitting: false,
    formIsDirty: false,
    errors: {} as FormErrors<T>,
    onSubmit: noop,
    resetForm: noop,
    setValue: noop,
    clearForm: noop,
    touchField: noop,
    renameField: noop,
    forgetState: noop,
    visitField: noop,
    registerField: noop,
    unregisterField: noop
  }
}

export const { Provider, Consumer } = React.createContext<P<any>>(getDefaultProviderValue())
