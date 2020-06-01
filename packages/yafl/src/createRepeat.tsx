import React, { useEffect, useCallback } from 'react'
import warning from 'tiny-warning'
import { validateName, useBranch } from './utils'
import { FormProvider, RepeatConfig, SetFieldValueFunc } from './sharedTypes'

function createRepeat<F extends object>(ctx: React.Context<FormProvider<F, any> | Symbol>) {
  function Repeat<T = any>(props: RepeatConfig<T>) {
    const { name, children, fallback = [] } = props

    if (process.env.NODE_ENV !== 'production') {
      validateName(name)
    }

    const curr = useBranch<F, T[]>(name, ctx, fallback)

    useEffect(() => {
      curr.registerField(curr.path)
      return () => curr.unregisterField(curr.path)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curr.registerField, curr.unregisterField, curr.path])

    const setValue = useCallback(
      (value: T[] | SetFieldValueFunc<T[]>): void => {
        curr.setValue(curr.path, typeof value === 'function' ? value(curr.value) : value, false)
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [curr.value, curr.setValue, curr.path]
    )

    const push = useCallback(
      (...items: T[]) => {
        const arr = [...curr.value]
        const ret = arr.push(...items)
        setValue(arr)
        return ret
      },
      [curr.value, setValue]
    )

    const pop = useCallback(() => {
      const nextValue = [...curr.value]
      const popped = nextValue.pop()
      setValue(nextValue)
      return popped
    }, [curr.value, setValue])

    const insert = useCallback(
      (index: number, ...items: T[]) => {
        const nextValue = [...curr.value]
        nextValue.splice(index, 0, ...items)
        setValue(nextValue)
        return nextValue.length
      },
      [curr.value, setValue]
    )

    const remove = useCallback(
      (index: number) => {
        const nextValue = [...curr.value]
        const ret = nextValue.splice(index, 1)
        setValue(nextValue)
        return ret[0]
      },
      [curr.value, setValue]
    )

    const shift = useCallback(() => {
      const nextValue = [...curr.value]
      const temp = nextValue[0]
      setValue(nextValue.splice(1))
      return temp
    }, [curr.value, setValue])

    const swap = useCallback(
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

    const unshift = useCallback(
      (...items: T[]) => {
        const arr = [...curr.value]
        const ret = arr.unshift(...items)
        setValue(arr)
        return ret
      },
      [curr.value, setValue]
    )

    return (
      <ctx.Provider value={curr}>
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

  return Repeat
}

export default createRepeat
