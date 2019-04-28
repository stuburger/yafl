import * as React from 'react'
import createForm from './createForm'
import createSection from './createSection'
import createField from './createField'
import createRepeat from './createRepeat'
import createValidator from './createValidator'
import createForwardProps from './createForwardProps'
import createHooks from './createHooks'
import { BLOCKER } from './useSafeContext'
import { FormState, CombinedContexts, Action, FormConfig } from './sharedTypes'

export function createFormContext<F extends object>() {
  const context = React.createContext<FormState<F> | Symbol>(BLOCKER)
  const dispatchCtx = React.createContext<React.Dispatch<Action<any>>>(() => {})
  const configCtx = React.createContext<FormConfig<F>>({} as any)
  const registerFieldCtx = React.createContext<(path: PathV2) => void>(() => {})
  const formValueCtx = React.createContext<F>({} as F)
  const submitCtx = React.createContext<() => void>(() => {})
  const branchCtx = React.createContext<any>({})

  const combined: CombinedContexts<F> = {
    state: context,
    dispatch: dispatchCtx,
    config: configCtx,
    register: registerFieldCtx,
    formValue: formValueCtx,
    submit: submitCtx,
    branch: branchCtx
  }

  const hooks = createHooks<F>(combined)
  return {
    ...hooks,
    Form: createForm<F>(combined),
    Section: createSection<F>(combined),
    Repeat: createRepeat<F>(combined),
    Field: createField<F>(combined),
    Validator: createValidator(combined),
    ForwardProps: createForwardProps(combined)
  }
}

export * from './sharedTypes'
