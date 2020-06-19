/* eslint-disable react/prop-types */
import * as React from 'react'
import { FormProvider, Name, YaflBaseContext } from './sharedTypes'
import createForm from './Form'
import createSection from './Section'
import createField from './Field'
import createRepeat from './Repeat'
import createFormError from './FormError'
import createUseField from './useField'
import { BLOCKER, useSafeContext } from './useSafeContext'
import { useBranch } from './utils'
import createUseForm from './useForm'

export function createFormContext<F extends object>() {
  const context = React.createContext<FormProvider<F> | Symbol>(BLOCKER)

  const { Provider } = context

  const { useField } = createUseField<F>(context)
  const useForm = createUseForm()

  function useCommonValues<T = any>(): T {
    const { commonValues } = useSafeContext<any, any>(context)
    return commonValues as any
  }

  function useBranchValues<T extends object = any>(name: Name): T {
    const { branchValues } = useBranch<any, any>(name, context)
    return branchValues
  }

  function useYaflContext() {
    return useSafeContext(context)
  }

  const YaflProvider: React.FC<{
    value: YaflBaseContext<F> & {
      branchValues?: Record<string, any>
      commonValues?: Record<string, any>
    }
  }> = (props) => {
    const { children, value } = props
    const { branchValues = {}, commonValues = {} } = value

    return (
      <Provider value={{ ...value, path: '', branchValues, commonValues }}>{children}</Provider>
    )
  }

  return {
    useField,
    useForm,
    useCommonValues,
    useBranchValues,
    useYaflContext,
    YaflProvider,
    Form: createForm<F>(useForm, Provider),
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
  useForm,
  Section,
  FormError,
  YaflProvider,
  useYaflContext,
  useCommonValues,
  useBranchValues,
} = createFormContext<any>()

export * from './sharedTypes'
