import { FormProviderOptions, FormProviderProps, FormProviderState, FormFieldState } from './index'
import { resetFields } from './helpers'
import getInitialState from './getInitialState'
import { trueIfAbsent } from './utils'

function getGetDerivedStateFromProps<T>(opts: FormProviderOptions<T>) {
  if (opts.getInitialValueAsync) {
    return (
      np: FormProviderProps<T>,
      ps: FormProviderState<FormFieldState<T>>
    ): Partial<FormProviderState<FormFieldState<T>>> => {
      return {
        isBusy: np.submitting,
        submitting: np.submitting
      }
    }
  }

  return (
    np: FormProviderProps<T>,
    ps: FormProviderState<FormFieldState<T>>
  ): Partial<FormProviderState<FormFieldState<T>>> => {
    const state: Partial<FormProviderState<FormFieldState<T>>> = {}
    const loaded = trueIfAbsent(np.loaded)
    // if the form is about to load...
    if (!ps.loaded && loaded) {
      let initialValue = np.initialValue || opts.initialValue
      state.value = getInitialState(initialValue)
    } else if (ps.loaded && !loaded) {
      // if the form is about to unload
      // not sure if this is the desired behavior
      state.value = resetFields(ps.value)
    }

    if (!ps.loaded) {
      state.loaded = loaded
    }

    state.submitting = np.submitting
    state.isBusy = !loaded || np.submitting || false

    return state
  }
}

export default getGetDerivedStateFromProps
