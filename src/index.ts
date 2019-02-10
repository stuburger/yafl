import * as React from 'react'
import { FormProvider } from './sharedTypes'
import { getDefaultProviderValue } from './defaults'
import createForm from './createForm'
import createSection from './createSection'
import createField from './createField'
import createRepeat from './createRepeat'
import createValidator from './createValidator'
import createForwardProps from './createForwardProps'
import createHooks from './createHooks'

export function createFormContext<F extends object>() {
  const context = React.createContext<FormProvider<F>>(getDefaultProviderValue())
  const { Provider, Consumer } = context
  const hooks = createHooks<F>(context)
  return {
    ...hooks,
    Form: createForm<F>(context),
    Section: createSection<F>(context),
    Repeat: createRepeat<F>(context),
    Field: createField<F>(context),
    Validator: createValidator(context),
    ForwardProps: createForwardProps(context),
    FormContextProvider: Provider,
    FormContextConsumer: Consumer
  }
}

export * from './sharedTypes'
