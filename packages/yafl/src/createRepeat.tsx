import * as React from 'react'
import warning from 'tiny-warning'
import { validateName, useBranch } from './utils'
import { FormProvider, RepeatConfig, SetFieldValueFunc } from './sharedTypes'
import { useSafeContext } from './useSafeContext'

function createRepeat<F extends object>(ctx: React.Context<FormProvider<F, any> | Symbol>) {
  function RepeatController<T = any>(props: RepeatConfig<T>) {
    const { children, name, fallback = [] } = props
    const yafl = useSafeContext<F, T[]>(ctx)

    const curr = useBranch<T[]>(name, yafl, fallback)

    const { registerField, unregisterField } = yafl

    React.useEffect(() => {
      registerField(curr.path)
      return () => unregisterField(curr.path)
    }, [registerField, unregisterField, curr.path])

    const setValue = React.useCallback(
      (value: T[] | SetFieldValueFunc<T[]>): void => {
        yafl.setValue(curr.path, typeof value === 'function' ? value(curr.value) : value, false)
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [curr.value, yafl.setValue, curr.path]
    )

    const push = React.useCallback(
      (...items: T[]) => {
        const arr = [...curr.value]
        const ret = arr.push(...items)
        setValue(arr)
        return ret
      },
      [curr.value, setValue]
    )

    const pop = React.useCallback(() => {
      const nextValue = [...curr.value]
      const popped = nextValue.pop()
      setValue(nextValue)
      return popped
    }, [curr.value, setValue])

    const insert = React.useCallback(
      (index: number, ...items: T[]) => {
        const nextValue = [...curr.value]
        nextValue.splice(index, 0, ...items)
        setValue(nextValue)
        return nextValue.length
      },
      [curr.value, setValue]
    )

    const remove = React.useCallback(
      (index: number) => {
        const nextValue = [...curr.value]
        const ret = nextValue.splice(index, 1)
        setValue(nextValue)
        return ret[0]
      },
      [curr.value, setValue]
    )

    const shift = React.useCallback(() => {
      const nextValue = [...curr.value]
      const temp = nextValue[0]
      setValue(nextValue.splice(1))
      return temp
    }, [curr.value, setValue])

    const swap = React.useCallback(
      (i1: number, i2: number) => {
        if (process.env.NODE_ENV !== 'production') {
          warning(i1 >= 0, `Array index out of bounds: ${i1}`)
          warning(i2 >= 0, `Array index out of bounds: ${i2}`)
        }
        const arr = [...curr.value]
        // eslint-disable-next-line prefer-destructuring
        arr[i1] = [arr[i2], (arr[i2] = arr[i1])][0]
        setValue(arr)
      },
      [curr.value, setValue]
    )

    const unshift = React.useCallback(
      (...items: T[]) => {
        const arr = [...curr.value]
        const ret = arr.unshift(...items)
        setValue(arr)
        return ret
      },
      [curr.value, setValue]
    )

    return (
      <ctx.Provider value={{ ...yafl, ...curr }}>
        {typeof children === 'function'
          ? children(curr.value, {
              pop,
              push,
              swap,
              shift,
              insert,
              remove,
              unshift,
              setValue,
            })
          : children}
      </ctx.Provider>
    )
  }

  function Repeat<T = any>(props: RepeatConfig<T>) {
    const { name } = props
    if (process.env.NODE_ENV !== 'production') {
      validateName(name)
    }
    return <RepeatController key={name} {...props} />
  }

  return Repeat
}

export default createRepeat
