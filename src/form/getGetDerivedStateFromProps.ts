import { FormProviderOptions, FormProviderProps, FormProviderState } from '../'
import { resetFields, getNullState, getFormValue } from '../form'
import { trueIfAbsent, isEqual } from '../utils'
import initializeState, { reinitializeState } from './getInitialState'

function getGetDerivedStateFromProps<T>(opts: FormProviderOptions<T>) {
  return (np: FormProviderProps<T>, ps: FormProviderState<T>): Partial<FormProviderState<T>> => {
    let state: Partial<FormProviderState<T>> = {}
    const loaded = trueIfAbsent(np.loaded)
    if (!ps.loaded && loaded) {
      let initialValue = np.initialValue || opts.initialValue || ({} as T)
      state.initialValue = initialValue
      state.fields = Object.assign({}, ps.fields, initializeState<T>(initialValue))
    } else if (ps.loaded && !loaded) {
      state = getNullState<T>()
      state.fields = resetFields(ps.fields)
    }

    if (np.allowReinitialize && !isEqual(ps.initialValue, np.initialValue)) {
      if (np.initialValue) {
        if (np.rememberStateOnReinitialize) {
          state.fields = reinitializeState<T>(np.initialValue, ps.fields)
        } else {
          state.fields = initializeState<T>(np.initialValue)
          state.submitCount = 0
        }
        state.initialValue = np.initialValue
      } else {
        if (np.rememberStateOnReinitialize) {
          state.submitCount = 0
        }
        state.initialValue = getFormValue<T>(resetFields(ps.fields))
        state.fields = initializeState<T>(state.initialValue)
      }
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
