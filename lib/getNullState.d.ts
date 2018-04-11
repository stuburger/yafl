import { FormProviderState, FormFieldState } from './index'
declare function getNullState<T>(): FormProviderState<FormFieldState<T>>
export default getNullState
