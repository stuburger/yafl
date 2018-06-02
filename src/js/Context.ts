import React from 'react'
import {
  Provider as P,
  Noop,
  FormErrors,
  Path,
  AggregateValidator,
  Visited,
  Touched,
  FormState
} from '../sharedTypes'

/* @internal */
interface DefaultProviderValue<T> extends FormState<T> {
  value: any
  path: Path
  defaultValue: any
  initialValue: T
  defaultFormValue: T
  formIsValid: boolean
  formIsDirty: boolean
  errors: FormErrors<T>
  onSubmit: (() => void) | Noop
  resetForm: (() => void) | Noop
  clearForm: (() => void) | Noop
  forgetState: (() => void) | Noop
  setActiveField: ((path: Path) => void) | Noop
  setValue: ((path: Path, value: boolean) => void) | Noop
  touchField: ((path: Path, touched: boolean) => void) | Noop
  visitField: ((path: Path, visited: boolean) => void) | Noop
  renameField: ((prevName: Path, nextName: Path) => void) | Noop
  setFormValue: ((value: Partial<T>, overwrite: boolean) => void) | Noop
  registerField: ((path: Path, validator: AggregateValidator) => void) | Noop
  unregisterField: ((path: Path, validator?: AggregateValidator) => void) | Noop
}

function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

function getDefaultProviderValue<T>(): DefaultProviderValue<T> {
  return {
    path: [],
    value: {},
    touched: {} as Touched<T>,
    visited: {} as Visited<T>,
    active: [] as Path,
    initialMount: false,
    registeredFields: [] as Path[],
    formValue: {} as T,
    initialValue: {} as T,
    defaultValue: {} as T,
    initialFormValue: {} as T,
    defaultFormValue: {} as T,
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
    setFormValue: noop,
    registerField: noop,
    setActiveField: noop,
    unregisterField: noop
  }
}

export const { Provider, Consumer } = React.createContext<P<any>>(getDefaultProviderValue())
