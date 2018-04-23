import { FormProviderState, FormFieldState } from '../index'

function getNullState<T>(): FormProviderState<T> {
  return {
    fields: {} as FormFieldState<T>,
    loaded: false,
    isBusy: false,
    submitting: false,
    submitCount: 0,
    initialValue: {} as T
  }
}

export default getNullState
