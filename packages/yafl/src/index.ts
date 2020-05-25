import * as React from 'react'
import { FormProvider } from './sharedTypes'
import createForm from './createForm'
import createSection from './createSection'
import createField from './createField'
import createRepeat from './createRepeat'
import createFormError from './createFormError'
import createForwardProps from './createForwardProps'
import createHooks from './createHooks'
import { BLOCKER } from './useSafeContext'

export function createFormContext<F extends object>() {
  const context = React.createContext<FormProvider<F> | Symbol>(BLOCKER)

  const { Provider } = context

  const hooks = createHooks<F>(context)
  return {
    ...hooks,
    Form: createForm<F>(Provider as React.Provider<FormProvider<F, F>>),
    Section: createSection<F>(context),
    Repeat: createRepeat<F>(context),
    Field: createField<F>(context),
    FormError: createFormError(context),
    ForwardProps: createForwardProps(context as any),
  }
}

export const {
  Field,
  Form,
  ForwardProps,
  Repeat,
  Section,
  FormError,
  useYaflContext,
} = createFormContext<any>()

export * from './sharedTypes'
