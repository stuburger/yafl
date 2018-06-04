import React from 'react'
import {
  FormProvider,
  FormErrors,
  Path,
  AggregateValidator,
  Visited,
  Touched,
  FormState
} from '../sharedTypes'

/* @internal */
export interface Noop {
  (): never
}

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
  errorState: FormErrors<T>
  touchedState: Touched<T>
  visitedState: Visited<T>
  onSubmit: (() => void) | Noop
  resetForm: (() => void) | Noop
  clearForm: (() => void) | Noop
  forgetState: (() => void) | Noop
  setActiveField: ((path: Path) => void) | Noop
  setValue: ((path: Path, value: boolean) => void) | Noop
  touchField: ((path: Path, touched: boolean) => void) | Noop
  visitField: ((path: Path, visited: boolean) => void) | Noop
  renameField: ((prevName: Path, nextName: Path) => void) | Noop
  setTouched: ((value: Touched<T>, overwrite: boolean) => void) | Noop
  setVisited: ((value: Visited<T>, overwrite: boolean) => void) | Noop
  setFormValue: ((value: Partial<T>, overwrite: boolean) => void) | Noop
  registerField: ((path: Path, validator: AggregateValidator) => void) | Noop
  registerSection: ((path: Path, validator: AggregateValidator) => void) | Noop
  unregisterField: ((path: Path, validator?: AggregateValidator) => void) | Noop
  unregisterSection: ((path: Path, validator?: AggregateValidator) => void) | Noop
}

function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

function getDefaultProviderValue<T>(): DefaultProviderValue<T> {
  return {
    path: [],
    value: {},
    isBusy: false,
    loaded: false,
    submitCount: 0,
    formIsValid: true,
    submitting: false,
    formIsDirty: false,
    initialMount: false,
    formIsTouched: false,
    formValue: {} as T,
    initialValue: {} as T,
    defaultValue: {} as T,
    initialFormValue: {} as T,
    defaultFormValue: {} as T,
    activeField: [] as Path,
    touched: {} as Touched<T>,
    visited: {} as Visited<T>,
    registeredFields: [] as Path[],
    registeredSections: [] as Path[],
    touchedState: {} as Touched<T>,
    visitedState: {} as Visited<T>,
    errors: {} as FormErrors<T>,
    errorState: {} as FormErrors<T>,
    onSubmit: noop,
    resetForm: noop,
    setValue: noop,
    clearForm: noop,
    setTouched: noop,
    setVisited: noop,
    touchField: noop,
    renameField: noop,
    forgetState: noop,
    visitField: noop,
    setFormValue: noop,
    registerField: noop,
    setActiveField: noop,
    registerSection: noop,
    unregisterField: noop,
    unregisterSection: noop
  }
}

export const { Provider, Consumer } = React.createContext<FormProvider<any>>(
  getDefaultProviderValue()
)
