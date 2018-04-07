/// <reference types="react" />
import * as React from 'react'
import { FormProviderState, FormProviderOptions, FormProviderProps, Validator } from './types/index'
export declare type ValidatorSet<T> = { [P in keyof T]?: Validator[] }
declare function wrapFormProvider<T>(
  Provider: React.Provider<FormProviderState<T>>,
  opts: FormProviderOptions<T>
): React.ComponentClass<FormProviderProps<T>>
export default wrapFormProvider
