import { FormProvider } from './sharedTypes'

/* @internal */
export interface Noop {
  (): never
}

export function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

export const forkableProps: (keyof FormProvider<any>)[] = [
  'touched',
  'visited',
  'errors',
  'value',
  'initialValue',
  'defaultValue'
]

export function getDefaultProviderValue<F extends object, T>(): FormProvider<F, T> {
  return {
    path: [],
    value: {} as T,
    submitCount: 0,
    formIsValid: true,
    formIsDirty: false,
    initialMount: false,
    formValue: {} as F,
    initialValue: {} as T,
    defaultValue: {} as T,
    componentTypes: {},
    activeField: null,
    touched: {},
    visited: {},
    errors: {},
    errorCount: 0,
    commonFieldProps: {},
    submit: noop,
    setValue: noop,
    clearForm: noop,
    resetForm: noop,
    touchField: noop,
    visitField: noop,
    forgetState: noop,
    setFormValue: noop,
    registerField: noop,
    registerError: noop,
    setFormTouched: noop,
    setFormVisited: noop,
    setActiveField: noop,
    unregisterError: noop,
    unregisterField: noop,
    unwrapFormState: noop
  }
}
