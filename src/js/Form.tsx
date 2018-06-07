import * as React from 'react'
import * as _ from 'lodash'
import { Provider } from './Context'
import {
  Path,
  ValidatorConfig,
  FormState,
  Touched,
  Visited,
  ValidateOn,
  FormErrors,
  Validator,
  RegisteredField,
  RegisteredFields
} from '../sharedTypes'
import { bind, trueIfAbsent, s, us, shallowCopy } from '../utils'

const noop = (...params: any[]) => {
  console.log('not loaded or field non existent')
}

const default_validate_on = 'blur'

const startingPath: Path = []

function onlyIfLoaded(func: any, defaultFunc = noop) {
  func = bind(this, func)
  return bind(this, function(...params: any[]) {
    if (!this.state.isBusy) {
      return func(...params)
    }
    return defaultFunc(...params)
  })
}

export interface FormConfig<T = any> extends ValidatorConfig<T> {
  initialValue?: T
  defaultValue?: T
  onSubmit?: (formValue: T) => void
  validateOn?: ValidateOn<T>
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
  validate: any
}

class Form extends React.Component<FormConfig, FormState> {
  registeredFields: RegisteredField<any>[] = []
  constructor(props: FormConfig) {
    super(props)

    const loadedGuard = bind(this, onlyIfLoaded)

    this.submit = loadedGuard(this.submit)
    this.setValue = loadedGuard(this.setValue)
    this.visitField = loadedGuard(this.visitField)
    this.forgetState = loadedGuard(this.forgetState)
    this.clearForm = loadedGuard(this.clearForm)
    this.touchField = loadedGuard(this.touchField)
    this.setActiveField = loadedGuard(this.setActiveField)
    this.renameField = loadedGuard(this.renameField)
    this.resetForm = loadedGuard(this.resetForm)
    this.setFormValue = loadedGuard(this.setFormValue)
    this.setTouched = loadedGuard(this.setTouched)
    this.setVisited = loadedGuard(this.setVisited)
    this.registerField = bind(this, this.registerField)
    this.unregisterField = bind(this, this.unregisterField)
    this.flush = bind(this, this.flush)
    this.state = {
      initialMount: false,
      formValue: {},
      activeField: [],
      touched: {},
      visited: {},
      loaded: false,
      isBusy: false,
      submitting: false,
      formIsTouched: false,
      registeredFields: {},
      initialFormValue: {},
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
    if (this.registeredFields.length > 0) {
      let fields: RegisteredFields = {}
      while (this.registeredFields.length > 0) {
        const field = this.registeredFields.pop()
        if (field) {
          fields = { ...fields, [field.path.join('.')]: field }
        }
      }
      this.setState(({ registeredFields }) => ({
        registeredFields: { ...registeredFields, ...fields }
      }))
    }
  }

  registerField(path: Path, type: 'section' | 'field', validate: Validator) {
    this.registeredFields.push({ path, type, validate })
  }

  unregisterField(path: Path) {
    this.setState(({ registeredFields: prev, touched, visited }) => {
      const registeredFields = { ...prev }
      delete registeredFields[path.join('.')]
      return {
        registeredFields,
        touched: us(touched, path),
        visited: us(visited, path)
      }
    })
  }

  submit() {
    const { onSubmit = noop } = this.props
    this.setState(({ submitCount }) => ({
      submitCount: submitCount + 1
    }))
    onSubmit(this.state.formValue)
  }

  setValue(path: Path, val: any, setTouched = true) {
    this.setState(({ formValue, touched }) => {
      const newValue = s(formValue, path, val)
      const ret = {
        formValue: newValue
      } as FormState
      if (setTouched) {
        ret.touched = s(touched, path, true)
      }
      return ret
    })
  }

  setFormValue(val: any, overwrite = false) {
    this.setState(({ formValue }) => {
      return {
        formValue: overwrite ? val : _.merge({}, formValue, val)
      }
    })
  }

  renameField(prevName: Path, nextName: Path) {
    // todo
  }

  touchField(path: Path, touched: boolean) {
    this.setState(({ touched: prev }) => ({
      touched: s(prev, path, touched)
    }))
  }

  setTouched(touched: Touched, overwrite = false) {
    this.setState(({ touched: prev }) => ({
      touched: overwrite ? touched : _.merge({}, prev, touched)
    }))
  }

  visitField(path: Path, visited: boolean) {
    this.setState(({ visited: prev }) => ({
      visited: s(prev, path, visited)
    }))
  }

  setVisited(visited: Visited, overwrite = false) {
    this.setState(({ visited: prev }) => {
      return {
        visited: overwrite ? visited : _.merge({}, prev, visited)
      }
    })
  }

  setActiveField(activeField: Path) {
    this.setState({ activeField })
  }

  clearForm() {
    const { defaultValue = {} as any } = this.props
    this.setState(() => ({
      touched: {},
      visited: {},
      registeredFields: {},
      formValue: defaultValue,
      submitCount: 0
    }))
  }

  resetForm() {
    this.setState(({ initialFormValue }) => ({
      formValue: initialFormValue,
      submitCount: 0
    }))
  }

  forgetState() {
    this.setState(({ registeredFields }) => ({
      touched: {},
      visited: {},
      submitCount: 0
    }))
  }

  render() {
    const { defaultValue, validateOn, validate } = this.props
    const { registeredFields, formValue, touched, visited, submitCount, loaded } = this.state

    const errors = loaded
      ? Object.values(registeredFields).reduce((ret: FormErrors, curr: RegisteredField) => {
          const value = _.get(formValue, curr.path)
          const error = (curr.validate as any)(value, formValue, '', {
            touched,
            visited,
            submitCount
          })
          if (error && error.length) {
            _.set(ret, curr.type === 'section' ? [...curr.path, '_error'] : curr.path, error)
          }
          return ret
        }, {})
      : {}

    console.log(errors)

    return (
      <Provider
        value={{
          validateOn,
          path: startingPath,
          defaultValue,
          ...this.state,
          errors: _.merge({}, errors, validateForm(validate, this.state)),
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
          renameField: this.renameField,
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

type Error = string | string[]
type GetError = (obj: any) => Error

function validateForm<T>(validate: any, { formValue, touched, visited, submitCount }: FormState) {
  const obj: FormErrors = {}
  const setError = (path: Path | string, error: Error | GetError) => {
    if (typeof error === 'string') {
      error = [error]
      _.set(obj, path, error)
    } else if (typeof error === 'function') {
      const fieldTouched = _.get(touched, path)
      const fieldVisited = _.get(visited, path)
      let result = error({ touched: fieldTouched, visited: fieldVisited })
      if (typeof result === 'string') {
        result = [result]
      }
      if (result && result.length) {
        _.set(obj, path, result)
      }
    } else if (Array.isArray(error)) {
      _.set(obj, path, error)
    }
    return obj
  }
  // if a value is returned then that value takes priority
  return validate(formValue, { setError, submitCount }) || obj
}

function getDerivedStateFromProps(np: FormConfig, ps: FormState): Partial<FormState> {
  const loaded = trueIfAbsent(np.loaded)
  const submitting = !!np.submitting

  const state: Partial<FormState> = {
    loaded,
    submitting,
    isBusy: !loaded || submitting
  }

  if (!loaded) {
    state.formValue = np.defaultValue || {}
    return state
  }

  const base = Array.isArray(np.defaultValue) ? [] : {}

  const initialValue = _.defaultsDeep(
    base,
    np.initialValue || shallowCopy(base),
    np.defaultValue || shallowCopy(base)
  )

  if (!ps.loaded && loaded) {
    state.initialFormValue = initialValue
    state.formValue = initialValue
  } else if (np.loaded && np.allowReinitialize && !_.isEqual(ps.initialFormValue, initialValue)) {
    state.formValue = initialValue
    state.initialFormValue = initialValue
    if (!np.rememberStateOnReinitialize) {
      state.submitCount = 0
      state.touched = {}
      state.visited = {}
    }
  }
  return state
}

export default Form
