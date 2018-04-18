import { FormProviderState, FormFieldState } from '../index'

function getNullState<T>(): FormProviderState<T> {
  return {
    value: {} as FormFieldState<T>,
    loaded: false,
    isBusy: true,
    submitting: false,
    submitCount: 0,
    initialValue: {} as T
  }
}

export default getNullState
