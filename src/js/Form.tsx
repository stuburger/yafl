import React, { Component } from 'react'
import { isEqual, cloneDeep, defaultsDeep, set, unset } from 'lodash'
import { Provider } from './Context'
import { Touched, Blurred, RegisteredFields, FormErrors } from '../sharedTypes'
import { bind, trueIfAbsent } from '../utils'

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

export type Path = (string | number | (string & number))[]

function s(obj: any, path: Path, val: any) {
  return set(cloneDeep(obj), path, val)
}

function us(obj: any, path: Path) {
  const ret = cloneDeep(obj)
  unset(ret, path)
  return ret
}

export interface FormProps {
  initialValue?: any
  defaultValue?: any
  onSubmit?: (formValue: any) => void
  onChange?: (formValue: any) => void
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
}

export interface FormState {
  initialMount: boolean
  touched: Touched<object>
  blurred: Blurred<object>
  active: string | null
  initialFormValue: any
  value: any
  registeredFields: RegisteredFields<object>
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  formIsDirty: boolean
  formIsValid: boolean
  formIsTouched: boolean
  errors: FormErrors<object>
  submitCount: number
}

export default class Form extends Component<FormProps, FormState> {
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
      errors: {},
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

  registerField(path: Path) {
    this.setState(({ registeredFields, errors, touched, blurred }) => {
      return {
        registeredFields: s(registeredFields, path, true),
        errors: s(errors, path, []),
        touched: s(touched, path, false),
        blurred: s(blurred, path, false)
      }
    })
  }

  unregisterField(path: Path) {
    this.setState(({ registeredFields, errors, touched, blurred }) => {
      return {
        registeredFields: us(registeredFields, path),
        errors: us(errors, path),
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

  setValue(
    path: Path,
    val: any,
    validateField: (value: any, formValue: any, name: string | number) => string[]
  ) {
    this.setState(({ value, touched, errors }) => {
      const newValue = s(value, path, val)
      return {
        value: newValue,
        touched: s(touched, path, true),
        errors: s(errors, path, validateField(val, newValue, path[path.length - 1]))
      }
    })
  }

  renameField(prevName: string, nextName: string) {
    // todo
  }

  touchField(path: Path) {
    this.setState(({ touched }) => ({
      touched: s(touched, path, true)
    }))
  }

  visitField(path: Path) {
    this.setState(({ blurred }) => ({
      blurred: s(blurred, path, true)
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
      touched: {},
      blurred: {},
      submitCount: 0
    }))
  }

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          onSubmit: this.submit,
          setValue: this.setValue,
          clearForm: this.clearForm,
          resetForm: this.resetForm,
          formValue: this.state.value,
          visitField: this.visitField,
          touchField: this.touchField,
          renameField: this.renameField,
          forgetState: this.forgetState,
          setActiveField: this.setActiveField,
          registerField: this.registerField,
          unregisterField: this.unregisterField,
          defaultValue: this.props.defaultValue,
          path: []
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
