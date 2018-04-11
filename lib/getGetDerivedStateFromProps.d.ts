import { FormProviderOptions, FormProviderProps, FormProviderState, FormFieldState } from '.'
declare function getGetDerivedStateFromProps<T>(
  opts: FormProviderOptions<T>
): (
  np: FormProviderProps<T>,
  ps: FormProviderState<FormFieldState<T>>
) => Partial<FormProviderState<FormFieldState<T>>>
export default getGetDerivedStateFromProps
