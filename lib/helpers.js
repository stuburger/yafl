// import { FPO, FCS, FPP, FieldUpdater, FFS } from './createFormProvider'
// import getInitialState from './getInitialState'
// import { FieldState } from './index'
// function createFormUpdater(update: FieldUpdater) {
//   return function<T>(fields: FFS<T>) {
//     const state: FFS<T> = {}
//     for (let key in fields) {
//       state[key] = update(fields[key])
//     }
//     return state
//   }
// }
// const trueIfAbsent = val => {
//   const nullOrUndefined = val === undefined || val === null
//   return nullOrUndefined || !!val
// }
// function resetField(field: FieldState): FieldState {
//   return {
//     touched: false,
//     didBlur: false,
//     value: '',
//     originalValue: ''
//   }
// }
// const resetFields = createFormUpdater(resetField)
// export function getGetDerivedStateFromProps<T>(opts: FPO<T>) {
//   if (opts.getInitialValueAsync) {
//     return (np: FPP<T>, ps: FCS<T>): Partial<FCS<T>> => {
//       return {
//         isBusy: np.submitting
//       }
//     }
//   }
//   return (np: FPP<T>, ps: FCS<T>): Partial<FCS<T>> => {
//     const state: Partial<FCS<T>> = {}
//     const loaded = trueIfAbsent(np.loaded)
//     // if the form is about to load...
//     if (!ps.loaded && loaded) {
//       let initialValue = np.initialValue || opts.initialValue
//       state.value = getInitialState(initialValue)
//     } else if (ps.loaded && !loaded) {
//       // if the form is about to unload
//       // not sure if this is the desired behavior
//       state.value = resetFields(ps.value)
//     }
//     if (!ps.loaded) {
//       state.loaded = loaded
//     }
//     state.isBusy = !loaded || np.submitting || false
//     return state
//   }
// }
//# sourceMappingURL=helpers.js.map