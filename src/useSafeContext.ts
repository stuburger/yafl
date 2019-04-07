import * as React from 'react'
import { CombinedContexts, FormState, Action, FormConfig } from './sharedTypes'

export const BLOCKER = Symbol('uniq')

export const NO_PROVIDER =
  'A Consumer component can only appear inside a <Form /> ' +
  '(Provider) component that belongs to the same context.'

function isBlocker(value: FormState<any> | Symbol): value is Symbol {
  return value === BLOCKER
}

export function useSafeContext<F extends object, TField>(
  context: CombinedContexts<F>
): [FormState<F>, React.Dispatch<Action<F>>, FormConfig<F>] {
  const yafl = React.useContext(context.state)
  const dispatch = React.useContext(context.dispatch)
  const config = React.useContext(context.config)
  if (isBlocker(yafl)) {
    throw new Error(NO_PROVIDER)
  } else {
    return [yafl, dispatch, config]
  }
}
