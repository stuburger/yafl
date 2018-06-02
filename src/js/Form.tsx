import React, { Component } from 'react'
import * as _ from 'lodash'
import { Provider } from './Context'
import {
  Path,
  FieldValidatorList,
  FormErrors,
  AggregateValidator,
  ValidatorConfig,
  FormState,
  Touched,
  Visited
} from '../sharedTypes'
import { bind, trueIfAbsent, s, us, build } from '../utils'

const noop = (...params: any[]) => {
  console.log('not loaded or field non existent')
}

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

export interface FormConfig<T = any> extends ValidatorConfig<T> {
  initialValue?: T
  defaultValue?: T
  onSubmit?: (formValue: T) => void
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
}

export default class Form extends Component<FormConfig, FormState> {
  validators: FieldValidatorList = []
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
    this.buildErrors = bind(this, this.buildErrors)
    this.registerField = bind(this, this.registerField)
    this.unregisterField = bind(this, this.unregisterField)
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
      registeredFields: [],
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

  registerField(path: Path, test: AggregateValidator) {
    this.validators.push({ path, test })
    this.setState(({ registeredFields, touched, visited }) => {
      return {
        registeredFields: registeredFields.concat([path]),
        touched: s(touched, path, false),
        visited: s(visited, path, false)
      }
    })
  }

  unregisterField(path: Path, test?: AggregateValidator) {
    if (test) {
      this.validators = this.validators.filter(validator => validator.test !== test)
    }
    this.setState(({ registeredFields, touched, visited }) => {
      return {
        registeredFields: registeredFields.filter(x => !_.isEqual(x, path)),
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

  setValue(path: Path, val: any) {
    this.setState(({ formValue, touched }) => {
      const newValue = s(formValue, path, val)
      return {
        formValue: newValue,
        touched: s(touched, path, true)
      }
    })
  }

  // val is of type T
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
    this.setState(({ touched: prev }) => {
      return {
        touched: overwrite ? touched : _.merge({}, prev, touched)
      }
    })
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
    this.setState(({ registeredFields }) => {
      const touched = build<Touched>(registeredFields, false)
      const visited = touched
      return {
        touched,
        visited,
        formValue: defaultValue,
        submitCount: 0
      }
    })
  }

  resetForm() {
    this.setState(({ initialFormValue }) => ({
      formValue: initialFormValue,
      submitCount: 0
    }))
  }

  forgetState() {
    this.setState(({ registeredFields }) => {
      const touched = build<Touched>(registeredFields, false)
      const visited = touched
      return {
        touched,
        visited,
        submitCount: 0
      }
    })
  }

  buildErrors(): FormErrors {
    const { formValue } = this.state
    const ret: FormErrors = {}
    this.validators.forEach(({ test }) => test(formValue, ret))
    return ret
  }

  render() {
    const { defaultValue } = this.props
    const errors = this.buildErrors()
    return (
      <Provider
        value={{
          path: [],
          errors,
          defaultValue,
          ...this.state,
          errorState: errors,
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
          touchedState: this.state.touched,
          visitedState: this.state.visited,
          initialValue: this.state.initialFormValue
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
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
    np.initialValue || _.cloneDeep(base),
    np.defaultValue || _.cloneDeep(base)
  )
  if (!ps.loaded && loaded) {
    state.initialFormValue = initialValue
    state.formValue = initialValue
    return state
  }

  if (np.loaded && np.allowReinitialize && !_.isEqual(ps.initialFormValue, initialValue)) {
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
