import * as React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
import { validateName, forkByName } from './utils'
import { Name, FormProvider, ArrayHelpers, Path } from './sharedTypes'
import { forkableProps } from './defaults'

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
  'activeField',
  'submitCount'
]

function createForkProvider<F extends object>(Provider: React.Provider<FormProvider<F, any>>) {
  return class ForkProvider<T> extends React.Component<ForkProviderConfig<F, T>> {
    unmounted = false
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
      this.push = this.push.bind(this)
      this.pop = this.pop.bind(this)
      this.insert = this.insert.bind(this)
      this.shift = this.shift.bind(this)
      this.remove = this.remove.bind(this)
      this.unregisterField = this.unregisterField.bind(this)
    }

    shouldComponentUpdate(np: ForkProviderConfig<F, T>) {
      return listenForProps.some(key => !isEqual(np[key], this.props[key]))
    }

    unregisterField(path: Path) {
      if (this.unmounted) return
      const { unregisterField } = this.props
      unregisterField(path)
    }

    componentWillUnmount() {
      // no need to unregister child Fields since calling unregister on the section
      // will also unregister all of its children
      this.unregisterField(this.props.path)
      this.unmounted = true
    }

    push(valueToPush: T) {
      const { setValue, value, path } = this.props
      setValue(path, [...value, valueToPush], false)
    }

    pop() {
      const { setValue, path, value } = this.props
      const nextValue = [...value]
      const popped = nextValue.pop()
      setValue(path, nextValue, false)
      return popped
    }

    insert(index: number, valueToInsert: T) {
      const { setValue, value, path } = this.props
      const nextValue = [...value]
      nextValue.splice(index, 0, valueToInsert)
      setValue(path, nextValue, false)
    }

    remove(index: number) {
      const { setValue, value, path } = this.props
      const nextValue = [...value]
      const ret = nextValue.splice(index, 1)
      setValue(path, nextValue, false)
      return ret[0]
    }

    shift() {
      const { setValue, value, path } = this.props
      const nextValue = [...value]
      const temp = nextValue[0]
      setValue(path, nextValue.splice(1), false)
      return temp
    }

    render() {
      const { name, children, unregisterField, ...props } = this.props

      return (
        <Provider value={{ ...props, unregisterField: this.unregisterField }}>
          {typeof children === 'function'
            ? children(props.value, {
                push: this.push,
                pop: this.pop,
                insert: this.insert,
                shift: this.shift,
                remove: this.remove
              })
            : children}
        </Provider>
      )
    }
  }
}

export interface RepeatConfig<T> {
  name: Name
  fallback?: T[]
  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
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

    _render(incomingProps: FormProvider<F, any>) {
      const { children, name, fallback } = this.props
      return (
        <InnerComponent<T> key={name} {...forkByName(name, incomingProps, forkableProps, fallback)}>
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
