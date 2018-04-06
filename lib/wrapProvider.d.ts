import * as React from 'react'
import { FormProviderState, FormProviderOptions, Validator } from './types/index'
export declare type ValidatorSet<T> = { [P in keyof T]?: Validator[] }
declare function wrapFormProvider<T>(
  Provider: React.Provider<FormProviderState<T>>,
  opts: FormProviderOptions<T>
): any
export default wrapFormProvider
