import { FormProvider } from './sharedTypes'

/* @internal */
export interface Noop {
  (): never
}

export function noop(): never {
  throw new Error(
    'A Consumer component can only appear inside a <Form /> (Provider) component that belongs to the same context.'
  )
}

export const branchableProps: (keyof FormProvider<any>)[] = [
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
    branchProps: {},
    defaultValue: {} as T,
    components: {},
    activeField: null,
    touched: {},
    visited: {},
    errors: {},
    errorCount: 0,
    sharedProps: {},
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
    unregisterField: noop
  }
}
