import * as React from 'react'
import get from 'lodash.get'
import set from 'lodash.set'
import {
  FormMeta,
  Name,
  FormProvider,
  Validator,
  ValidateOn,
  FormState,
  FormErrors,
  FieldValidator
} from './sharedTypes'
import { toArray, incl, toStrPath } from './utils'
import isEqual from 'react-fast-compare'

export interface InputProps<T = any> {
  name: Name
  value: any
  onBlur: (e: React.FocusEvent<any>) => void
  onFocus: (e: React.FocusEvent<any>) => void
  onChange: (e: React.ChangeEvent<any>) => void
}

export interface FieldProps<F extends object, T = any> {
  input: InputProps<T>
  field: FieldMeta<T>
  form: FormMeta<F>
  [key: string]: any
}

export interface FieldConfig<F extends object, T = any> {
  name: Name
  validate?: Validator<F, T>[]
  validateOn?: ValidateOn<F, T>
  render?: (state: FieldProps<F, T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<F, T>>
  [key: string]: any
}

export interface FieldMeta<T = any> {
  visited: boolean
  isDirty: boolean
  touched: boolean
  isActive: boolean
  isValid: boolean
  errors: string[]
  initialValue: any
  defaultValue: any
  setValue: (value: any) => void
  setVisited: (value: boolean) => void
  setTouched: (value: boolean) => void
}

export interface InnerFieldProps<F extends object, T> extends FormProvider<F, T> {
  name: Name
  formValue: F
  value: T
  initialValue: T
  validate: FieldValidator<F, T>
  validateOn: ValidateOn<F, T>
  render?: (state: FieldProps<F, T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<F, T>>
  forwardProps: { [key: string]: any }
}

const listenForProps: (keyof InnerFieldProps<any, any>)[] = [
  'errors',
  'name',
  'value',
  'touched',
  'visited',
  'validate',
  'validateOn',
  'forwardProps'
]

const emptyValidators: Validator<any, any>[] = []

function createField<F extends object>() {
  return class FieldConsumer<T> extends React.Component<InnerFieldProps<F, T>> {
    constructor(props: InnerFieldProps<F, T>) {
      super(props)
      this.registerField = this.registerField.bind(this)
      this.unregisterField = this.unregisterField.bind(this)
      this.setValue = this.setValue.bind(this)
      this.touchField = this.touchField.bind(this)
      this.visitField = this.visitField.bind(this)
      this.validate = this.validate.bind(this)
      this.shouldValidate = this.shouldValidate.bind(this)
      this.onBlur = this.onBlur.bind(this)
      this.onChange = this.onChange.bind(this)
      this.onFocus = this.onFocus.bind(this)
      this.collectProps = this.collectProps.bind(this)
      this.registerField()
    }

    shouldComponentUpdate(nextProps: InnerFieldProps<F, T>) {
      return listenForProps.some(key => !isEqual(nextProps[key], this.props[key]))
    }

    componentDidUpdate(pp: InnerFieldProps<F, T>) {
      const { registeredFields, path, name } = this.props
      if (pp.name !== name || !registeredFields[toStrPath(path)]) {
        this.registerField()
      }
    }

    componentWillUnmount() {
      this.unregisterField()
    }

    registerField(): void {
      const { registerField, path } = this.props
      registerField(path, 'field', { validate: this.validate, shouldValidate: this.shouldValidate })
    }

    unregisterField(): void {
      const { path, unregisterField } = this.props
      unregisterField(path)
    }

    shouldValidate(state: FormState<F>): boolean {
      const { name, path, validateOn, initialValue, validate } = this.props
      if (!validate || !validate.length) return false
      if (typeof validateOn === 'function') {
        return validateOn(
          {
            name,
            value: get(state.formValue, path),
            touched: get(state.touched, path),
            visited: get(state.visited, path),
            originalValue: initialValue
          },
          name,
          state
        )
      } else {
        return (
          (get(state.visited, path, false) && incl(validateOn, 'blur')) ||
          (get(state.touched, path, false) && incl(validateOn, 'change')) ||
          (state.submitCount > 0 && incl(validateOn, 'submit'))
        )
      }
    }

    validate(state: FormState<F>, ret: FormErrors<F>): string[] {
      const { validate, path, name } = this.props
      const validators = toArray(validate)
      let errors: string[] = []
      const value = get(state.formValue, path)
      errors = validators.reduce((ret, validate) => {
        const result = validate(value, state.formValue, name)
        return result === undefined ? ret : [...ret, ...toArray(result)]
      }, errors)

      if (ret && errors.length) {
        set(ret, path, errors)
      }

      return errors
    }

    setValue(value: any): void {
      const { path, setValue } = this.props
      setValue(path, value)
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
      const { forwardProps } = this.props
      if (forwardProps.onChange) {
        forwardProps.onChange(e)
      }
      if (e.isDefaultPrevented()) return
      this.setValue(e.target.value)
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
      setActiveField(null)
      if (visited || e.isDefaultPrevented()) return
      this.visitField(true)
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

      const field: FieldMeta = {
        errors: (p.errors || []) as any,
        visited: !!p.visited,
        touched: !!p.touched,
        setValue: this.setValue,
        setTouched: this.touchField,
        setVisited: this.visitField,
        initialValue: p.initialValue,
        defaultValue: p.defaultValue,
        isValid: ((p.errors || []) as any).length === 0,
        isActive: p.activeField === toStrPath(p.path),
        isDirty: p.formIsDirty && p.initialValue === p.value
      }

      const form: FormMeta<F> = {
        resetForm: p.resetForm,
        submit: p.submit,
        setFormValue: p.setFormValue,
        forgetState: p.forgetState,
        setVisited: p.setVisited,
        setTouched: p.setTouched,
        clearForm: p.clearForm,
        visitField: p.visitField,
        touchField: p.touchField
      }

      return { input, field, form, ...p.forwardProps }
    }

    render() {
      const { render, component: Component } = this.props

      const props = this.collectProps()
      if (Component) {
        return <Component {...props} />
      }

      if (render) {
        return render(props)
      }
      return null
    }
  }
}

export default function<F extends object>(Consumer: React.Consumer<FormProvider<F, F>>) {
  const FieldConsumer = createField<F>()

  return class Field<T> extends React.PureComponent<FieldConfig<F, T>> {
    constructor(props: FieldConfig<F, T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(ip: FormProvider<F, any>) {
      const {
        name,
        render,
        children,
        component,
        validateOn = ip.validateOn || 'blur',
        validate = emptyValidators,
        ...forwardProps
      } = this.props

      const { value, errors, touched, visited, initialValue, defaultValue, ...props } = ip

      return (
        <FieldConsumer
          {...props}
          name={name}
          render={render}
          children={children}
          component={component}
          validate={validate}
          path={ip.path.concat(name)}
          validateOn={validateOn}
          forwardProps={forwardProps}
          value={get(value, name)}
          errors={get(errors, name)}
          touched={get(touched, name)}
          visited={get(visited, name)}
          initialValue={get(initialValue, name)}
          defaultValue={get(defaultValue, name)}
        />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}
