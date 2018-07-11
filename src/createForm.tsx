import * as React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import set from 'lodash.set'
import defaultsDeep from 'lodash.defaultsdeep'
import { noop, isObject, toStrPath } from './utils'
import isEqual from 'react-fast-compare'
import immutable from 'object-path-immutable'
import {
  Path,
  FormState,
  FormProvider,
  ComponentTypes,
  RegisteredField,
  CommonFieldProps,
  SetFormValueFunc,
  SetFormVisitedFunc,
  SetFormTouchedFunc
} from './sharedTypes'
import FieldSink from './FieldSink'
import { DefaultFieldTypeKey, DefaultGizmoTypeKey } from './defaults'
import GizmoSink from './GizmoSink'

// const { whyDidYouUpdate } = require('why-did-you-update')
// whyDidYouUpdate(React)

const startingPath: Path = []

export interface FormConfig<T extends object> {
  initialValue?: T
  defaultValue?: T
  disabled?: boolean
  children: React.ReactNode
  submitUnregisteredValues?: boolean
  allowReinitialize?: boolean
  onSubmit?: (formValue: T) => void
  rememberStateOnReinitialize?: boolean
  commonFieldProps?: CommonFieldProps
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

export default function<F extends object>(Provider: React.Provider<FormProvider<F, F>>) {
  return class Form extends React.Component<FormConfig<F>, FormState<F>> {
    static propTypes = {
      onSubmit: PropTypes.func.isRequired,
      children: PropTypes.node.isRequired,
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
        const value = props[propName]
        if (value === undefined) return
        const isValid =
          isObject(value) &&
          Object.values(value).every(
            comp => comp instanceof React.Component || typeof comp === 'function'
          )
        if (!isValid) {
          return new Error(
            'Invalid prop `' +
              propName +
              '` supplied to' +
              ' `' +
              componentName +
              '`. Validation failed. Make sure all values are valid React components'
          )
        }
      }
    }

    registerCache: RegisteredField[] = []
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
      this.registerField = this.registerField.bind(this)
      this.unwrapFormState = this.unwrapFormState.bind(this)
      this.unregisterField = this.unregisterField.bind(this)
      this.registerError = this.registerError.bind(this)
      this.unregisterError = this.unregisterError.bind(this)
      this.flushCache = this.flushCache.bind(this)
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
        errorCount: 0,
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
      rememberStateOnReinitialize: false,
      submitUnregisteredValues: false
    }

    componentDidMount() {
      this.setState({ initialMount: true })
    }

    componentDidUpdate(pp: FormConfig<F>) {
      this.flushCache()
    }

    flushCache() {
      if (this.registerCache.length > 0) {
        this.setState(({ registeredFields: fields }) => {
          const registeredFields = { ...fields }
          let field: RegisteredField | undefined
          while ((field = this.registerCache.pop())) {
            registeredFields[toStrPath(field.path)] = true
          }
          return { registeredFields }
        })
      }
    }

    registerField(path: Path, type: 'section' | 'field') {
      this.registerCache.push({ path, type })
    }

    unregisterField(path: Path) {
      this.setState(({ registeredFields, touched, visited }) => {
        return {
          touched: immutable.del(touched, path as string[]),
          visited: immutable.del(visited, path as string[]),
          registeredFields: immutable.del(registeredFields, path as string[])
        }
      })
    }

    registerError(path: Path, error: string) {
      this.setState(({ errors, errorCount }) => {
        const curr = get(errors, path as string[], [])
        const errs = Array.isArray(curr) ? [...curr, error] : [error]
        return {
          errorCount: errorCount + 1,
          errors: immutable.set(errors, path as string[], errs)
        }
      })
    }

    unregisterError(path: Path, error: string) {
      this.setState(({ errors, errorCount }) => {
        const curr: string[] = get(errors, path as string[], [])
        const next = curr.filter(x => x !== error)
        return {
          errors: next.length
            ? immutable.set(errors, path as string[], next)
            : immutable.del(errors, path as string[]),
          errorCount: errorCount - 1
        }
      })
    }

    submit() {
      const { submitUnregisteredValues, onSubmit = noop } = this.props
      const { formValue, registeredFields } = this.state
      this.setState(({ submitCount }) => ({
        submitCount: submitCount + 1
      }))
      if (submitUnregisteredValues) {
        return onSubmit(formValue)
      }
      let retval: F = {} as F
      Object.keys(registeredFields).forEach(path => {
        set(retval, path, get(formValue, path))
      })
      onSubmit(retval)
    }

    setValue(path: Path, val: any, setTouched = true) {
      // if (!get(this.state.registeredFields, path as string[])) return
      this.setState(({ formValue, touched }) => ({
        formValue: immutable.set(formValue, path as string[], val),
        touched: setTouched ? immutable.set(touched, path as string[], true) : touched
      }))
    }

    setFormValue(setFunc: SetFormValueFunc<F>) {
      this.setState(({ formValue }) => ({
        formValue: setFunc(formValue)
      }))
    }

    touchField(path: Path, touched: boolean) {
      this.setState(({ touched: prev }) => ({
        touched: immutable.set(prev, path as string[], touched)
      }))
    }

    setTouched(setFunc: SetFormTouchedFunc<F>) {
      this.setState(({ touched }) => ({
        touched: setFunc(touched)
      }))
    }

    visitField(path: Path, visited: boolean) {
      this.setState(({ visited: prev }) => ({
        activeField: null,
        visited: immutable.set(prev, path as string[], visited)
      }))
    }

    setVisited(setFunc: SetFormVisitedFunc<F>) {
      this.setState(({ visited }) => ({
        visited: setFunc(visited)
      }))
    }

    setActiveField(activeField: string | null) {
      this.setState({ activeField })
    }

    clearForm() {
      const { defaultValue = {} as F } = this.props
      this.setState(() => ({
        submitCount: 0,
        touched: {},
        visited: {},
        formValue: defaultValue
      }))
    }

    resetForm() {
      this.setState(({ initialValue }) => ({
        formValue: initialValue || ({} as F),
        submitCount: 0,
        touched: {},
        visited: {}
      }))
    }

    forgetState() {
      this.setState({
        touched: {},
        visited: {},
        submitCount: 0
      })
    }

    unwrapFormState() {
      return this.state
    }

    render() {
      const { commonFieldProps = {}, componentTypes = {} } = this.props
      const {
        errorCount,
        formValue,
        initialValue,
        initialMount,
        registeredFields,
        ...state
      } = this.state

      return (
        <Provider
          value={{
            ...state,
            formValue,
            errorCount,
            initialMount,
            commonFieldProps,
            path: startingPath,
            submit: this.submit,
            setValue: this.setValue,
            clearForm: this.clearForm,
            resetForm: this.resetForm,
            value: this.state.formValue,
            visitField: this.visitField,
            touchField: this.touchField,
            forgetState: this.forgetState,
            setFormTouched: this.setTouched,
            setFormVisited: this.setVisited,
            setFormValue: this.setFormValue,
            registerError: this.registerError,
            registerField: this.registerField,
            setActiveField: this.setActiveField,
            unregisterError: this.unregisterError,
            unregisterField: this.unregisterField,
            unwrapFormState: this.unwrapFormState,
            initialValue: initialValue || ({} as F),
            formIsValid: !initialMount || errorCount === 0,
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
