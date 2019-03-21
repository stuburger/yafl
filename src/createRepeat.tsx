import * as React from 'react'
import PropTypes from 'prop-types'
import { validateName, branchByName } from './utils'
import { branchableProps } from './defaults'
import warning from 'tiny-warning'
import { FormProvider, RepeatConfig, SetFieldValueFunc } from './sharedTypes'
import { useSafeContext } from './useSafeContext'

function createRepeat<F extends object>(ctx: React.Context<FormProvider<F, any> | Symbol>) {
  function RepeatController<T extends object>(props: RepeatConfig<T>) {
    const { children, name, fallback } = props
    const yafl = useSafeContext<F, T[]>(ctx)

    const path = yafl.path.concat(name)
    React.useEffect(() => {
      yafl.registerField(path)
      return () => yafl.unregisterField(path)
    }, [])

    const b = branchByName<F, T[], FormProvider<F, T[]>>(name, yafl, branchableProps, fallback)

    const deps = [b.value]

    const setValue = React.useCallback((value: T[] | SetFieldValueFunc<T[]>): void => {
      yafl.setValue(path, typeof value === 'function' ? value(b.value) : value, false)
    }, deps)

    const push = React.useCallback((...items: T[]) => {
      const arr = [...b.value]
      const ret = arr.push(...items)
      yafl.setValue(path, arr, false)
      return ret
    }, deps)

    const pop = React.useCallback(() => {
      const nextValue = [...b.value]
      const popped = nextValue.pop()
      yafl.setValue(path, nextValue, false)
      return popped
    }, deps)

    const insert = React.useCallback((index: number, ...items: T[]) => {
      const nextValue = [...b.value]
      nextValue.splice(index, 0, ...items)
      yafl.setValue(path, nextValue, false)
      return nextValue.length
    }, deps)

    const remove = React.useCallback((index: number) => {
      const nextValue = [...b.value]
      const ret = nextValue.splice(index, 1)
      yafl.setValue(path, nextValue, false)
      return ret[0]
    }, deps)

    const shift = React.useCallback(() => {
      const nextValue = [...b.value]
      const temp = nextValue[0]
      yafl.setValue(path, nextValue.splice(1), false)
      return temp
    }, deps)

    const swap = React.useCallback((i1: number, i2: number) => {
      if (process.env.NODE_ENV !== 'production') {
        warning(i1 >= 0, `Array index out of bounds: ${i1}`)
        warning(i2 >= 0, `Array index out of bounds: ${i2}`)
      }
      const arr = [...b.value]
      arr[i1] = [arr[i2], (arr[i2] = arr[i1])][0]
      yafl.setValue(path, arr, false)
    }, deps)

    const unshift = React.useCallback((...items: T[]) => {
      const arr = [...b.value]
      const ret = arr.unshift(...items)
      yafl.setValue(path, arr, false)
      return ret
    }, deps)

    return (
      <ctx.Provider value={{ ...b, path }}>
        {typeof children === 'function'
          ? children(b.value, {
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
      </ctx.Provider>
    )
  }

  function Repeat<T extends object>(props: RepeatConfig<T>) {
    if (process.env.NODE_ENV !== 'production') {
      validateName(props.name)
      React.useEffect(() => {
        validateName(name)
      }, [name])
    }
    return <RepeatController key={name} {...props} />
  }

  Repeat.propTypes /* remove-proptypes */ = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
  }

  return Repeat
}

export default createRepeat
