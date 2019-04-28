import * as React from 'react'
import PropTypes from 'prop-types'
import { validateName, branchByName } from './utils'
import { branchableProps } from './defaults'
import warning from 'tiny-warning'
import {
  RepeatConfig,
  SetFieldValueFunc,
  CombinedContexts,
  FormState,
  ArrayHelpers
} from './sharedTypes'
import { useSafeContext } from './useSafeContext'

function createRepeat<F extends object>(ctx: CombinedContexts<F>) {
  function RepeatController<T extends object>(props: RepeatConfig<T>) {
    const { children, name, fallback } = props
    const { state, dispatch } = useSafeContext<F>(ctx)

    const path: PathV2 = state.path.concat(name as string)
    React.useEffect(() => {
      dispatch({ type: 'register_field', payload: path })
      return () => dispatch({ type: 'unregister_field', payload: path })
    }, [])

    const b = branchByName<F, T[], FormState<F, T[]>>(name, state, branchableProps, fallback)

    const arrayHelpers = React.useMemo<ArrayHelpers<T>>(
      () => ({
        setValue(value: T[] | SetFieldValueFunc<T[]>) {
          dispatch({
            type: 'set_field_value',
            payload: {
              path,
              setTouched: false,
              val: typeof value === 'function' ? value(b.value) : value
            }
          })
        },
        push(...items: T[]) {
          const arr = [...b.value]
          const ret = arr.push(...items)
          dispatch({
            type: 'set_field_value',
            payload: { path, setTouched: false, val: arr }
          })
          return ret
        },
        pop() {
          const nextValue = [...b.value]
          const popped = nextValue.pop()
          dispatch({
            type: 'set_field_value',
            payload: { path, setTouched: false, val: nextValue }
          })
          return popped
        },
        insert(index: number, ...items: T[]) {
          const nextValue = [...b.value]
          nextValue.splice(index, 0, ...items)
          dispatch({
            type: 'set_field_value',
            payload: { path, setTouched: false, val: nextValue }
          })
          return nextValue.length
        },

        remove(index: number) {
          const nextValue = [...b.value]
          const ret = nextValue.splice(index, 1)
          dispatch({
            type: 'set_field_value',
            payload: { path, setTouched: false, val: nextValue }
          })
          return ret[0]
        },
        shift() {
          const nextValue = [...b.value]
          const temp = nextValue[0]
          dispatch({
            type: 'set_field_value',
            payload: { path, setTouched: false, val: nextValue.splice(1) }
          })
          return temp
        },
        swap(i1: number, i2: number) {
          if (process.env.NODE_ENV !== 'production') {
            warning(i1 >= 0, `Array index out of bounds: ${i1}`)
            warning(i2 >= 0, `Array index out of bounds: ${i2}`)
          }
          const arr = [...b.value]
          arr[i1] = [arr[i2], (arr[i2] = arr[i1])][0]
          dispatch({
            type: 'set_field_value',
            payload: { path, setTouched: false, val: arr }
          })
        },
        unshift(...items: T[]) {
          const arr = [...b.value]
          const ret = arr.unshift(...items)
          dispatch({
            type: 'set_field_value',
            payload: { path, setTouched: false, val: arr }
          })
          return ret
        }
      }),
      [b.value]
    )

    return (
      <ctx.state.Provider value={{ ...b, path }}>
        {typeof children === 'function' ? children(b.value, arrayHelpers) : children}
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
