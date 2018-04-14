import { FormProviderState, FormFieldState } from '../'

function getNullState<T>(): FormProviderState<T> {
  return {
    value: {} as FormFieldState<T>,
    loaded: false,
    isBusy: true,
    submitting: false,
    submitCount: 0,
    initialValue: {}
  }
}

export default getNullState
