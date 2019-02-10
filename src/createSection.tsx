import * as React from 'react'
import PropTypes from 'prop-types'
import { validateName, branchByName, isSetFunc } from './utils'
import { Name, FormProvider, SectionHelpers, SetFieldValueFunc } from './sharedTypes'
import { branchableProps } from './defaults'

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T> {
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

export interface SectionConfig<T> {
  name: Name
  fallback?: T
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

export default function<F extends object>(ctx: React.Context<FormProvider<F, any>>) {
  function SectionController<T extends object>(props: SectionConfig<T>) {
    const { children, name, fallback } = props
    const yafl = React.useContext<FormProvider<F, T>>(ctx)

    const path = yafl.path.concat(name)
    React.useEffect(() => {
      yafl.registerField(path)
      return () => yafl.unregisterField(path)
    }, [])

    const b = branchByName<F, T, FormProvider<F, T>>(name, yafl, branchableProps, fallback)

    const setValue = React.useCallback(
      (value: T | SetFieldValueFunc<T>): void => {
        yafl.setValue(path, isSetFunc(value) ? value(b.value) : value, false)
      },
      [b.value]
    )

    return (
      <ctx.Provider value={{ ...b, path }}>
        {typeof children === 'function' ? children(b.value, { setValue }) : children}
      </ctx.Provider>
    )
  }

  function Section<T extends object>(props: SectionConfig<T>) {
    if (process.env.NODE_ENV !== 'production') {
      validateName(props.name)
      React.useEffect(() => {
        validateName(name)
      }, [name])
    }
    return <SectionController key={name} {...props} />
  }

  Section.propTypes /* remove-proptypes */ = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
  }

  return Section
}
