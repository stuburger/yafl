import * as React from 'react'
import PropTypes from 'prop-types'
import { toStrPath, validateName } from './utils'
import isEqual from 'react-fast-compare'
import { Name, FormProvider } from './sharedTypes'

export interface ArrayHelpers<T = any> {
  push: (value: T[keyof T]) => void
}

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T> {
  name: Name
  children: React.ReactNode
}

const listenForProps: (keyof ForkProviderConfig<any, any>)[] = [
  'value',
  'errors',
  'touched',
  'visited',
  'errorCount',
  'submitCount',
  'activeField'
]

function createForkProvider<F extends object>(Provider: React.Provider<FormProvider<F, any>>) {
  return class ForkProvider<T> extends React.Component<ForkProviderConfig<F, T>> {
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
      this.registerField = this.registerField.bind(this)
      this.registerFieldIfNeeded = this.registerFieldIfNeeded.bind(this)
      this.registerField()
    }

    shouldComponentUpdate(np: ForkProviderConfig<F, T>) {
      return listenForProps.some(key => !isEqual(np[key], this.props[key]))
    }

    componentDidUpdate(pp: ForkProviderConfig<F, T>) {
      this.registerFieldIfNeeded()
    }

    componentWillUnmount() {
      const { unregisterField, path } = this.props
      unregisterField(path)
    }

    registerFieldIfNeeded() {
      const { registeredFields, path } = this.props
      if (!registeredFields[toStrPath(path)]) {
        this.registerField()
      }
    }

    registerField() {
      const { path, registerField } = this.props
      registerField(path, 'section')
    }

    render() {
      const { name, children, ...props } = this.props
      return <Provider value={props}>{children}</Provider>
    }
  }
}

export interface SectionConfig<F extends object, T> {
  name: Name
  fallback?: T
  children: React.ReactNode
}

export default function<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>,
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  const InnerComponent = createForkProvider<F>(Provider)

  return class Section<T extends object> extends React.PureComponent<SectionConfig<F, T>> {
    static propTypes = {
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      children: PropTypes.node.isRequired
    }

    constructor(props: SectionConfig<F, T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(incomingProps: FormProvider<F, any>) {
      const { children, name, fallback } = this.props
      const {
        path,
        value,
        touched,
        visited,
        errors,
        initialValue,
        defaultValue,
        ...props
      } = incomingProps

      return (
        <InnerComponent<T>
          key={name}
          {...props}
          name={name}
          path={path.concat(name)}
          touched={Object(touched)[name]}
          visited={Object(visited)[name]}
          errors={Object(errors)[name]}
          value={Object(value)[name] || fallback}
          initialValue={Object(initialValue)[name]}
          defaultValue={Object(defaultValue)[name]}
        >
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
