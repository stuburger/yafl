import * as React from 'react'
import { FormProvider } from './sharedTypes'
import { getDefaultProviderValue } from './defaults'
import createForm from './createForm'
import createSection from './createSection'
import createField from './createField'
import createConnect from './createConnect'
import createRepeat from './createRepeat'
import createValidator from './createValidator'
import createForwardProps from './createForwardProps'

export function createFormContext<F extends object>() {
  const context = React.createContext<FormProvider<F>>(getDefaultProviderValue())
  const { Provider, Consumer } = context
  return {
    Form: createForm<F>(context),
    Section: createSection<F>(context),
    Repeat: createRepeat<F>(context),
    Field: createField<F>(context),
    Validator: createValidator(context),
    ForwardProps: createForwardProps(context),
    connect: createConnect<F>(Consumer),
    FormContextProvider: Provider,
    FormContextConsumer: Consumer
  }
}

export const {
  Form,
  Section,
  Field,
  Repeat,
  Validator,
  ForwardProps,
  connect,
  FormContextProvider,
  FormContextConsumer
} = createFormContext<any>()
export * from './sharedTypes'
