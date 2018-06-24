import * as React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import set from 'lodash.set'
import merge from 'lodash.merge'
import defaultsDeep from 'lodash.defaultsdeep'
import { toStrPath, any, isString, noop, isObject, toArray } from './utils'
import isEqual from 'react-fast-compare'
import immutable from 'object-path-immutable'
import {
  Path,
  FormState,
  FormProvider,
  BooleanTree,
  FormErrors,
  ComponentTypes,
  FieldValidator,
  RegisteredField,
  RegisteredFields,
  CommonFieldProps,
  FormValidateOnCustom
} from './sharedTypes'
import FieldSink from './FieldSink'
import { DefaultFieldTypeKey, DefaultGizmoTypeKey } from './defaults'
import GizmoSink from './GizmoSink'

const startingPath: Path = []
const default_validate_on = 'blur'

export interface KeyedValidators<F extends object> {
  [key: string]: FieldValidator<F, any>
}

export interface FormConfig<T extends object> {
  initialValue?: T
  defaultValue?: T
  validate?: (state: FormState<T>) => KeyedValidators<T>
  children: React.ReactNode
  allowReinitialize?: boolean
  validateOn?: FormValidateOnCustom<T>
  onSubmit?: (formValue: T) => void
  rememberStateOnReinitialize?: boolean
  commonFieldProps?: CommonFieldProps<T>
  componentTypes?: ComponentTypes<T>
}

function whenEnabled(func: any, defaultFunc = noop) {
  return (...params: any[]) => {
    if (!this.state.initialMount || this.props.disabled) {
      return defaultFunc(...params)
    }
    return func(...params)
  }
}

export type PathErrors = { path: Path; errors: string[] }

export default function<F extends object>(Provider: React.Provider<FormProvider<F, F>>) {
  return class Form extends React.Component<FormConfig<F>, FormState<F>> {
    static propTypes = {
      onSubmit: PropTypes.func.isRequired,
      children: PropTypes.node.isRequired,
      validate: PropTypes.func,
      validateOn: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      initialValue: PropTypes.object,
      defaultValue: PropTypes.object,
      allowReinitialize: PropTypes.bool,
      rememberStateOnReinitialize: PropTypes.bool,
      commonFieldProps: PropTypes.object,
      componentTypes(
        props: FormConfig<F>,
        propName: 'componentTypes',
        componentName: string
      ): Error | void {
        var value = props[propName] || {}
        const components = Object.values(value)
        const isValid = components.every(
          c => c instanceof React.Component || typeof c === 'function'
        )
        if (!isValid) {
          return new Error(
            'Invalid prop `' +
              propName +
              '` supplied to' +
              ' `' +
              componentName +
              '`. Validation failed.'
          )
        }
      }
    }

    errors: PathErrors[] = []
    removeErrors: Path[] = []
    fieldsToRegister: RegisteredField[] = []
    constructor(props: FormConfig<F>) {
      super(props)

      const disabledGuard = whenEnabled.bind(this)

      this.submit = disabledGuard(this.submit.bind(this))
      this.setValue = disabledGuard(this.setValue.bind(this))
      this.visitField = disabledGuard(this.visitField.bind(this))
      this.forgetState = disabledGuard(this.forgetState.bind(this))
      this.clearForm = disabledGuard(this.clearForm.bind(this))
      this.touchField = disabledGuard(this.touchField.bind(this))
      this.setActiveField = disabledGuard(this.setActiveField.bind(this))
      this.resetForm = disabledGuard(this.resetForm.bind(this))
      this.setFormValue = disabledGuard(this.setFormValue.bind(this))
      this.setTouched = disabledGuard(this.setTouched.bind(this))
      this.setVisited = disabledGuard(this.setVisited.bind(this))
      this.validateIfNeeded = this.validateIfNeeded.bind(this)
      this.buildErrors = this.buildErrors.bind(this)
      this.registerField = this.registerField.bind(this)
      this.unwrapFormState = this.unwrapFormState.bind(this)
      this.unregisterField = this.unregisterField.bind(this)
      this.unsetErrorCount = this.unsetErrorCount.bind(this)
      this.shouldValidate = this.shouldValidate.bind(this)
      this.flush = this.flush.bind(this)
      this.state = {
        initialMount: false,
        formValue: {} as F,
        activeField: null,
        touched: {},
        visited: {},
        registeredFields: {},
        initialValue: null,
        defaultValue: {} as F,
        submitCount: 0,
        errors: {}
      }
    }

    static getDerivedStateFromProps(np: FormConfig<F>, ps: FormState<F>) {
      const state: Partial<FormState<F>> = {}

      const alreadyHasValue = isObject(ps.initialValue)
      const willHaveValue = isObject(np.initialValue)
      // if form is still loading...
      if (!(alreadyHasValue || willHaveValue)) {
        state.formValue = np.defaultValue || ({} as F)
        return state
      }

      let formWillPopulate = !alreadyHasValue && willHaveValue

      let shouldUpdateValue = false
      if (!isEqual(ps.initialValue, np.initialValue)) {
        // regardless of whether allowReinitialize == true,
        // set initialValue to whatever was incoming, this
        // means that when reset is clicked it is reset to whatever
        // the current 'initialValue' is. Check if this is desired,
        // this can always be skipped
        state.initialValue = np.initialValue || ({} as F)
        shouldUpdateValue = true
      }

      if (!isEqual(ps.defaultValue, np.defaultValue)) {
        state.defaultValue = np.defaultValue || ({} as F)
        shouldUpdateValue = true
      }

      if (formWillPopulate || (shouldUpdateValue && np.allowReinitialize)) {
        state.formValue = defaultsDeep({}, np.initialValue || {}, np.defaultValue || {})
        if (np.rememberStateOnReinitialize) {
          state.submitCount = 0
          state.touched = {}
          state.visited = {}
        }
        return state
      }

      return null
    }

    static defaultProps = {
      allowReinitialize: false,
      validateOn: default_validate_on,
      rememberStateOnReinitialize: false
    }

    componentDidMount() {
      this.setState({ initialMount: true })
    }

    componentDidUpdate(pp: FormConfig<F>) {
      this.flush()
      this.buildErrors()
    }

    buildErrors() {
      if (this.unsetErrorCount() === 0) return

      this.setState(({ errors: prev }) => {
        let errors = prev,
          x: PathErrors | undefined,
          path: Path | undefined
        while ((path = this.removeErrors.pop())) errors = immutable.del(errors, path as string[])
        while ((x = this.errors.pop())) errors = immutable.set(errors, x.path as string[], x.errors)
        return { errors }
      })
    }

    shouldValidate() {
      const { validateOn = () => true } = this.props
      return typeof validateOn === 'function' && validateOn(this.state)
    }

    validateIfNeeded(): FormErrors<F> {
      if (!this.shouldValidate()) return {}

      const { validate = () => ({}) } = this.props
      const { formValue } = this.state
      const def = validate(this.state)
      return Object.keys(def).reduce((ret, path) => {
        const valueToTest = get(formValue, path)
        const errors: string[] = []
        toArray(def[path]).forEach(test => {
          const result = test(valueToTest, path, formValue)
          typeof result === 'string' && errors.push(result)
        })
        return set(ret, path, errors)
      }, {})
    }

    unsetErrorCount() {
      return this.removeErrors.length + this.errors.length
    }

    flush() {
      if (this.fieldsToRegister.length > 0) {
        let fields: RegisteredFields = {}
        let field: RegisteredField | undefined
        while ((field = this.fieldsToRegister.pop())) {
          fields[toStrPath(field.path)] = field
        }
        this.setState(({ registeredFields }) => ({
          registeredFields: { ...registeredFields, ...fields }
        }))
      }
    }

    registerField(path: Path, type: 'section' | 'field') {
      this.fieldsToRegister.push({ path, type })
    }

    unregisterField(path: Path) {
      const key = toStrPath(path)
      this.setState(({ registeredFields: prev, errors, touched, visited }) => {
        const registeredFields = { ...prev }
        delete registeredFields[key]
        return {
          registeredFields,
          errors: immutable.del(errors, path as string[]),
          touched: immutable.del(touched, path as string[]),
          visited: immutable.del(visited, path as string[])
        }
      })
    }

    setErrors = (path: Path, errors: string[] | undefined) => {
      if (errors && errors.length) {
        this.errors.push({ path, errors })
      } else {
        this.removeErrors.push(path)
      }
    }

    submit(includeUnregisteredFields = false) {
      const { onSubmit = noop } = this.props
      const { formValue, registeredFields } = this.state
      this.setState(({ submitCount }) => ({
        submitCount: submitCount + 1
      }))

      if (includeUnregisteredFields) {
        onSubmit(formValue)
      } else {
        const retval: F = {} as F
        Object.keys(registeredFields).forEach(key => {
          const path = registeredFields[key].path
          set(retval, path, get(formValue, path))
        })
        onSubmit(retval)
      }
    }

    setValue(path: Path, val: any, setTouched = true) {
      this.setState(({ formValue: prev, touched }) => ({
        formValue: immutable.set(prev, path as string[], val),
        touched: setTouched ? immutable.set(touched, path as string[], true) : touched
      }))
    }

    setFormValue(val: any, overwrite = false) {
      this.setState(({ formValue }) => ({
        formValue: overwrite ? val : merge({}, formValue, val)
      }))
    }

    touchField(path: Path, touched: boolean) {
      this.setState(({ touched: prev }) => ({
        touched: immutable.set(prev, path as string[], touched)
      }))
    }

    setTouched(touched: BooleanTree<F>, overwrite = false) {
      this.setState(({ touched: prev }) => ({
        touched: overwrite ? touched : merge({}, prev, touched)
      }))
    }

    visitField(path: Path, visited: boolean) {
      this.setState(({ visited: prev }) => ({
        visited: immutable.set(prev, path as string[], visited)
      }))
    }

    setVisited(visited: BooleanTree<F>, overwrite = false) {
      this.setState(({ visited: prev }) => ({
        visited: overwrite ? visited : merge({}, prev, visited)
      }))
    }

    setActiveField(activeField: string | null) {
      this.setState({ activeField })
    }

    clearForm() {
      const { defaultValue = {} } = this.props
      this.setState({
        submitCount: 0,
        registeredFields: {},
        errors: {},
        touched: {},
        visited: {},
        formValue: defaultValue as F
      })
    }

    resetForm() {
      this.setState(({ initialValue }) => ({
        errors: {},
        formValue: initialValue || ({} as F),
        registeredFields: {},
        submitCount: 0
      }))
    }

    forgetState() {
      this.setState({
        errors: {},
        touched: {},
        visited: {},
        submitCount: 0
      })
    }

    unwrapFormState() {
      return this.state
    }

    render() {
      const { commonFieldProps = {} as CommonFieldProps<F>, componentTypes = {} } = this.props

      const {
        errors,
        touched,
        formValue,
        defaultValue,
        initialValue,
        initialMount,
        ...state
      } = this.state

      const formErrors = this.validateIfNeeded()

      return (
        <Provider
          value={{
            ...state,
            touched,
            formValue,
            defaultValue,
            initialMount,
            formErrors,
            commonFieldProps,
            fieldErrors: errors,
            path: startingPath,
            submit: this.submit,
            setErrors: this.setErrors,
            setValue: this.setValue,
            clearForm: this.clearForm,
            resetForm: this.resetForm,
            value: this.state.formValue,
            visitField: this.visitField,
            touchField: this.touchField,
            setTouched: this.setTouched,
            setVisited: this.setVisited,
            forgetState: this.forgetState,
            setFormValue: this.setFormValue,
            registerField: this.registerField,
            setActiveField: this.setActiveField,
            unregisterField: this.unregisterField,
            unwrapFormState: this.unwrapFormState,
            allErrors: merge({}, errors, formErrors),
            initialValue: initialValue || ({} as F),
            formIsValid: !initialMount || !any(errors, isString),
            formIsTouched: initialMount && any(touched, true),
            formIsDirty: initialMount && !isEqual(initialValue, formValue),
            componentTypes: {
              ...componentTypes,
              [DefaultFieldTypeKey]: FieldSink,
              [DefaultGizmoTypeKey]: GizmoSink
            }
          }}
        >
          {this.props.children}
        </Provider>
      )
    }
  }
}
