import * as React from 'react'
import { FormProvider } from './sharedTypes'
import { getDefaultProviderValue } from './defaults'
import createForm from './createForm'
import createSection from './createSection'
import createField from './createField'
import createGizmo from './createGizmo'
import createArraySection from './createArraySection'
import { createFault } from './createError'

export function createFormContext<F extends object>() {
  const context = React.createContext<FormProvider<F>>(getDefaultProviderValue())
  const { Provider, Consumer } = context
  return {
    Form: createForm<F>(Provider),
    Section: createSection<F>(Provider, Consumer),
    Repeat: createArraySection<F>(Provider, Consumer),
    Field: createField<F>(Provider, Consumer),
    Gizmo: createGizmo<F>(Consumer),
    Fault: createFault(Consumer)
  }
}

export const { Form, Section, Field, Gizmo, Repeat, Fault } = createFormContext<any>()
