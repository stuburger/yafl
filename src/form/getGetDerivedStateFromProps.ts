import { FormProviderOptions, FormProviderProps, FormProviderState, FormFieldState } from '../'
import { resetFields, getNullState } from '../form'
import { trueIfAbsent } from '../utils'
import initializeState from './getInitialState'

function getGetDerivedStateFromProps<T>(opts: FormProviderOptions<T>) {
  return (
    np: FormProviderProps<T>,
    ps: FormProviderState<FormFieldState<T>>
  ): Partial<FormProviderState<FormFieldState<T>>> => {
    let state: Partial<FormProviderState<FormFieldState<T>>> = {}
    const loaded = trueIfAbsent(np.loaded)
    if (!ps.loaded && loaded) {
      let initialValue = np.initialValue || opts.initialValue || {}
      // state.initialValue = initialValue
      state.value = Object.assign({}, initializeState<Partial<T>>(initialValue), ps.value)
    } else if (ps.loaded && !loaded) {
      state = getNullState<T>()
      state.value = resetFields(ps.value)
    }

    // if (np.allowReinitialize && !isEqual(ps.initialValue, np.initialValue)) {
    //   if (np.initialValue) {
    //     if (np.rememberStateOnReinitialize) {
    //       state.value = reinitializeState<T>(np.initialValue, ps.value)
    //     } else {
    //       state.value = initializeState<T>(np.initialValue)
    //       state.submitCount = 0
    //     }
    //   } else {
    //     if (np.rememberStateOnReinitialize) {
    //       state.submitCount = 0
    //     }
    //     state.value = initializeState<T>(getFormValue<T>(resetFields(ps.value)))
    //   }
    // }

    if (!ps.loaded) {
      state.loaded = loaded
    }

    state.submitting = np.submitting
    state.isBusy = !loaded || np.submitting || false

    return state
  }
}

export default getGetDerivedStateFromProps

// if (opts.getInitialValueAsync) {
// 	return (
// 		np: FormProviderProps<T>,
// 		ps: FormProviderState<FormFieldState<T>>
// 	): Partial<FormProviderState<FormFieldState<T>>> => {
// 		return {
// 			isBusy: np.submitting,
// 			submitting: np.submitting
// 		}
// 	}
// }
