import * as React from 'react'
import PropTypes from 'prop-types'
import { FormProvider, InnerFieldProps, FieldProps, InputProps, FieldConfig } from './sharedTypes'
import { toStrPath, validateName, forkByName } from './utils'
import isEqual from 'react-fast-compare'
import { DefaultFieldTypeKey, forkableProps } from './defaults'

const listenForProps: (keyof InnerFieldProps<any, any>)[] = [
  'name',
  'value',
  'parse',
  'errors',
  'touched',
  'visited',
  'submitCount',
  'forwardProps',
  'componentTypes',
  'commonFieldProps'
]

// React.Provider<FormProvider<F, any>>
// TODO provider types
function createField(Provider: React.Provider<any>) {
  return class FieldConsumer<T, F extends object> extends React.Component<InnerFieldProps<F, T>> {
    constructor(props: InnerFieldProps<F, T>) {
      super(props)
      this.onBlur = this.onBlur.bind(this)
      this.onFocus = this.onFocus.bind(this)
      this.onChange = this.onChange.bind(this)
      this.setValue = this.setValue.bind(this)
      this.touchField = this.touchField.bind(this)
      this.visitField = this.visitField.bind(this)
      this.collectProps = this.collectProps.bind(this)
      this.registerField = this.registerField.bind(this)
      this.unregisterField = this.unregisterField.bind(this)
      this._renderComponent = this._renderComponent.bind(this)
      this.registerField()
    }

    shouldComponentUpdate(np: InnerFieldProps<F, T>) {
      return listenForProps.some(key => !isEqual(np[key], this.props[key]))
    }

    componentWillUnmount() {
      this.unregisterField()
    }

    registerField(): void {
      const { registerField, path } = this.props
      registerField(path, 'field')
    }

    unregisterField(): void {
      const { path, unregisterField } = this.props
      unregisterField(path)
    }

    setValue(value: T, touchField = true): void {
      const { path, setValue } = this.props
      setValue(path, value, touchField)
    }

    touchField(touched: boolean): void {
      const { touchField, path } = this.props
      touchField(path, touched)
    }

    visitField(visited: boolean): void {
      const { visitField, path } = this.props
      visitField(path, visited)
    }

    onChange(e: React.ChangeEvent<any>) {
      const { forwardProps, parse } = this.props
      if (forwardProps.onChange) {
        forwardProps.onChange(e)
      }
      if (e.isDefaultPrevented()) return
      const { value } = e.target
      this.setValue(parse ? parse(value) : value)
    }

    onFocus(e: React.FocusEvent<any>): void {
      const { forwardProps, setActiveField, path } = this.props
      if (forwardProps.onFocus) {
        forwardProps.onFocus(e)
      }
      setActiveField(toStrPath(path))
    }

    onBlur(e: React.FocusEvent<any>) {
      const { visited, setActiveField, forwardProps } = this.props
      if (forwardProps.onBlur) {
        forwardProps.onBlur(e)
      }
      if (e.isDefaultPrevented()) return
      if (visited) {
        setActiveField(null)
      } else {
        this.visitField(true)
      }
    }

    collectProps(): FieldProps<F, T> {
      const p = this.props

      const input: InputProps = {
        name: p.name,
        value: p.value,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        onChange: this.onChange
      }

      return {
        input,
        path: toStrPath(p.path),
        errors: (p.errors || []) as any,
        visited: !!p.visited,
        touched: !!p.touched,
        setValue: this.setValue,
        setTouched: this.touchField,
        setVisited: this.visitField,
        initialValue: p.initialValue,
        defaultValue: p.defaultValue,
        isValid: ((p.errors || []) as any).length === 0,
        isActive: p.activeField !== null && p.activeField === toStrPath(p.path),
        isDirty: p.formIsDirty && p.initialValue === p.value,
        submit: p.submit,
        formValue: p.formValue,
        resetForm: p.resetForm,
        setFormValue: p.setFormValue,
        submitCount: p.submitCount,
        forgetState: p.forgetState,
        setFormVisited: p.setFormVisited,
        setFormTouched: p.setFormTouched,
        clearForm: p.clearForm,
        ...p.commonFieldProps,
        ...p.forwardProps
      }
    }

    _renderComponent() {
      const { render, component, componentTypes } = this.props
      const props = this.collectProps()
      if (component) {
        if (typeof component === 'string') {
          if (componentTypes[component]) {
            const Component = componentTypes[component]
            return <Component {...props} />
          }
          return React.createElement(component, { ...props.input, ...props.forwardProps })
        }
        const Component = component
        return <Component {...props} />
      }

      if (render) {
        return render(props)
      }

      const DefaultComponent = this.props.componentTypes[DefaultFieldTypeKey]
      return <DefaultComponent {...props} />
    }

    render() {
      const { name, render, component, forwardProps, children, ...rest } = this.props
      return <Provider value={rest}>{this._renderComponent()}</Provider>
    }
  }
}

export default function<F extends object>(
  Provider: React.Provider<FormProvider<any, any>>,
  Consumer: React.Consumer<FormProvider<any, any>>
) {
  const FieldConsumer = createField(Provider)

  return class Field<T, F1 extends F = F> extends React.PureComponent<FieldConfig<F1, T>> {
    static propTypes = {
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string,
      render: PropTypes.func,
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.node])
    }

    constructor(props: FieldConfig<F1, T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(ip: FormProvider<F1, any>) {
      const { name, parse, render, children, component, ...forwardProps } = this.props

      return (
        <FieldConsumer<T, F1>
          key={name}
          parse={parse}
          render={render}
          children={children}
          component={component}
          forwardProps={forwardProps}
          commonFieldProps={ip.commonFieldProps}
          {...forkByName(name, ip, forkableProps)}
        />
      )
    }

    render() {
      validateName(this.props.name)
      return <Consumer>{this._render}</Consumer>
    }
  }
}
