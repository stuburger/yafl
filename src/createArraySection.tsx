import * as React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
import { validateName, forkByName } from './utils'
import { Name, FormProvider } from './sharedTypes'
import { forkableProps } from './defaults'

export interface ArrayHelpers<T> {
  push: (value: T) => void
  shift: (index: number) => void
  insert: (index: number, value: T) => void
  remove: (index: number) => void
}

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T[]> {
  name: Name
  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
}

const listenForProps: (keyof ForkProviderConfig<any, any>)[] = [
  'value',
  'errors',
  'touched',
  'visited',
  'errorCount',
  'activeField',
  'submitCount'
]

function createForkProvider<F extends object>(Provider: React.Provider<FormProvider<F, any>>) {
  return class ForkProvider<T> extends React.Component<ForkProviderConfig<F, T>> {
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
      this.push = this.push.bind(this)
      this.insert = this.insert.bind(this)
      this.shift = this.shift.bind(this)
      this.remove = this.remove.bind(this)
      this.registerField = this.registerField.bind(this)
      this.registerField()
    }

    shouldComponentUpdate(np: ForkProviderConfig<F, T>) {
      return listenForProps.some(key => !isEqual(np[key], this.props[key]))
    }

    componentWillUnmount() {
      const { unregisterField, path } = this.props
      unregisterField(path)
    }

    registerField() {
      const { path, registerField } = this.props
      registerField(path, 'section')
    }

    push(valueToPush: T) {
      const { setValue, value, path } = this.props
      setValue(path, [...value, valueToPush], false)
    }

    insert(index: number, valueToInsert: T) {
      const { setValue, value, path } = this.props
      setValue(path, value.splice(index, 0, valueToInsert), false)
    }

    remove(index: number) {
      const { setValue, value, path } = this.props
      setValue(path, value.splice(index, 1), false)
    }

    shift() {
      const { setValue, value, path } = this.props
      const temp = value[0]
      setValue(path, value.splice(1), false)
      return temp
    }

    render() {
      const { name, children, ...props } = this.props

      return (
        <Provider value={props}>
          {typeof children === 'function'
            ? children(props.value, {
                push: this.push,
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
