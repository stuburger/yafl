import * as React from 'react'
import PropTypes from 'prop-types'
import { validateName, branchByName, isSetFunc } from './utils'
import { Name, SectionHelpers, SetFieldValueFunc, CombinedContexts, FormState } from './sharedTypes'
import { branchableProps } from './defaults'
import { useSafeContext } from './useSafeContext'

export interface SectionConfig<T> {
  name: Name
  fallback?: T
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

export default function<F extends object>(ctx: CombinedContexts<F>) {
  function SectionController<T extends object>(props: SectionConfig<T>) {
    const { children, name, fallback } = props
    const { state: yafl, dispatch } = useSafeContext<F>(ctx)

    const path: PathV2 = yafl.path.concat(name as string)
    React.useEffect(() => {
      dispatch({ type: 'register_field', payload: path })
      return () => dispatch({ type: 'unregister_field', payload: path })
    }, [])

    const b = branchByName<F, T, FormState<F>>(name, yafl, branchableProps, fallback)

    const setValue = React.useCallback(
      (value: T | SetFieldValueFunc<T>): void => {
        dispatch({
          type: 'set_field_value',
          payload: { path, val: isSetFunc(value) ? value(b.value) : value, setTouched: false }
        })
      },
      [b.value]
    )

    return (
      <ctx.state.Provider value={{ ...b, path }}>
        {typeof children === 'function' ? children(b.value, { setValue }) : children}
      </ctx.state.Provider>
    )
  }

  function Section<T extends object>(props: SectionConfig<T>) {
    if (process.env.NODE_ENV !== 'production') {
      validateName(props.name)
    }
    return <SectionController key={props.name} {...props} />
  }

  Section.propTypes /* remove-proptypes */ = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
  }

  return Section
}
