import * as React from 'react'
import * as PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
import { validateName, branchByName } from './utils'
import {
  Name,
  FormProvider,
  ArrayHelpers,
  Path,
  RepeatConfig,
  SetFieldValueFunc
} from './sharedTypes'
import { branchableProps } from './defaults'
import invariant from 'invariant'

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T[]> {
  name: Name
  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
}

const listenForProps: (keyof ForkProviderConfig<any, any>)[] = [
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
  return class ForkProvider<T> extends React.Component<ForkProviderConfig<F, T>> {
    unmounted = false
    private path: Path
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
      this.path = props.path.concat(props.name)
      this.pop = this.pop.bind(this)
      this.push = this.push.bind(this)
      this.swap = this.swap.bind(this)
      this.shift = this.shift.bind(this)
      this.insert = this.insert.bind(this)
      this.remove = this.remove.bind(this)
      this.unshift = this.unshift.bind(this)
      this.setValue = this.setValue.bind(this)
      this.unregisterField = this.unregisterField.bind(this)
    }

    shouldComponentUpdate(np: ForkProviderConfig<F, T>) {
      return listenForProps.some(key => !isEqual(np[key], this.props[key]))
    }

    unregisterField(path: Path) {
      if (this.unmounted) return
      this.props.unregisterField(path)
    }

    componentWillUnmount() {
      // no need to unregister child Fields since calling unregister on the section
      // will also unregister all of its children
      this.unregisterField(this.path)
      this.unmounted = true
    }

    setValue(value: T[] | SetFieldValueFunc<T[]>): void {
      const { setValue, value: prev } = this.props
      setValue(this.path, typeof value === 'function' ? value(prev) : value, false)
    }

    push(...items: T[]) {
      const { setValue, value } = this.props
      const arr = [...value]
      const ret = arr.push(...items)
      setValue(this.path, arr, false)
      return ret
    }

    pop() {
      const { setValue, value } = this.props
      const nextValue = [...value]
      const popped = nextValue.pop()
      setValue(this.path, nextValue, false)
      return popped
    }

    insert(index: number, ...items: T[]) {
      const { setValue, value } = this.props
      const nextValue = [...value]
      nextValue.splice(index, 0, ...items)
      setValue(this.path, nextValue, false)
      return nextValue.length
    }

    remove(index: number) {
      const { setValue, value } = this.props
      const nextValue = [...value]
      const ret = nextValue.splice(index, 1)
      setValue(this.path, nextValue, false)
      return ret[0]
    }

    shift() {
      const { setValue, value } = this.props
      const nextValue = [...value]
      const temp = nextValue[0]
      setValue(this.path, nextValue.splice(1), false)
      return temp
    }

    swap(i1: number, i2: number) {
      const { setValue, value } = this.props
      invariant(i1 >= 0, `Array index out of bounds: ${i1}`)
      invariant(i2 >= 0, `Array index out of bounds: ${i2}`)
      const arr = [...value]
      arr[i1] = [arr[i2], (arr[i2] = arr[i1])][0]
      setValue(this.path, arr, false)
    }

    unshift(...items: T[]) {
      const { setValue, value } = this.props
      const arr = [...value]
      const ret = arr.unshift(...items)
      setValue(this.path, arr, false)
      return ret
    }

    render() {
      const { name, children, unregisterField, path, ...props } = this.props

      return (
        <Provider value={{ ...props, path: this.path, unregisterField: this.unregisterField }}>
          {typeof children === 'function'
            ? children(props.value, {
                push: this.push,
                pop: this.pop,
                insert: this.insert,
                swap: this.swap,
                shift: this.shift,
                unshift: this.unshift,
                remove: this.remove,
                setValue: this.setValue
              })
            : children}
        </Provider>
      )
    }
  }
}

export default function<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>,
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  const InnerComponent = createForkProvider<F>(Provider)

  return class Section<T extends object> extends React.PureComponent<RepeatConfig<T>> {
    static propTypes = {
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      fallback: PropTypes.array,
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
    }

    constructor(props: RepeatConfig<T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(ip: FormProvider<F, any>) {
      const { children, name, fallback } = this.props
      return (
        <InnerComponent<T> key={name} {...branchByName(name, ip, branchableProps, fallback)}>
          {children}
        </InnerComponent>
      )
    }

    render() {
      validateName(this.props.name)
      return <Consumer>{this._render}</Consumer>
    }
  }
}
