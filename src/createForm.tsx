import * as React from 'react'
import get from 'lodash.get'
import set from 'lodash.set'
import merge from 'lodash.merge'
import defaultsDeep from 'lodash.defaultsdeep'
import { toArray, toStrPath, any, isString, noop, isObject } from './utils'
import isEqual from 'react-fast-compare'
import immutable from 'object-path-immutable'
import {
  Path,
  FormState,
  ValidateOn,
  FormErrors,
  RegisteredField,
  ValidatorConfig,
  RegisteredFields,
  ValidatorDictionary,
  FormProvider,
  BooleanTree
} from './sharedTypes'

const startingPath: Path = []
const default_validate_on = 'blur'

export interface FormConfig<T extends object> {
  initialValue?: T
  defaultValue?: T
  validate?: any
  children: React.ReactNode
  allowReinitialize?: boolean
  validateOn?: ValidateOn<T, any>
  onSubmit?: (formValue: T) => void
  rememberStateOnReinitialize?: boolean
}

export type Error = string | string[]
export type GetError = (obj: any) => Error

export function validateForm<F extends object>(
  validate: any,
  state: FormState<F>,
  validators: ValidatorDictionary<F>
): FormErrors<F> {
  validate = validate || (() => ({}))
  const obj: FormErrors<F> = {}
  const { formValue, touched, visited, submitCount, registeredFields } = state
  const setError = (path: Path, error: Error | GetError, ignoreFieldValidateOn = false) => {
    const key = toStrPath(path)
    if (!error || !registeredFields[key] || !validators[key]) {
      return obj
    }

    if (ignoreFieldValidateOn || !validators[key].shouldValidate(state)) {
      return obj
    }

    if (typeof error === 'function') {
      const fieldTouched: BooleanTree<F> = get(touched, path)
      const fieldVisited: BooleanTree<F> = get(visited, path)
      const result = toArray(error({ touched: fieldTouched, visited: fieldVisited }))
      if (result.length) {
        return set(obj, path, result)
      }
      return obj
    }

    return set(obj, path, toArray(error))
  }
  // if a value is returned then that value takes priority
  return validate(formValue, { setError, submitCount }) || obj
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
    fieldsToRegister: RegisteredField[] = []
    validators: ValidatorDictionary<F> = {}
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
      this.getErrors = this.getErrors.bind(this)
      this.registerField = this.registerField.bind(this)
      this.unregisterField = this.unregisterField.bind(this)
      this.flush = this.flush.bind(this)
      this.state = {
        initialMount: false,
        formValue: {} as F,
        activeField: null,
        touched: {} as BooleanTree<F>,
        visited: {} as BooleanTree<F>,
        registeredFields: {},
        initialValue: null,
        defaultValue: {} as F,
        submitCount: 0
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
          state.touched = {} as BooleanTree<F>
          state.visited = {} as BooleanTree<F>
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

    registerField(path: Path, type: 'section' | 'field', config: ValidatorConfig<F>) {
      this.fieldsToRegister.push({ path, type })
      this.validators = {
        ...this.validators,
        [toStrPath(path)]: config
      }
    }

    unregisterField(path: Path) {
      const key = toStrPath(path)
      delete this.validators[key]
      this.setState(({ registeredFields: prev, formValue, touched, visited }) => {
        const registeredFields = { ...prev }
        delete registeredFields[key]
        return {
          registeredFields,
          touched: immutable.del(touched, path as string[]),
          visited: immutable.del(visited, path as string[])
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
      // nb. when resetting validators like this it is vital to also
      // reset all registered fields. If a Field detects that is is
      // unregistered on cDU it will re-register itself
      this.validators = {}
      this.setState({
        submitCount: 0,
        registeredFields: {},
        touched: {} as BooleanTree<F>,
        visited: {} as BooleanTree<F>,
        formValue: defaultValue as F
      })
    }

    resetForm() {
      this.validators = {}
      this.setState(({ initialValue }) => ({
        formValue: initialValue || ({} as F),
        registeredFields: {},
        submitCount: 0
      }))
    }

    forgetState() {
      this.setState({
        touched: {} as BooleanTree<F>,
        visited: {} as BooleanTree<F>,
        submitCount: 0
      })
    }

    getErrors(ret: FormErrors<F>, config: ValidatorConfig<F>): FormErrors<F> {
      if (config.shouldValidate(this.state)) {
        // mutable magic happening here..
        config.validate(this.state, ret)
      }
      return ret
    }

    render() {
      const { validateOn = default_validate_on, validate } = this.props
      const { initialMount, defaultValue, touched, initialValue, formValue } = this.state

      let errors: FormErrors<F> = {}
      if (initialMount) {
        errors = Object.values(this.validators).reduce(this.getErrors, errors)
        errors = merge({}, errors, validateForm(validate, this.state, this.validators))
      }

      return (
        <Provider
          value={{
            errors,
            validateOn,
            ...this.state,
            defaultValue,
            initialValue: initialValue || ({} as F),
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
            registerField: this.registerField,
            setActiveField: this.setActiveField,
            unregisterField: this.unregisterField,
            formIsValid: !initialMount || !any(errors, isString),
            formIsTouched: initialMount && any(touched, true),
            formIsDirty: initialMount && !isEqual(initialValue, formValue)
          }}
        >
          {this.props.children}
        </Provider>
      )
    }
  }
}
