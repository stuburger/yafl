import React, { useCallback, useEffect } from 'react'
import { validateName, useBranch, isFunction } from './utils'
import { Name, FormProvider, SectionHelpers, SetFieldValueFunc } from './sharedTypes'

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T> {
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

export interface SectionConfig<T> {
  name: Name
  fallback?: T
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

function createSection<F extends object>(ctx: React.Context<FormProvider<F, any> | Symbol>) {
  function Section<T extends object>(props: SectionConfig<T>) {
    const { name } = props
    if (process.env.NODE_ENV !== 'production') {
      validateName(name)
    }

    const { children, fallback = {} as T } = props

    const curr = useBranch<F, T>(name, ctx, fallback)
    const { registerField, unregisterField } = curr

    useEffect(() => {
      registerField(curr.path)
      return () => unregisterField(curr.path)
    }, [curr.path, registerField, unregisterField])

    const setValue = useCallback(
      (value: T | SetFieldValueFunc<T>): void => {
        curr.setValue(curr.path, isFunction(value) ? value(curr.value) : value, false)
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [curr.path, curr.value, curr.setValue]
    )

    return (
      <ctx.Provider value={curr}>
        {typeof children === 'function' ? children(curr.value, { setValue }) : children}
      </ctx.Provider>
    )
  }

  return Section
}

export default createSection
