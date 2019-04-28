import { FormState } from './sharedTypes'

export const branchableProps: (keyof FormState<any>)[] = ['touched', 'visited', 'errors', 'value']
