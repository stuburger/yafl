import * as React from 'react'
import * as PropTypes from 'prop-types'
import {
  FormProvider,
  InnerFieldProps,
  FieldProps,
  InputProps,
  FieldConfig,
  FieldMeta,
  SetFieldValueFunc,
  Path
} from './sharedTypes'
import { toStrPath, validateName, branchByName, isSetFunc, toArray } from './utils'
import isEqual from 'react-fast-compare'
import { branchableProps } from './defaults'
import FieldSink from './FieldSink'
import createValidator, { ValidatorProps } from './createValidator'

const listenForProps: (keyof InnerFieldProps<any, any>)[] = [
  'name',
  'value',
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

const watchDefault = () => false

// React.Provider<FormProvider<F, any>>
function createField(
  Provider: React.Provider<any>,
  Validator: React.ComponentType<ValidatorProps>
) {
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
      this.collectMetaProps = this.collectMetaProps.bind(this)
      this._renderComponent = this._renderComponent.bind(this)
      this.collectInputProps = this.collectInputProps.bind(this)
    }

    shouldComponentUpdate(np: InnerFieldProps<F, T>) {
      const { formValue: prev, watch: watchPrev = watchDefault } = this.props
      const { formValue, watch = watchDefault } = np
      return (
        !isEqual(watch(formValue), watchPrev(prev)) ||
        listenForProps.some(key => !isEqual(np[key], this.props[key]))
      )
    }

    setValue(value: T | SetFieldValueFunc<T>, touchField = true): void {
      const { path, setValue, value: prev } = this.props
      setValue(path, isSetFunc(value) ? value(prev) : value, touchField)
    }

    touchField(touched: boolean): void {
      const { path, touchField } = this.props
      touchField(path, touched)
    }

    visitField(visited: boolean): void {
      const { path, visitField } = this.props
      visitField(path, visited)
    }

    onChange(e: React.ChangeEvent<any>) {
      const { sharedProps, forwardProps } = this.props
      const onChange = this.props.onChange || sharedProps.onChange
      if (typeof onChange === 'function') {
        onChange(e, this.collectProps(), forwardProps)
      }
      if (e.isDefaultPrevented()) return
      const { value: val, type, checked } = e.target

      let value = val
      if (/number|range/.test(type)) {
        const par = parseFloat(value)
        value = isNaN(par) ? '' : par
      } else if (isCheckInput(type)) {
        value = checked
      }

      this.setValue(value)
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
      const path = toStrPath(p.path)
      return {
        path,
        errors: (p.errors || []) as any,
        visited: !!p.visited,
        touched: !!p.touched,
        setValue: this.setValue,
        setTouched: this.touchField,
        setVisited: this.visitField,
        initialValue: p.initialValue,
        defaultValue: p.defaultValue,
        isValid: ((p.errors || []) as any).length === 0,
        isActive: p.activeField !== null && p.activeField === path,
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
      const { value, name, forwardProps: fp } = this.props
      return {
        name: name.toString(),
        value: isCheckInput(fp.type) ? fp.value : value,
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
      }

      if (render) {
        return render(props)
      }

      if (typeof component === 'string') {
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
      const {
        name,
        render,
        component,
        forwardProps,
        validate = [],
        children,
        ...props
      } = this.props
      const { value, formValue } = this.props
      const validators = toArray(validate)

      return (
        <Provider value={props}>
          {this._renderComponent()}
          {validators.reduceRight<React.ReactNode>(
            (ret, test) => (
              <Validator msg={test(value, formValue)}>{ret}</Validator>
            ),
            null
          )}
        </Provider>
      )
    }
  }
}

export default function<F extends object>(context: React.Context<FormProvider<any, any>>) {
  const Validator = createValidator(context)
  const FieldConsumer = createField(context.Provider, Validator)

  return class Field<T, F1 extends object = F> extends React.PureComponent<FieldConfig<F1, T>> {
    context!: FormProvider<F, any>
    path: Path

    static contextType = context

    static propTypes = {
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string,
      render: PropTypes.func,
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.node])
    }

    constructor(props: FieldConfig<F1, T>, context: FormProvider<F, any>) {
      super(props, context)
      validateName(props.name)
      this.path = context.path.concat(props.name)
      this.context.registerField(this.path)
    }

    componentWillUnmount() {
      this.context.unregisterField(this.path)
    }

    _render(ip: FormProvider<F1, any>) {}

    render() {
      const {
        name,
        render,
        children,
        component,
        watch,
        onBlur,
        onChange,
        onFocus,
        forwardRef,
        validate,
        ...forwardProps
      } = this.props
      const context = this.context

      return (
        <FieldConsumer<T, F1>
          key={name}
          watch={watch}
          forwardRef={forwardRef}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          render={render}
          children={children}
          component={component}
          validate={validate}
          forwardProps={{ ...context.sharedProps, ...forwardProps }}
          {...branchByName(name, context, branchableProps)}
        />
      )
    }
  }
}

const isCheckInput = (type?: string): type is 'radio' | 'checkbox' => {
  return type === 'radio' || type === 'checkbox'
}
