import { FormProvider, BooleanTree } from './sharedTypes'

// const { whyDidYouUpdate } = require('why-did-you-update')
// whyDidYouUpdate(React)

/* @internal */
export interface Noop {
  (): never
}

export function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

export function getDefaultProviderValue<F extends object, T>(): FormProvider<F, T> {
  return {
    path: [],
    value: {} as T,
    submitCount: 0,
    formIsValid: true,
    formIsDirty: false,
    initialMount: false,
    formIsTouched: false,
    formValue: {} as F,
    initialValue: {} as T,
    defaultValue: {} as T,
    activeField: null,
    touched: {} as BooleanTree<T>,
    visited: {} as BooleanTree<T>,
    errors: {},
    registeredFields: {},
    validateOn: 'blur',
    submit: noop,
    resetForm: noop,
    setValue: noop,
    clearForm: noop,
    setTouched: noop,
    setVisited: noop,
    touchField: noop,
    forgetState: noop,
    visitField: noop,
    setFormValue: noop,
    registerField: noop,
    setActiveField: noop,
    unregisterField: noop
  }
}
