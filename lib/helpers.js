// import {
//   FormProviderState,
//   FormProviderOptions,
//   FormFieldState,
//   FormProviderProps,
// } from './types/index'
// import getInitialState from './getInitialState'
// export function getGetDerivedStateFromProps<T>(opts: FormProviderOptions<T>) {
//   type FPS<T> = FormProviderState<T>
//   type FFS<T> = FormFieldState<T>
//   type FCS = FPS<FFS<T>>
//   type FPP = FormProviderProps<T>
//   return (np: FPP, ps: FCS): Partial<FCS> => {
//     const loading = np.loading || opts.loading
//     const submitting = np.submitting || opts.submitting
//     const initialValue = np.initialValue || opts.initialValue
//     const state: Partial<FCS> = {}
//     if (ps.loaded) {
//       state.submitting = submitting(np)
//       state.isBusy = state.submitting
//       return state
//     }
//     if (initialValue) {
//       state.loaded = true
//       state.isBusy = false
//       state.submitting = submitting(np)
//       state.value = getInitialState(initialValue)
//       return state
//     }
//     state.loaded = !loading(np)
//     state.isBusy = !state.isBusy
//     state.submitting = submitting(np)
//     state.isBusy = state.isBusy || state.submitting
//     if (state.loaded) {
//       state.value = getInitialState(opts.getInitialValueFromProps(np))
//     }
//     return state
//   }
// }
// export default getGetDerivedStateFromProps 
//# sourceMappingURL=helpers.js.map