import React from 'react'
import { FormProvider, FormErrors, Path, Visited, Touched, RegisteredFields } from './sharedTypes'

// const { whyDidYouUpdate } = require('why-did-you-update')
// whyDidYouUpdate(React)

/* @internal */
export interface Noop {
  (): never
}

function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

function getDefaultProviderValue<T>(): FormProvider<T> {
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
    registeredFields: {} as RegisteredFields<T>,
    errors: {} as FormErrors<T>,
    validateOn: 'blur',
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
    unregisterField: noop
  }
}

export const { Provider, Consumer } = React.createContext<FormProvider<any>>(
  getDefaultProviderValue()
)
