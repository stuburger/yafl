import { FormProvider } from './sharedTypes'

export const branchableProps: (keyof FormProvider<any>)[] = [
  'touched',
  'visited',
  'errors',
  'value',
  'initialValue',
  'defaultValue'
]
