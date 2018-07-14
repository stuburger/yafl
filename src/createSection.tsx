import * as React from 'react'
import * as PropTypes from 'prop-types'
import { validateName, forkByName } from './utils'
import isEqual from 'react-fast-compare'
import { Name, FormProvider, Path } from './sharedTypes'
import { forkableProps } from './defaults'

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T> {
  name: Name
  children: React.ReactNode
}

const listenForProps: (keyof ForkProviderConfig<any, any>)[] = [
  'value',
  'errors',
  'touched',
  'visited',
  'forkable',
  'children',
  'errorCount',
  'submitCount',
  'activeField'
]

function createForkProvider<F extends object>(Provider: React.Provider<FormProvider<F, any>>) {
  return class ForkProvider<T> extends React.Component<ForkProviderConfig<F, T>> {
    unmounted = false
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
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
      this.unregisterField(this.props.path)
      this.unmounted = true
    }

    render() {
      const { name, children, unregisterField, ...props } = this.props
      return (
        <Provider value={{ ...props, unregisterField: this.unregisterField }}>{children}</Provider>
      )
    }
  }
}

export interface SectionConfig<T> {
  name: Name
  fallback?: T
  children: React.ReactNode
}

export default function<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>,
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  const InnerComponent = createForkProvider<F>(Provider)

  return class Section<T extends object> extends React.PureComponent<SectionConfig<T>> {
    static propTypes = {
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      children: PropTypes.node.isRequired
    }

    constructor(props: SectionConfig<T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(ip: FormProvider<F, any>) {
      const { children, name, fallback } = this.props

      return (
        <InnerComponent<T> key={name} {...forkByName(name, ip, forkableProps, fallback)}>
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
