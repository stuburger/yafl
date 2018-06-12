import * as React from 'react'
import get from 'lodash.get'
import set from 'lodash.set'
import merge from 'lodash.merge'
import defaultsDeep from 'lodash.defaultsdeep'
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
import { bind, trueIfAbsent, s, us, toArray, toStrPath } from './utils'
import isEqual from 'react-fast-compare'

const noop = (...params: any[]) => {
  console.log('not loaded or field non existent')
}

const startingPath: Path = []
const default_validate_on = 'blur'

function onlyIfLoaded(func: any, defaultFunc = noop) {
  func = bind(this, func)
  return bind(this, function(...params: any[]) {
    if (!this.state.isBusy) {
      return func(...params)
    }
    return defaultFunc(...params)
  })
}

export interface FormConfig<T extends object> {
  initialValue?: T
  defaultValue?: T
  onSubmit?: (formValue: T) => void
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
  validate?: any
  validateOn?: ValidateOn<T, any> // validateOn should be differet at each level
}

export type Error = string | string[]
export type GetError = (obj: any) => Error

export function validateForm<F extends object>(
  validate: any,
  state: FormState<F>,
  validators: ValidatorDictionary<F>
): FormErrors<F> {
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

export function getDerivedStateFromProps<F extends object>(
  np: FormConfig<F>,
  ps: FormState<F>
): Partial<FormState<F>> {
  const loaded = trueIfAbsent(np.loaded)
  const submitting = !!np.submitting

  const state: Partial<FormState<F>> = {
    loaded,
    submitting,
    isBusy: !loaded || submitting
  }

  if (!loaded) {
    state.formValue = np.defaultValue || ({} as F)
    return state
  }

  const base = Array.isArray(np.defaultValue) ? [] : {}

  const initialValue = defaultsDeep(
    base,
    np.initialValue || { ...base },
    np.defaultValue || { ...base }
  )

  if (!ps.loaded && loaded) {
    state.initialFormValue = initialValue
    state.formValue = initialValue
  } else if (np.loaded && np.allowReinitialize && !isEqual(ps.initialFormValue, initialValue)) {
    state.formValue = initialValue
    state.initialFormValue = initialValue
    if (!np.rememberStateOnReinitialize) {
      state.submitCount = 0
      state.touched = {} as BooleanTree<F>
      state.visited = {} as BooleanTree<F>
    }
  }
  return state
}

export default function<F extends object>(Provider: React.Provider<FormProvider<F, F>>) {
  return class Form extends React.Component<FormConfig<F>, FormState<F>> {
    fieldsToRegister: RegisteredField[] = []
    validators: ValidatorDictionary<F> = {}
    constructor(props: FormConfig<F>) {
      super(props)

      const loadedGuard = bind(this, onlyIfLoaded)

      this.submit = loadedGuard(this.submit)
      this.setValue = loadedGuard(this.setValue)
      this.visitField = loadedGuard(this.visitField)
      this.forgetState = loadedGuard(this.forgetState)
      this.clearForm = loadedGuard(this.clearForm)
      this.touchField = loadedGuard(this.touchField)
      this.setActiveField = loadedGuard(this.setActiveField)
      this.resetForm = loadedGuard(this.resetForm)
      this.setFormValue = loadedGuard(this.setFormValue)
      this.setTouched = loadedGuard(this.setTouched)
      this.setVisited = loadedGuard(this.setVisited)
      this.getErrors = bind(this, this.getErrors)
      this.registerField = bind(this, this.registerField)
      this.unregisterField = bind(this, this.unregisterField)
      this.flush = bind(this, this.flush)
      this.state = {
        initialMount: false,
        formValue: {} as F,
        activeField: null,
        touched: {} as BooleanTree<F>,
        visited: {} as BooleanTree<F>,
        loaded: false,
        isBusy: false,
        submitting: false,
        formIsTouched: false,
        registeredFields: {},
        initialFormValue: {} as F,
        submitCount: 0
      }
    }

    static getDerivedStateFromProps = getDerivedStateFromProps

    static defaultProps = {
      initialValue: {},
      defaultValue: {},
      rememberStateOnReinitialize: false,
      allowReinitialize: false,
      validateOn: default_validate_on
    }

    componentDidMount() {
      this.setState({ initialMount: true })
    }

    componentDidUpdate() {
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
          touched: us(touched, path),
          visited: us(visited, path)
        }
      })
    }

    submit(includeUnregisteredFields = false) {
      const { onSubmit = noop } = this.props
      this.setState(({ submitCount }) => ({
        submitCount: submitCount + 1
      }))
      // todo include/exclude registered fields
      onSubmit(this.state.formValue)
    }

    setValue(path: Path, val: any, setTouched = true) {
      this.setState(({ formValue, touched }) => {
        const newValue = s(formValue, path, val)
        const ret = {
          formValue: newValue
        } as FormState<F>
        if (setTouched) {
          ret.touched = s(touched, path, true)
        }
        return ret
      })
    }

    setFormValue(val: any, overwrite = false) {
      this.setState(({ formValue }) => ({
        formValue: overwrite ? val : merge({}, formValue, val)
      }))
    }

    touchField(path: Path, touched: boolean) {
      this.setState(({ touched: prev }) => ({
        touched: s(prev, path, touched)
      }))
    }

    setTouched(touched: BooleanTree<F>, overwrite = false) {
      this.setState(({ touched: prev }) => ({
        touched: overwrite ? touched : merge({}, prev, touched)
      }))
    }

    visitField(path: Path, visited: boolean) {
      this.setState(({ visited: prev }) => ({
        visited: s(prev, path, visited)
      }))
    }

    setVisited(visited: BooleanTree<F>, overwrite = false) {
      this.setState(({ visited: prev }) => {
        return {
          visited: overwrite ? visited : merge({}, prev, visited)
        }
      })
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
      this.setState(() => ({
        touched: {} as BooleanTree<F>,
        visited: {} as BooleanTree<F>,
        registeredFields: {},
        formValue: defaultValue as F,
        submitCount: 0
      }))
    }

    resetForm() {
      this.validators = {}
      this.setState(({ initialFormValue }) => ({
        formValue: initialFormValue,
        registeredFields: {},
        submitCount: 0
      }))
    }

    forgetState() {
      this.setState(() => ({
        touched: {} as BooleanTree<F>,
        visited: {} as BooleanTree<F>,
        submitCount: 0
      }))
    }

    getErrors(ret: FormErrors<F>, config: ValidatorConfig<F>): FormErrors<F> {
      if (config.shouldValidate(this.state)) {
        // mutable magic happening here..
        config.validate(this.state, ret)
      }
      return ret
    }

    render() {
      const { defaultValue = {} as F, validateOn, validate } = this.props
      const { loaded } = this.state

      let errors: FormErrors<F> = {}
      if (loaded) {
        errors = Object.values(this.validators).reduce(this.getErrors, errors)
        errors = merge({}, errors, validateForm(validate, this.state, this.validators))
      }

      return (
        <Provider
          value={{
            errors,
            validateOn: validateOn || default_validate_on,
            path: startingPath,
            defaultValue,
            ...this.state,
            formIsValid: true,
            formIsDirty: false,
            onSubmit: this.submit,
            setValue: this.setValue,
            clearForm: this.clearForm,
            resetForm: this.resetForm,
            value: this.state.formValue,
            visitField: this.visitField,
            touchField: this.touchField,
            defaultFormValue: defaultValue,
            setTouched: this.setTouched,
            setVisited: this.setVisited,
            forgetState: this.forgetState,
            setFormValue: this.setFormValue,
            registerField: this.registerField,
            setActiveField: this.setActiveField,
            unregisterField: this.unregisterField,
            initialValue: this.state.initialFormValue
          }}
        >
          {this.props.children}
        </Provider>
      )
    }
  }
}
