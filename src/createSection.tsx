import * as React from 'react'
import * as PropTypes from 'prop-types'
import { validateName, branchByName, isSetFunc } from './utils'
import eq from 'react-fast-compare'
import { Name, FormProvider, Path, SectionHelpers, SetFieldValueFunc } from './sharedTypes'
import { branchableProps } from './defaults'

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T> {
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

function childrenIsFunc<T>(
  children: Function | React.ReactNode
): children is ((value: T, utils: SectionHelpers<T>) => React.ReactNode) {
  return typeof children === 'function'
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
    helpers: SectionHelpers<T>
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
      this.setValue = this.setValue.bind(this)
      this.helpers = {
        setValue: this.setValue
      }
    }

    shouldComponentUpdate(np: ForkProviderConfig<F, T>) {
      return listenForProps.some(key => !eq(np[key], this.props[key]))
    }

    setValue(value: T | SetFieldValueFunc<T>): void {
      const { path, setValue, value: prev } = this.props
      setValue(path, isSetFunc(value) ? value(prev) : value, false)
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

export interface SectionConfig<T> {
  name: Name
  fallback?: T
  children: React.ReactNode | ((value: T, utils: SectionHelpers<T>) => React.ReactNode)
}

export default function<F extends object>(context: React.Context<FormProvider<F>>) {
  const InnerComponent = createForkProvider<F>(context.Provider)

  return class Section<T extends object> extends React.PureComponent<SectionConfig<T>, never> {
    unmounted = false
    path: Path
    context!: FormProvider<F, any>

    static propTypes = {
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
    }

    static contextType = context

    constructor(props: SectionConfig<T>) {
      super(props)
      validateName(props.name)
      this.path = this.context.path.concat(props.name)
      this.unregisterField = this.unregisterField.bind(this)
    }

    unregisterField(path: Path) {
      if (this.unmounted) return
      this.context.unregisterField(path)
    }

    componentWillUnmount() {
      this.unregisterField(this.path)
      this.unmounted = true
    }

    render() {
      const { children, name, fallback } = this.props

      return (
        <InnerComponent<T>
          key={name}
          {...branchByName(name, this.context, branchableProps, fallback)}
          path={this.path}
          unregisterField={this.unregisterField}
        >
          {children}
        </InnerComponent>
      )
    }
  }
}
