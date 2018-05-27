import React, { Component } from 'react'
import {
  isEqual,
  cloneDeep,
  isArray,
  isString,
  defaultsDeep,
  isObject,
  set,
  unset,
  merge,
  isObjectLike,
  transform
} from 'lodash'
import { FormContextProvider } from './Context'

const defaultMessages = []

function onlyIfFieldExists(func, defaultFunc = noop) {
  func = bind(this, func)
  return bind(this, function(fieldName, ...params) {
    if (this.state.registeredFields[fieldName]) {
      return func(fieldName, ...params)
    }
    return defaultFunc(...params)
  })
}

const incl = (arrayOrString, value) => {
  return arrayOrString.includes(value)
}

function getFormState(
  { value, initialFormValue, registeredFields, touched, blurred },
  defaultFormValue
) {
  const state = {}
  for (let fieldName in registeredFields) {
    const value =
      value[fieldName] === undefined
        ? defaultFormValue[fieldName]
        : value[fieldName]
    state[fieldName] = {
      value,
      visited: !!blurred[fieldName],
      touched: !!touched[fieldName],
      originalValue: initialFormValue[fieldName]
    }
  }
  return state
}

function validateField(fieldName, form, validators = []) {
  const messages = []
  const value = form[fieldName]
  for (let validate of validators) {
    const message = validate(value, form, fieldName)
    if (message) {
      messages.push(message)
    }
  }
  return messages
}

function isNullOrUndefined(val) {
  return val === undefined || val === null
}

function isNaN(val) {
  return val !== val
}

function trueIfAbsent(val) {
  const isFalsyType =
    isNullOrUndefined(val) || isNaN(val) || val === '' || val === 0
  return isFalsyType || !!val
}

function bind(_this, func, ...args) {
  return func.bind(_this, ...args)
}

const noop = (...params) => {
  console.log('not loaded or field non existent')
}

const default_validate_on = 'blur'

/*
  guard function for functions that rely on the form being loaded - ie. async loading
  of form data.
*/
function onlyIfLoaded(func, defaultFunc = noop) {
  func = bind(this, func)
  return bind(this, function(...params) {
    if (!this.state.isBusy) {
      return func(...params)
    }
    return defaultFunc(...params)
  })
}

function setLeaves(fields, value) {
  const a = isArray(fields)
  const b = isObjectLike(fields)
  if (a || b) {
    const ret = (a && []) || (b && {})
    for (let key in fields) {
      ret[key] = setLeaves(fields[key], value)
    }
    return ret
  }
  return value
}

function validate(validators, value, formValue = value) {
  if (typeof validators === 'function') {
    return validators(value, formValue)
  }
  const a = isArray(validators)
  const b = isObjectLike(validators)
  if (a || b) {
    const ret = (a && []) || (b && {})
    for (let key in validators) {
      ret[key] = validate(validators[key], value[key], formValue)
    }
    return ret
  }
}

function s(obj, path, val) {
  return set(cloneDeep(obj), path, val)
}

function us(obj, path) {
  return unset(cloneDeep(obj), path)
}

export default class Form extends Component {
  validators = {}

  constructor(props) {
    super(props)

    const loadedGuard = bind(this, onlyIfLoaded)
    const existsGuard = bind(this, onlyIfFieldExists)
    const loadedAndExists = (func, defaultFunc = noop) => {
      func = loadedGuard(func, defaultFunc)
      func = existsGuard(func, defaultFunc)
      return func
    }

    this.submit = loadedGuard(this.submit)
    this.setValue = loadedGuard(this.setValue)
    this.visitField = loadedGuard(this.visitField)
    this.forgetState = loadedGuard(this.forgetState)
    this.clearForm = loadedGuard(this.clearForm)
    this.touchField = loadedGuard(this.touchField)
    this.setActiveField = loadedGuard(this.setActiveField)
    this.renameField = loadedAndExists(this.renameField)
    this.resetForm = loadedGuard(this.resetForm)
    this.registerField = bind(this, this.registerField)
    this.unregisterField = bind(this, this.unregisterField)
    this.registerValidators = bind(this, this.registerValidators)
    this.unregisterValidator = bind(this, this.unregisterValidator)
    this.state = {
      initialMount: false,
      value: {},
      active: null,
      touched: {},
      blurred: {},
      loaded: false,
      isBusy: false,
      registeredFields: {},
      submitting: false,
      submitCount: 0,
      initialFormValue: {},
      formIsDirty: false,
      formIsValid: true,
      errors: {},
      formIsTouched: false
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

  registerValidators(fieldName, opts) {
    this.validators[fieldName] = opts
  }

  unregisterValidator(fieldName) {
    delete this.validators[fieldName]
  }

  registerField(path, validators) {
    this.validators = s(this.validators, path, validators)
    this.setState(({ registeredFields, errors, touched, blurred }) => {
      return {
        registeredFields: s(registeredFields, path, true),
        errors: s(errors, path, []),
        touched: s(touched, path, false),
        blurred: s(blurred, path, false)
      }
    })
  }

  unregisterField(path) {
    this.validators = us(this.validators, path)
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

  setValue(path, val, validateField) {
    this.setState(({ value, touched, errors }) => {
			const newValue = s(value, path, val)
      return {
				value: newValue,
        touched: s(touched, path, true),
        errors: s(errors, path, validateField(val, newValue))
      }
    })
  }

  renameField(prevName, nextName) {
    this.registerValidators(nextName, this.validators[prevName])
    this.unregisterValidator(prevName)
    this.setState(
      ({ touched: a1, blurred: a2, value: a3, registeredFields: a4 }) => {
        const touched = cloneDeep(a1)
        const blurred = cloneDeep(a2)
        const value = cloneDeep(a3)
        const registeredFields = cloneDeep(a4)

        touched[nextName] = touched[prevName]
        blurred[nextName] = blurred[prevName]
        value[nextName] = value[prevName]
        registeredFields[nextName] = registeredFields[prevName]

        delete touched[prevName]
        delete blurred[prevName]
        delete value[prevName]
        delete registeredFields[prevName]

        return { touched, blurred, value, registeredFields }
      }
    )
  }

  touchField(path) {
    this.setState(({ touched }) => ({
      touched: s(touched, path, true)
    }))
  }

  visitField(path) {
    this.setState(({ blurred }) => ({
      blurred: s(blurred, path, true)
    }))
  }

  setActiveField(fieldName) {
    this.setState(() => ({ active: fieldName }))
  }

  clearForm() {
    const { defaultValue = {} } = this.props
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
      <FormContextProvider
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
          registerValidators: this.registerValidators,
          path: []
        }}
      >
        {this.props.children}
      </FormContextProvider>
    )
  }
}

function getDerivedStateFromProps(np, ps) {
  const loaded = trueIfAbsent(np.loaded)
  const submitting = !!np.submitting

  let state = {
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

  if (
    np.loaded &&
    np.allowReinitialize &&
    !isEqual(ps.initialFormValue, initialValue)
  ) {
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
