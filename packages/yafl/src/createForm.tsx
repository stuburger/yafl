/* eslint-disable react/sort-comp */
import * as React from 'react'
import isEqual from 'react-fast-compare'
import * as immutable from 'object-path-immutable'
import { get, constructFrom } from './utils'
import {
  FormState,
  FormProvider,
  SetFormValueFunc,
  SetFormVisitedFunc,
  SetFormTouchedFunc,
  FormConfig,
  FormProps,
  BooleanTree,
} from './sharedTypes'

function childrenIsFunc<F extends object>(
  children: Function | React.ReactNode
): children is (props: FormProps<F>) => React.ReactNode {
  return typeof children === 'function'
}

function whenEnabled(this: React.Component<any, any>, func: Function) {
  return (...params: any[]) => {
    if (this.state.initialMount && !this.props.disabled) {
      return func(...params)
    }
    return undefined
  }
}

function createForm<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>
): React.ComponentType<FormConfig<F>> {
  type RFC = Required<FormConfig<F>>

  class Form extends React.Component<FormConfig<F>, FormState<F>> {
    registerCache: string[] = []

    constructor(props: FormConfig<F>) {
      super(props)

      const disabledGuard = whenEnabled.bind(this)

      this.submit = disabledGuard(this.submit.bind(this))
      this.setValue = disabledGuard(this.setValue.bind(this))
      this.visitField = disabledGuard(this.visitField.bind(this))
      this.forgetState = disabledGuard(this.forgetState.bind(this))
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

      const { initialValue: formValue } = props as RFC

      this.state = {
        formValue,
        initialMount: false,
        activeField: null,
        errorCount: 0,
        errors: {},
        touched: props.initialTouched || {},
        visited: props.initialVisited || {},
        submitCount: props.initialSubmitCount || 0,
      }
    }

    static defaultProps = {
      rememberStateOnReinitialize: false,
      submitUnregisteredValues: false,
      initialValue: {} as F,
      initialTouched: {} as BooleanTree<F>,
      initialVisited: {} as BooleanTree<F>,
      initialSubmitCount: 0,
      onStateChange: () => false,
    }

    componentDidMount() {
      this.setState({ initialMount: true })
    }

    componentDidUpdate(pp: FormConfig<F>, ps: FormState<F>) {
      const {
        onFormValueChange,
        initialValue,
        initialTouched,
        initialVisited,
        initialSubmitCount,
        onStateChange,
        rememberStateOnReinitialize,
      } = this.props as RFC

      const { formValue } = this.state

      if (typeof onFormValueChange === 'function' && !isEqual(ps.formValue, formValue)) {
        onFormValueChange(ps.formValue, formValue)
      }

      if (ps !== this.state) {
        onStateChange(ps, this.state)
      }

      if (!isEqual(pp.initialValue, initialValue)) {
        const update = { formValue: initialValue } as FormState<F>

        if (!rememberStateOnReinitialize) {
          update.touched = initialTouched
          update.visited = initialVisited
          update.submitCount = initialSubmitCount
        }

        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(update)
      }
    }

    // eslint-disable-next-line react/sort-comp
    registerField(path: string) {
      this.registerCache.push(path)
    }

    unregisterField(path: string) {
      const { persistFieldState } = this.props
      this.registerCache = this.registerCache.filter((x) => !x.startsWith(path))
      if (persistFieldState) return
      this.setState(({ touched, visited }) => ({
        touched: immutable.del(touched, path),
        visited: immutable.del(visited, path),
      }))
    }

    registerError(path: string, error: string) {
      this.setState(({ errors, errorCount }) => {
        const curr = get(errors, path, [])
        const errs = Array.isArray(curr) ? [...curr, error] : [error]
        return {
          errorCount: errorCount + 1,
          errors: immutable.set(errors, path, errs),
        }
      })
    }

    unregisterError(path: string, error: string) {
      this.setState(({ errors, errorCount }) => {
        const curr: string[] = get(errors, path, [])
        const next = curr.filter((x) => x !== error)
        return {
          errors: next.length ? immutable.set(errors, path, next) : immutable.del(errors, path),
          errorCount: errorCount - 1,
        }
      })
    }

    incSubmitCount() {
      this.setState(({ submitCount }) => ({
        submitCount: submitCount + 1,
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
        touched: setTouched ? immutable.set(touched, path as string[], true) : touched,
      }))
    }

    setFormValue(setFunc: SetFormValueFunc<F>) {
      this.setState(({ formValue }) => ({
        formValue: setFunc(formValue),
      }))
    }

    touchField(path: Path, touched: boolean) {
      this.setState(({ touched: prev }) => ({
        touched: immutable.set(prev, path as string[], touched),
      }))
    }

    setTouched(setFunc: SetFormTouchedFunc<F>) {
      this.setState(({ touched }) => ({
        touched: setFunc(touched),
      }))
    }

    visitField(path: Path, visited: boolean) {
      this.setState(({ visited: prev }) => ({
        activeField: null,
        visited: immutable.set(prev, path as string[], visited),
      }))
    }

    setVisited(setFunc: SetFormVisitedFunc<F>) {
      this.setState(({ visited }) => ({
        visited: setFunc(visited),
      }))
    }

    setActiveField(activeField: string | null) {
      this.setState({ activeField })
    }

    resetForm() {
      const { initialValue, initialVisited, initialTouched, initialSubmitCount } = this.props as RFC

      this.setState({
        formValue: initialValue,
        visited: initialVisited,
        touched: initialTouched,
        submitCount: initialSubmitCount,
      })
    }

    forgetState() {
      this.setState({
        touched: {},
        visited: {},
        submitCount: 0,
      })
    }

    collectFormProps(): FormProps<F> {
      const { formValue, errorCount, initialMount, ...state } = this.state
      const { initialValue } = this.props as RFC

      const formIsValid = !initialMount || errorCount === 0
      const formIsDirty = initialMount && !isEqual(initialValue, formValue)

      return {
        formValue,
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
        forgetState: this.forgetState,
        setFormTouched: this.setTouched,
        setFormVisited: this.setVisited,
        setFormValue: this.setFormValue,
      }
    }

    render() {
      const { children } = this.props

      const { formValue } = this.state
      const props = this.collectFormProps()

      return (
        <Provider
          value={{
            ...props,
            path: '',
            branchProps: {},
            sharedProps: {},
            value: formValue,
            submit: this.submit,
            setValue: this.setValue,
            visitField: this.visitField,
            touchField: this.touchField,
            registerError: this.registerError,
            registerField: this.registerField,
            setActiveField: this.setActiveField,
            unregisterError: this.unregisterError,
            unregisterField: this.unregisterField,
          }}
        >
          {childrenIsFunc<F>(children) ? children(props) : children}
        </Provider>
      )
    }
  }

  return Form
}

export default createForm
