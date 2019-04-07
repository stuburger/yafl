import * as React from 'react'
import PropTypes from 'prop-types'
import { validateName, branchByName } from './utils'
import { branchableProps } from './defaults'
import warning from 'tiny-warning'
import { RepeatConfig, SetFieldValueFunc, CombinedContexts, FormState } from './sharedTypes'
import { useSafeContext } from './useSafeContext'

function createRepeat<F extends object>(ctx: CombinedContexts<F>) {
  function RepeatController<T extends object>(props: RepeatConfig<T>) {
    const { children, name, fallback } = props
    const [yafl, dispatch] = useSafeContext<F, T[]>(ctx)

    const path: PathV2 = yafl.path.concat(name as string)
    React.useEffect(() => {
      dispatch({ type: 'register_field', payload: path })
      return () => dispatch({ type: 'unregister_field', payload: path })
    }, [])

    const b = branchByName<F, T[], FormState<F, T[]>>(name, yafl, branchableProps, fallback)

    const deps = [b.valueAtPath]

    const setValue = React.useCallback((value: T[] | SetFieldValueFunc<T[]>): void => {
      dispatch({
        type: 'set_field_value',
        payload: {
          path,
          setTouched: false,
          val: typeof value === 'function' ? value(b.valueAtPath) : value
        }
      })
    }, deps)

    const push = React.useCallback((...items: T[]) => {
      const arr = [...b.valueAtPath]
      const ret = arr.push(...items)
      dispatch({
        type: 'set_field_value',
        payload: { path, setTouched: false, val: arr }
      })
      return ret
    }, deps)

    const pop = React.useCallback(() => {
      const nextValue = [...b.valueAtPath]
      const popped = nextValue.pop()
      dispatch({
        type: 'set_field_value',
        payload: { path, setTouched: false, val: nextValue }
      })
      return popped
    }, deps)

    const insert = React.useCallback((index: number, ...items: T[]) => {
      const nextValue = [...b.valueAtPath]
      nextValue.splice(index, 0, ...items)
      dispatch({
        type: 'set_field_value',
        payload: { path, setTouched: false, val: nextValue }
      })
      return nextValue.length
    }, deps)

    const remove = React.useCallback((index: number) => {
      const nextValue = [...b.valueAtPath]
      const ret = nextValue.splice(index, 1)
      dispatch({
        type: 'set_field_value',
        payload: { path, setTouched: false, val: nextValue }
      })
      return ret[0]
    }, deps)

    const shift = React.useCallback(() => {
      const nextValue = [...b.valueAtPath]
      const temp = nextValue[0]
      dispatch({
        type: 'set_field_value',
        payload: { path, setTouched: false, val: nextValue.splice(1) }
      })
      return temp
    }, deps)

    const swap = React.useCallback((i1: number, i2: number) => {
      if (process.env.NODE_ENV !== 'production') {
        warning(i1 >= 0, `Array index out of bounds: ${i1}`)
        warning(i2 >= 0, `Array index out of bounds: ${i2}`)
      }
      const arr = [...b.valueAtPath]
      arr[i1] = [arr[i2], (arr[i2] = arr[i1])][0]
      dispatch({
        type: 'set_field_value',
        payload: { path, setTouched: false, val: arr }
      })
    }, deps)

    const unshift = React.useCallback((...items: T[]) => {
      const arr = [...b.valueAtPath]
      const ret = arr.unshift(...items)
      dispatch({
        type: 'set_field_value',
        payload: { path, setTouched: false, val: arr }
      })
      return ret
    }, deps)

    return (
      <ctx.state.Provider value={{ ...b, path }}>
        {typeof children === 'function'
          ? children(b.valueAtPath, {
              pop,
              push,
              swap,
              shift,
              insert,
              remove,
              unshift,
              setValue
            })
          : children}
      </ctx.state.Provider>
    )
  }

  function Repeat<T extends object>(props: RepeatConfig<T>) {
    if (process.env.NODE_ENV !== 'production') {
      validateName(props.name)
    }
    return <RepeatController key={props.name} {...props} />
  }

  Repeat.propTypes /* remove-proptypes */ = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
  }

  return Repeat
}

export default createRepeat
