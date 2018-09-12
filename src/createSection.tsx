import * as React from 'react'
import * as PropTypes from 'prop-types'
import { validateName, branchByName } from './utils'
import isEqual from 'react-fast-compare'
import { Name, FormProvider, Path, SectionHelpers, SetFieldValueFunc } from './sharedTypes'
import { branchableProps } from './defaults'

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T> {
  name: Name
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

const listenForProps: (keyof ForkProviderConfig<any, any>)[] = [
  'value',
  'errors',
  'touched',
  'visited',
  'children',
  'errorCount',
  'submitCount',
  'activeField',
  'sharedProps',
  'branchProps'
]

function createForkProvider<F extends object>(Provider: React.Provider<FormProvider<F, any>>) {
  return class ForkProvider<T> extends React.Component<ForkProviderConfig<F, T>> {
    unmounted = false
    private path: Path
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
      this.path = props.path.concat(props.name)
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
      this.unregisterField(this.path)
      this.unmounted = true
    }

    setValue(value: T | SetFieldValueFunc<T>): void {
      const { setValue, value: prev } = this.props
      setValue(this.path, typeof value === 'function' ? value(prev) : value, false)
    }

    render() {
      const { name, children, unregisterField, path, ...props } = this.props
      return (
        <Provider value={{ ...props, path: this.path, unregisterField: this.unregisterField }}>
          {typeof children === 'function'
            ? children(props.value, {
                setValue: this.setValue
              })
            : children}
        </Provider>
      )
    }
  }
}

export interface SectionConfig<T> {
  name: Name
  fallback?: T
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

export default function<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>,
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  const InnerComponent = createForkProvider<F>(Provider)

  return class Section<T extends object> extends React.PureComponent<SectionConfig<T>> {
    static propTypes = {
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
    }

    constructor(props: SectionConfig<T>) {
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
