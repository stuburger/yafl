import { FormProvider } from './sharedTypes'

/* @internal */
export interface Noop {
  (): never
}

export const branchableProps: (keyof FormProvider<any>)[] = [
  'touched',
  'visited',
  'errors',
  'value',
  'initialValue',
  'defaultValue'
]
