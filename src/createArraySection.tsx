import * as React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
import { toStrPath, validateName } from './utils'
import { Name, FormProvider } from './sharedTypes'

export interface ArrayHelpers<T> {
  push: (value: T) => void
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
      this.remove = this.remove.bind(this)
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

    render() {
      const { name, children, ...props } = this.props

      return (
        <Provider value={props}>
          {typeof children === 'function'
            ? children(props.value, { push: this.push, insert: this.insert, remove: this.remove })
            : children}
        </Provider>
      )
    }
  }
}

export interface ArraySectionConfig<F extends object, T> {
  name: Name
  fallback?: T[]
  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
}

export default function<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>,
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  const InnerComponent = createForkProvider<F>(Provider)

  return class Section<T extends object> extends React.PureComponent<ArraySectionConfig<F, T>> {
    static propTypes = {
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      fallback: PropTypes.array,
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired
    }

    constructor(props: ArraySectionConfig<F, T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(incomingProps: FormProvider<F, any>) {
      const { children, name, fallback } = this.props
      const {
        path,
        value,
        errors,
        touched,
        visited,
        defaultValue,
        initialValue,
        ...props
      } = incomingProps

      return (
        <InnerComponent<T>
          key={name}
          {...props}
          name={name}
          path={path.concat(name)}
          errors={Object(errors)[name]}
          touched={Object(touched)[name]}
          visited={Object(visited)[name]}
          initialValue={initialValue[name]}
          defaultValue={defaultValue[name]}
          value={Object(value)[name] || fallback}
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
