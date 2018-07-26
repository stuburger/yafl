import * as React from 'react'
import * as PropTypes from 'prop-types'
import {
  FormProvider,
  InnerFieldProps,
  FieldProps,
  InputProps,
  FieldConfig,
  FieldMeta,
  SetFieldValueFunc
} from './sharedTypes'
import { toStrPath, validateName, branchByName } from './utils'
import isEqual from 'react-fast-compare'
import { branchableProps } from './defaults'
import FieldSink from './FieldSink'

const listenForProps: (keyof InnerFieldProps<any, any>)[] = [
  'name',
  'value',
  'parse',
  'errors',
  'render',
  'touched',
  'visited',
  'component',
  'components',
  'submitCount',
  'branchProps',
  'forwardProps'
]

// React.Provider<FormProvider<F, any>>
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
      this.collectMetaProps = this.collectMetaProps.bind(this)
      this._renderComponent = this._renderComponent.bind(this)
      this.collectInputProps = this.collectInputProps.bind(this)
      this.registerField()
    }

    shouldComponentUpdate(np: InnerFieldProps<F, T>) {
      return listenForProps.some(key => !isEqual(np[key], this.props[key]))
    }

    componentWillUnmount() {
      this.unregisterField()
    }

    registerField(): void {
      this.props.registerField(this.props.path)
    }

    unregisterField(): void {
      this.props.unregisterField(this.props.path)
    }

    setValue(value: T | SetFieldValueFunc<T>, touchField = true): void {
      const { path, setValue, value: prev } = this.props
      setValue(path, typeof value === 'function' ? value(prev) : value, touchField)
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
      const { parse, sharedProps, forwardProps } = this.props
      const onChange = this.props.onChange || sharedProps.onChange
      if (typeof onChange === 'function') {
        onChange(e, this.collectProps(), forwardProps)
      }
      if (e.isDefaultPrevented()) return
      const { value } = e.target
      this.setValue(parse ? parse(value) : value)
    }

    onFocus(e: React.FocusEvent<any>): void {
      const { path, setActiveField, sharedProps, forwardProps } = this.props
      const onFocus = this.props.onFocus || sharedProps.onFocus
      if (typeof onFocus === 'function') {
        onFocus(e, this.collectProps(), forwardProps)
      }
      if (e.isDefaultPrevented()) return
      setActiveField(toStrPath(path))
    }

    onBlur(e: React.FocusEvent<any>) {
      const { sharedProps, visited, setActiveField, forwardProps } = this.props
      const onBlur = this.props.onBlur || sharedProps.onBlur

      if (typeof onBlur === 'function') {
        onBlur(e, this.collectProps(), forwardProps)
      }
      if (e.isDefaultPrevented()) return
      if (visited) {
        setActiveField(null)
      } else {
        this.visitField(true)
      }
    }

    collectMetaProps(): FieldMeta<F, T> {
      const p = this.props
      return {
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
        clearForm: p.clearForm
      }
    }

    collectInputProps(): InputProps {
      const { name, value } = this.props
      return {
        value,
        name: name.toString(),
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        onChange: this.onChange
      }
    }

    collectProps(): FieldProps<F, T> {
      const { branchProps, forwardProps } = this.props
      return {
        input: this.collectInputProps(),
        meta: this.collectMetaProps(),
        ...branchProps,
        ...forwardProps
      }
    }

    _renderComponent() {
      const { render, component, components, forwardRef } = this.props
      const props = this.collectProps()
      if (component && typeof component !== 'string') {
        const Component = component
        return <Component ref={forwardRef} {...props} />
      } else if (render) {
        return render(props)
      } else if (typeof component === 'string') {
        if (components[component]) {
          const Component = components[component]
          return <Component ref={forwardRef} {...props} />
        }
        const { input, meta, ...rest } = props
        return React.createElement(component, { ...input, ...rest, ref: forwardRef })
      }
      return <FieldSink path={props.meta.path} {...props} />
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

  return class Field<T, F1 extends object = F> extends React.PureComponent<FieldConfig<F1, T>> {
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
      const {
        name,
        parse,
        render,
        children,
        component,
        onBlur,
        onChange,
        onFocus,
        forwardRef,
        ...forwardProps
      } = this.props

      return (
        <FieldConsumer<T, F1>
          key={name}
          forwardRef={forwardRef}
          parse={parse}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          render={render}
          children={children}
          component={component}
          forwardProps={{ ...ip.sharedProps, ...forwardProps }}
          {...branchByName(name, ip, branchableProps)}
        />
      )
    }

    render() {
      validateName(this.props.name)
      return <Consumer>{this._render}</Consumer>
    }
  }
}
