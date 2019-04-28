import * as React from 'react'
import { CombinedContexts, FormState, Action } from './sharedTypes'

export const BLOCKER = Symbol('uniq')

export interface JoinedContexts<F extends object> {
  state: FormState<F>
  dispatch: React.Dispatch<Action<F>>
}

export const NO_PROVIDER =
  'A Consumer component can only appear inside a <Form /> ' +
  '(Provider) component that belongs to the same context.'

function isBlocker(value: FormState<any> | Symbol): value is Symbol {
  return value === BLOCKER
}

export function useSafeContext<F extends object>(context: CombinedContexts<F>): JoinedContexts<F> {
  const state = React.useContext(context.state)
  const dispatch = React.useContext(context.dispatch)

  if (isBlocker(state)) {
    throw new Error(NO_PROVIDER)
  } else {
    return { dispatch, state }
  }
}
