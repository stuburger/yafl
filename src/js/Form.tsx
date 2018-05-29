import React, { Component } from 'react'
import { isEqual, cloneDeep, defaultsDeep } from 'lodash'
import { Provider } from './Context'
import {
  Path,
  FormProps,
  FormState,
  FieldValidatorList,
  FormErrors,
  AggregateValidator
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

export default class Form extends Component<FormProps, FormState> {
  validators: FieldValidatorList = []
  constructor(props: FormProps) {
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
    this.buildErrors = bind(this, this.buildErrors)
    this.registerField = bind(this, this.registerField)
    this.unregisterField = bind(this, this.unregisterField)
    this.state = {
      initialMount: false,
      value: {},
      active: null,
      touched: {},
      blurred: {},
      loaded: false,
      isBusy: false,
      submitting: false,
      formIsDirty: false,
      formIsValid: true,
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
    onSubmit(this.state.value)
  }

  setValue(path: Path, val: any) {
    this.setState(({ value, touched }) => {
      const newValue = s(value, path, val)
      return {
        value: newValue,
        touched: s(touched, path, true)
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

  setActiveField(path: Path) {
    this.setState(() => ({ active: path.join('.') }))
  }

  clearForm() {
    const { defaultValue = {} as any } = this.props
    this.setState({
      value: defaultValue,
      touched: {},
      blurred: {},
      submitCount: 0
    })
  }

  resetForm() {
    this.setState(({ initialFormValue }) => ({
      value: initialFormValue,
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
    const { value } = this.state
    const ret: FormErrors = {}
    this.validators.forEach(({ test }) => test(value, ret))
    return ret
  }

  render() {
    return (
      <Provider
        value={{
          path: [],
          ...this.state,
          errors: this.buildErrors(),
          onSubmit: this.submit,
          setValue: this.setValue,
          clearForm: this.clearForm,
          resetForm: this.resetForm,
          formValue: this.state.value,
          visitField: this.visitField,
          touchField: this.touchField,
          renameField: this.renameField,
          forgetState: this.forgetState,
          registerField: this.registerField,
          unregisterField: this.unregisterField,
          defaultValue: this.props.defaultValue
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}

function getDerivedStateFromProps(np: FormProps, ps: FormState): Partial<FormState> {
  const loaded = trueIfAbsent(np.loaded)
  const submitting = !!np.submitting

  const state: Partial<FormState> = {
    loaded,
    submitting,
    isBusy: !loaded || submitting
  }

  if (!loaded) {
    state.value = np.defaultValue || {}
    return state
  }

  const base = Array.isArray(np.defaultValue) ? [] : {}

  const initialValue = defaultsDeep(
    base,
    np.initialValue || cloneDeep(base),
    np.defaultValue || cloneDeep(base)
  )
  if (!ps.loaded && loaded) {
    state.initialFormValue = initialValue
    state.value = initialValue
    return state
  }

  if (np.loaded && np.allowReinitialize && !isEqual(ps.initialFormValue, initialValue)) {
    state.value = initialValue
    if (!np.rememberStateOnReinitialize) {
      // state.initialFormValue = initialValue  TODO
      state.submitCount = 0
      state.touched = {}
      state.blurred = {}
    }
  }

  return state
}
