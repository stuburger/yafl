import React, { Component } from 'react'
import * as _ from 'lodash'
import { Provider } from './Context'
import {
  Path,
  FieldValidatorList,
  FormErrors,
  AggregateValidator,
  ValidatorConfig,
  FormState
} from '../sharedTypes'
import { bind, trueIfAbsent, s, us } from '../utils'

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
    this.buildErrors = bind(this, this.buildErrors)
    this.registerField = bind(this, this.registerField)
    this.unregisterField = bind(this, this.unregisterField)
    this.state = {
      initialMount: false,
      formValue: {},
      active: [],
      touched: {},
      blurred: {},
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

  registerField(path: Path, test: AggregateValidator) {
    this.validators.push({ path, test })
    this.setState(({ registeredFields, touched, blurred }) => {
      return {
        registeredFields: s(registeredFields, path, true),
        touched: s(touched, path, false),
        blurred: s(blurred, path, false)
      }
    })
  }

  unregisterField(path: Path, test?: AggregateValidator) {
    if (test) {
      this.validators.filter(validator => validator.test !== test)
    }
    this.setState(({ registeredFields, touched, blurred }) => {
      return {
        registeredFields: us(registeredFields, path),
        touched: us(touched, path),
        blurred: us(blurred, path)
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
    this.setState(({ touched }) => ({
      touched: s(touched, path, touched)
    }))
  }

  visitField(path: Path, visited: boolean) {
    this.setState(({ blurred }) => ({
      blurred: s(blurred, path, visited)
    }))
  }

  setActiveField(active: Path) {
    this.setState({ active })
  }

  clearForm() {
    const { defaultValue = {} as any } = this.props
    this.setState({
      formValue: defaultValue,
      touched: {},
      blurred: {},
      submitCount: 0
    })
  }

  resetForm() {
    this.setState(({ initialFormValue }) => ({
      formValue: initialFormValue,
      submitCount: 0
    }))
  }

  forgetState() {
    this.setState(({ touched, blurred }) => ({
      touched: {}, // todo
      blurred: {}, // todo
      submitCount: 0
    }))
  }

  buildErrors(): FormErrors {
    const { formValue } = this.state
    const ret: FormErrors = {}
    this.validators.forEach(({ test }) => test(formValue, ret))
    return ret
  }

  render() {
    const { defaultValue } = this.props
    return (
      <Provider
        value={{
          path: [],
          ...this.state,
          defaultValue,
          formIsValid: true,
          formIsDirty: false,
          errors: this.buildErrors(),
          onSubmit: this.submit,
          setValue: this.setValue,
          clearForm: this.clearForm,
          resetForm: this.resetForm,
          value: this.state.formValue,
          visitField: this.visitField,
          touchField: this.touchField,
          defaultFormValue: defaultValue,
          renameField: this.renameField,
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
    if (!np.rememberStateOnReinitialize) {
      // state.initialFormValue = initialValue  TODO
      state.submitCount = 0
      state.touched = {}
      state.blurred = {}
    }
  }

  return state
}
