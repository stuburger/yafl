import * as React from 'react'
import * as PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
import { validateName, branchByName } from './utils'
import { branchableProps } from './defaults'
import invariant from 'invariant'
import { FormProvider, ArrayHelpers, Path, RepeatConfig, SetFieldValueFunc } from './sharedTypes'

export interface InnerRepeatConfig<F extends object, T> extends FormProvider<F, T[]> {
  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
}

function childrenIsFunc<T>(
  children: Function | React.ReactNode
): children is ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode) {
  return typeof children === 'function'
}

const listenForProps: (keyof InnerRepeatConfig<any, any>)[] = [
  'value',
  'errors',
  'touched',
  'visited',
  'children',
  'errorCount',
  'submitCount',
  'branchProps',
  'sharedProps',
  'activeField'
]

function createForkProvider<F extends object>(Provider: React.Provider<FormProvider<F, any>>) {
  return class InnerRepeat<T> extends React.Component<InnerRepeatConfig<F, T>> {
    helpers: ArrayHelpers<T>
    constructor(props: InnerRepeatConfig<F, T>) {
      super(props)
      this.pop = this.pop.bind(this)
      this.push = this.push.bind(this)
      this.swap = this.swap.bind(this)
      this.shift = this.shift.bind(this)
      this.insert = this.insert.bind(this)
      this.remove = this.remove.bind(this)
      this.unshift = this.unshift.bind(this)
      this.setValue = this.setValue.bind(this)
      this.helpers = {
        pop: this.pop,
        push: this.push,
        swap: this.swap,
        shift: this.shift,
        insert: this.insert,
        remove: this.remove,
        unshift: this.unshift,
        setValue: this.setValue
      }
    }

    shouldComponentUpdate(np: InnerRepeatConfig<F, T>) {
      return listenForProps.some(key => !isEqual(np[key], this.props[key]))
    }

    setValue(value: T[] | SetFieldValueFunc<T[]>): void {
      const { path, setValue, value: prev } = this.props
      setValue(path, typeof value === 'function' ? value(prev) : value, false)
    }

    push(...items: T[]) {
      const { path, setValue, value } = this.props
      const arr = [...value]
      const ret = arr.push(...items)
      setValue(path, arr, false)
      return ret
    }

    pop() {
      const { path, setValue, value } = this.props
      const nextValue = [...value]
      const popped = nextValue.pop()
      setValue(path, nextValue, false)
      return popped
    }

    insert(index: number, ...items: T[]) {
      const { path, setValue, value } = this.props
      const nextValue = [...value]
      nextValue.splice(index, 0, ...items)
      setValue(path, nextValue, false)
      return nextValue.length
    }

    remove(index: number) {
      const { path, setValue, value } = this.props
      const nextValue = [...value]
      const ret = nextValue.splice(index, 1)
      setValue(path, nextValue, false)
      return ret[0]
    }

    shift() {
      const { path, setValue, value } = this.props
      const nextValue = [...value]
      const temp = nextValue[0]
      setValue(path, nextValue.splice(1), false)
      return temp
    }

    swap(i1: number, i2: number) {
      const { path, setValue, value } = this.props
      invariant(i1 >= 0, `Array index out of bounds: ${i1}`)
      invariant(i2 >= 0, `Array index out of bounds: ${i2}`)
      const arr = [...value]
      arr[i1] = [arr[i2], (arr[i2] = arr[i1])][0]
      setValue(path, arr, false)
    }

    unshift(...items: T[]) {
      const { path, setValue, value } = this.props
      const arr = [...value]
      const ret = arr.unshift(...items)
      setValue(path, arr, false)
      return ret
    }

    render() {
      const { children, ...props } = this.props

      return (
        <Provider value={props}>
          {childrenIsFunc<T>(children) ? children(props.value, this.helpers) : children}
        </Provider>
      )
    }
  }
}

export default function<F extends object>(context: React.Context<FormProvider<F, any>>) {
  const InnerComponent = createForkProvider<F>(context.Provider)

  return class Repeat<T extends object> extends React.PureComponent<RepeatConfig<T>> {
    unmounted = false
    context!: FormProvider<F, any>

    static contextType = context

    static propTypes = {
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      fallback: PropTypes.array,
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
    }

    constructor(props: RepeatConfig<T>) {
      super(props)
      validateName(props.name)
      this.unregisterField = this.unregisterField.bind(this)
    }

    get path(): Path {
      const { path } = this.context
      const { name } = this.props
      return path.concat(name)
    }

    unregisterField(path: Path) {
      if (this.unmounted) return
      this.context.unregisterField(path)
    }

    componentWillUnmount() {
      // no need to unregister child Fields since calling unregister on the section
      // will also unregister all of its children
      this.unregisterField(this.path)
      this.unmounted = true
    }

    render() {
      const { children, name, fallback } = this.props
      return (
        <InnerComponent<T>
          key={name}
          {...branchByName(name, this.context, branchableProps, fallback)}
        >
          {children}
        </InnerComponent>
      )
    }
  }
}
