import * as React from 'react'
import { FormProvider } from './sharedTypes'

export const BLOCKER = Symbol('uniq')

export const NO_PROVIDER =
  'A Yafl context consumer can only appear inside a Provider component of the same context ' +
  '(<Form /> or <YaflProvider />). Have you forgotten to wrap one or more of your consumer ' +
  'components in one of these Provider components?'

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
