import * as React from 'react'
import { FormProvider } from './sharedTypes'

export const BLOCKER = Symbol('uniq')

export const NO_PROVIDER =
  'A Consumer component can only appear inside a <Form /> ' +
  '(Provider) component that belongs to the same context.'

function isBlocker(value: FormProvider<any, any> | Symbol): value is Symbol {
  return value === BLOCKER
}

export function useSafeContext<F extends object, TField>(
  context: React.Context<FormProvider<F, TField> | Symbol>
) {
  const yafl = React.useContext(context)
  if (isBlocker(yafl)) {
    throw new Error(NO_PROVIDER)
  } else {
    return yafl
  }
}
