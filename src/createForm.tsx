import * as React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'
import set from 'lodash.set'
import merge from 'lodash.merge'
import defaultsDeep from 'lodash.defaultsdeep'
import { toStrPath, noop, isObject } from './utils'
import isEqual from 'react-fast-compare'
import immutable from 'object-path-immutable'
import {
  Path,
  FormState,
  FormProvider,
  BooleanTree,
  ComponentTypes,
  RegisteredField,
  RegisteredFields,
  CommonFieldProps
} from './sharedTypes'
import FieldSink from './FieldSink'
import { DefaultFieldTypeKey, DefaultGizmoTypeKey } from './defaults'
import GizmoSink from './GizmoSink'

const startingPath: Path = []

export interface FormConfig<T extends object> {
  initialValue?: T
  defaultValue?: T
  children: React.ReactNode
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
      this.registerField = this.registerField.bind(this)
      this.unwrapFormState = this.unwrapFormState.bind(this)
      this.unregisterField = this.unregisterField.bind(this)
      this.registerError = this.registerError.bind(this)
      this.unregisterError = this.unregisterError.bind(this)
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
        errorCount: 0,
        touchCount: 0,
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
      rememberStateOnReinitialize: false
    }

    componentDidMount() {
      this.setState({ initialMount: true })
    }

    componentDidUpdate(pp: FormConfig<F>) {
      this.flush()
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

    registerError(path: Path, error: string) {
      this.setState(({ errors: prev, errorCount }) => {
        const curr = get(prev, path as string[], [])
        const errs = Array.isArray(curr) ? [...curr, error] : [error]
        return { errors: immutable.set(prev, path as string[], errs), errorCount: errorCount + 1 }
      })
    }

    unregisterError(path: Path, error: string) {
      this.setState(({ errors: prev, errorCount }) => {
        const curr: string[] = get(prev, path as string[], [])
        return {
          errors: immutable.set(prev, path as string[], curr.filter(x => x !== error)),
          errorCount: errorCount - 1
        }
      })
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
      this.setState(({ formValue: prev, touched, touchCount }) => ({
        touchCount: touchCount + 1,
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
      this.setState(({ touched: prev, touchCount }) => ({
        touchCount: touchCount + 1,
        touched: immutable.set(prev, path as string[], touched)
      }))
    }

    setTouched(touched: BooleanTree<F>, overwrite = false) {
      this.setState(({ touched: prev, touchCount }) => ({
        touchCount: touchCount + 1,
        touched: overwrite ? touched : merge({}, prev, touched)
      }))
    }

    visitField(path: Path, visited: boolean) {
      this.setState(({ visited: prev }) => ({
        activeField: null,
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
      const { commonFieldProps = {}, componentTypes = {} } = this.props
      const { errorCount, formValue, initialValue, initialMount, touchCount, ...state } = this.state

      return (
        <Provider
          value={{
            ...state,
            formValue,
            errorCount,
            touchCount,
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
            setTouched: this.setTouched,
            setVisited: this.setVisited,
            forgetState: this.forgetState,
            setFormValue: this.setFormValue,
            registerError: this.registerError,
            unregisterError: this.unregisterError,
            registerField: this.registerField,
            setActiveField: this.setActiveField,
            unregisterField: this.unregisterField,
            unwrapFormState: this.unwrapFormState,
            initialValue: initialValue || ({} as F),
            formIsValid: !initialMount || errorCount === 0,
            formIsTouched: initialMount && touchCount > 0,
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
