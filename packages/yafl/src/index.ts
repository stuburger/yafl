import * as React from 'react'
import { FormProvider } from './sharedTypes'
import createForm from './createForm'
import createSection from './createSection'
import createField from './createField'
import createRepeat from './createRepeat'
import createFormError from './createFormError'
import createUseField from './createUseField'
import createHooks from './createHooks'
import { BLOCKER } from './useSafeContext'
import createUseDelivery from './createUseDelivery'

export function createFormContext<F extends object>() {
  const context = React.createContext<FormProvider<F> | Symbol>(BLOCKER)

  const { Provider } = context

  const useField = createUseField<F>(context)
  const useDelivery = createUseDelivery(context)
  const hooks = createHooks<F>(context)

  return {
    ...hooks,
    useField,
    useDelivery,
    Form: createForm<F>(Provider),
    Section: createSection<F>(context),
    Repeat: createRepeat<F>(context),
    Field: createField<F>(useField, useDelivery),
    FormError: createFormError(context),
  }
}

export const {
  Field,
  Form,
  useField,
  useDelivery,
  Repeat,
  Section,
  FormError,
  useYaflContext,
} = createFormContext<any>()

export * from './sharedTypes'
