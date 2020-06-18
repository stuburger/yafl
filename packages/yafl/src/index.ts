import * as React from 'react'
import { FormProvider, Name } from './sharedTypes'
import createForm from './createForm'
import createSection from './createSection'
import createField from './createField'
import createRepeat from './createRepeat'
import createFormError from './createFormError'
import createUseField from './createUseField'
import createHooks from './createHooks'
import { BLOCKER, useSafeContext } from './useSafeContext'
import { useBranch } from './utils'

export function createFormContext<F extends object>() {
  const context = React.createContext<FormProvider<F> | Symbol>(BLOCKER)

  const { Provider } = context

  const useField = createUseField<F>(context)

  function useCommonValues<T = any>(): T {
    const { sharedProps } = useSafeContext<any, any>(context)
    return sharedProps as any
  }

  function useBranchValues<T extends object = any>(name: Name): T {
    const { branchProps } = useBranch<any, any>(name, context)
    return branchProps
  }

  const hooks = createHooks<F>(context)

  return {
    ...hooks,
    useField,
    useCommonValues,
    useBranchValues,
    Form: createForm<F>(Provider),
    Section: createSection<F>(context),
    Repeat: createRepeat<F>(context),
    Field: createField<F>(useField, useCommonValues, useBranchValues),
    FormError: createFormError(context),
  }
}

export const {
  Field,
  Form,
  useField,
  Repeat,
  Section,
  FormError,
  useYaflContext,
  useCommonValues,
  useBranchValues,
} = createFormContext<any>()

export * from './sharedTypes'
