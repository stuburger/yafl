import { FormProviderState, FormFieldState } from '../index'

function getNullState<T>(): FormProviderState<FormFieldState<T>> {
  return {
    value: {} as FormFieldState<T>,
    loaded: false,
    isBusy: true,
    submitting: false,
    submitCount: 0
  }
}

export default getNullState
