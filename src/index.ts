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
    Form: createForm<F>(Provider),
    Section: createSection<F>(Provider, Consumer),
    Repeat: createRepeat<F>(Provider, Consumer),
    Field: createField<F>(Provider, Consumer),
    Validator: createValidator(Consumer),
    ForwardProps: createForwardProps(Provider, Consumer),
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
