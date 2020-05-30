import * as React from 'react'
import { validateName, useBranch, isSetFunc } from './utils'
import { Name, FormProvider, SectionHelpers, SetFieldValueFunc } from './sharedTypes'
import { useSafeContext } from './useSafeContext'

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T> {
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

export interface SectionConfig<T> {
  name: Name
  fallback?: T
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

function createSection<F extends object>(ctx: React.Context<FormProvider<F, any> | Symbol>) {
  function SectionController<T extends object>(props: SectionConfig<T>) {
    const { children, name, fallback = {} as T } = props

    const yafl = useSafeContext<F, T>(ctx)
    const curr = useBranch<T>(name, yafl, fallback)

    const { registerField, unregisterField } = yafl
    React.useEffect(() => {
      registerField(curr.path)
      return () => unregisterField(curr.path)
    }, [curr.path, registerField, unregisterField])

    const setValue = React.useCallback(
      (value: T | SetFieldValueFunc<T>): void => {
        yafl.setValue(curr.path, isSetFunc(value) ? value(curr.value) : value, false)
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [curr.path, curr.value, yafl.setValue]
    )

    return (
      <ctx.Provider value={{ ...yafl, ...curr }}>
        {typeof children === 'function' ? children(curr.value, { setValue }) : children}
      </ctx.Provider>
    )
  }

  function Section<T extends object>(props: SectionConfig<T>) {
    const { name } = props
    if (process.env.NODE_ENV !== 'production') {
      validateName(name)
    }
    return <SectionController key={name} {...props} />
  }

  return Section
}

export default createSection
