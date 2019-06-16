import * as React from 'react'
import PropTypes from 'prop-types'
import { get, noop, toStrPath, constructFrom, assignDefaults } from './utils'
import isEqual from 'react-fast-compare'
import immutable from 'object-path-immutable'
import {
  Path,
  FormState,
  FormProvider,
  SetFormValueFunc,
  SetFormVisitedFunc,
  SetFormTouchedFunc,
  FormConfig,
  FormProps
} from './sharedTypes'

const startingPath: Path = []

function childrenIsFunc<F extends object>(
  children: Function | React.ReactNode
): children is (props: FormProps<F>) => React.ReactNode {
  return typeof children === 'function'
}

function whenEnabled(func: Function, defaultFunc = noop) {
  return (...params: any[]) => {
    if (!this.state.initialMount || this.props.disabled) {
      return defaultFunc(...params)
    }
    return func(...params)
  }
}

export default function<F extends object>(Provider: React.Provider<FormProvider<F, F>>) {
  return class Form extends React.Component<FormConfig<F>, FormState<F>> {
    static propTypes /* remove-proptypes */ = {
      onSubmit: PropTypes.func.isRequired,
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
      initialValue: PropTypes.object,
      defaultValue: PropTypes.object,
      disableReinitialize: PropTypes.bool,
      submitUnregisteredValues: PropTypes.bool,
      rememberStateOnReinitialize: PropTypes.bool,
      persistFieldState: PropTypes.bool,
      sharedProps: PropTypes.object
    }

    registerCache: string[] = []
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
      this.unregisterField = this.unregisterField.bind(this)
      this.registerError = this.registerError.bind(this)
      this.unregisterError = this.unregisterError.bind(this)
      this.incSubmitCount = this.incSubmitCount.bind(this)
      this.collectFormProps = this.collectFormProps.bind(this)

      const { initialValue = {}, defaultValue = {} } = props

      this.state = {
        initialMount: false,
        formValue: assignDefaults({}, initialValue, defaultValue),
        activeField: null,
        touched: {},
        visited: {},
        submitCount: 0,
        errorCount: 0,
        errors: {}
      }
    }

    static defaultProps = {
      disableReinitialize: false,
      rememberStateOnReinitialize: false,
      submitUnregisteredValues: false,
      initialValue: {},
      defaultValue: {},
      initialTouched: {},
      initialVisited: {},
      initialSubmitCount: 0,
      onStateChange: () => false
    }

    componentDidMount() {
      this.setState({ initialMount: true })
    }

    shouldComponentUpdate(pp: FormConfig<F>, ps: FormState<F>) {
      return ps !== this.state || !isEqual(pp, this.props)
    }

    componentDidUpdate(pp: FormConfig<F>, ps: FormState<F>) {
      const {
        onFormValueChange,
        initialValue,
        defaultValue,
        initialTouched,
        initialVisited,
        initialSubmitCount,
        onStateChange,
        disableReinitialize,
        rememberStateOnReinitialize
      } = this.props as Required<FormConfig<F>>

      const { formValue } = this.state

      if (typeof onFormValueChange === 'function' && !isEqual(ps.formValue, formValue)) {
        onFormValueChange(ps.formValue, formValue)
      }

      if (ps !== this.state) {
        onStateChange(ps, this.state)
      }

      if (!disableReinitialize && !isEqual(pp.initialValue, initialValue)) {
        const formValue = assignDefaults({}, initialValue, defaultValue)
        const update = { formValue } as FormState<F>

        if (!rememberStateOnReinitialize) {
          update.touched = initialTouched
          update.visited = initialVisited
          update.submitCount = initialSubmitCount
        }

        this.setState(update)
      }
    }

    registerField(path: Path) {
      this.registerCache.push(toStrPath(path))
    }

    unregisterField(path: Path) {
      const strPath = toStrPath(path)
      this.registerCache = this.registerCache.filter(x => !x.startsWith(strPath))
      if (this.props.persistFieldState) return
      this.setState(({ touched, visited }) => ({
        touched: immutable.del(touched, path as string[]),
        visited: immutable.del(visited, path as string[])
      }))
    }

    registerError(path: Path, error: string) {
      this.setState(({ errors, errorCount }) => {
        const curr = get(errors, path, [])
        const errs = Array.isArray(curr) ? [...curr, error] : [error]
        return {
          errorCount: errorCount + 1,
          errors: immutable.set(errors, path as string[], errs)
        }
      })
    }

    unregisterError(path: Path, error: string) {
      this.setState(({ errors, errorCount }) => {
        const curr: string[] = get(errors, path, [])
        const next = curr.filter(x => x !== error)
        return {
          errors: next.length
            ? immutable.set(errors, path as string[], next)
            : immutable.del(errors, path as string[]),
          errorCount: errorCount - 1
        }
      })
    }

    incSubmitCount() {
      this.setState(({ submitCount }) => ({
        submitCount: submitCount + 1
      }))
    }

    submit() {
      const { submitUnregisteredValues, onSubmit } = this.props

      if (!onSubmit) return

      const { formValue } = this.state
      const props = this.collectFormProps()

      const inc = submitUnregisteredValues
        ? onSubmit(formValue, props)
        : onSubmit(constructFrom(formValue, this.registerCache), props)

      if (inc !== false) {
        this.incSubmitCount()
      }
    }

    setValue(path: Path, val: any, setTouched = true) {
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
        formValue: defaultValue
      }))
    }

    resetForm() {
      const {
        defaultValue = {},
        initialValue = {},
        initialVisited = {},
        initialTouched = {},
        initialSubmitCount = 0
      } = this.props

      this.setState(() => ({
        visited: initialVisited,
        touched: initialTouched,
        submitCount: initialSubmitCount,
        formValue: assignDefaults({}, initialValue, defaultValue)
      }))
    }

    forgetState() {
      this.setState({
        touched: {},
        visited: {},
        submitCount: 0
      })
    }

    collectFormProps(): FormProps<F> {
      const { formValue, errorCount, initialMount, ...state } = this.state
      const { initialValue = {} as F, defaultValue = {} as F } = this.props
      const formIsValid = !initialMount || errorCount === 0

      const startingValue = assignDefaults({}, initialValue, defaultValue)
      const formIsDirty = initialMount && !isEqual(startingValue, formValue)

      return {
        formValue: assignDefaults({}, formValue, defaultValue),
        errorCount,
        formIsDirty,
        formIsValid,
        initialValue,
        initialMount,
        errors: state.errors,
        touched: state.touched,
        visited: state.visited,
        activeField: state.activeField,
        submitCount: state.submitCount,
        submit: this.submit,
        resetForm: this.resetForm,
        clearForm: this.clearForm,
        forgetState: this.forgetState,
        setFormTouched: this.setTouched,
        setFormVisited: this.setVisited,
        setFormValue: this.setFormValue
      }
    }

    render() {
      const { children } = this.props

      const props = this.collectFormProps()

      return (
        <Provider
          value={{
            ...props,
            branchProps: {},
            sharedProps: {},
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
            unregisterField: this.unregisterField
          }}
        >
          {childrenIsFunc<F>(children) ? children(props) : children}
        </Provider>
      )
    }
  }
}
