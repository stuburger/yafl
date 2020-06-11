/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useEffect } from 'react'
import isEqual from 'react-fast-compare'
import * as immutable from 'object-path-immutable'
import { constructFrom, usePrevious } from './utils'
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

type Mount = { type: 'mount'; payload: undefined }
type SetValue = { type: 'set_value'; payload: { path: string; value: any } }
type SetTouched = { type: 'set_touched'; payload: { path: string; value: boolean } }
type SetVisited = { type: 'set_visited'; payload: { path: string; value: boolean } }
type UnsetTouched = { type: 'unset_touched'; payload: { path: string } }
type UnsetVisited = { type: 'unset_visited'; payload: { path: string } }
type SetErrors = { type: 'set_errors'; payload: { path: string; errors: string[] } }
type SetFormValue<F extends object> = { type: 'set_form_value'; payload: { value: F } }
type SetFormTouched = { type: 'set_form_touched'; payload: { value: BooleanTree<any> } }
type SetFormVisited = { type: 'set_form_visited'; payload: { value: BooleanTree<any> } }
type UnsetErrors = { type: 'unset_errors'; payload: { path: string } }
type IncSubmitCount = { type: 'inc_submit_count'; payload: { value: 1 } }
type SetActiveField = { type: 'set_active_field'; payload: { path: string | null } }
type SetSubmitCount = { type: 'set_submit_count'; payload: { value: number } }

type Action<F extends object> =
  | SetValue
  | Mount
  | UnsetTouched
  | UnsetVisited
  | SetErrors
  | UnsetErrors
  | IncSubmitCount
  | SetTouched
  | SetVisited
  | SetFormValue<F>
  | SetFormTouched
  | SetFormVisited
  | SetActiveField
  | SetSubmitCount

function formReducer<F extends object>(
  state: FormState<F>,
  actionOrActions: Action<F> | Action<F>[]
): FormState<F> {
  const actions = Array.isArray(actionOrActions) ? actionOrActions : [actionOrActions]

  return actions.reduce(
    (nextState, action) => {
      switch (action.type) {
        case 'mount': {
          nextState.initialMount = true
          break
        }
        case 'set_form_value': {
          const { value } = action.payload
          nextState.formValue = value
          break
        }
        case 'set_active_field': {
          const { path } = action.payload
          nextState.activeField = path
          break
        }
        case 'unset_touched': {
          const { path } = action.payload
          nextState.touched = immutable.del(nextState.touched, path)
          break
        }
        case 'set_touched': {
          const { path, value } = action.payload
          nextState.touched = immutable.set(nextState.touched, path, value)

          break
        }
        case 'set_visited': {
          const { path, value } = action.payload
          nextState.visited = immutable.set(nextState.visited, path, value)

          break
        }
        case 'set_form_touched': {
          const { value } = action.payload
          nextState.touched = value

          break
        }
        case 'set_form_visited': {
          const { value } = action.payload
          nextState.visited = value

          break
        }
        case 'set_value': {
          const { path, value } = action.payload
          const { formValue } = nextState
          nextState.formValue = immutable.set(formValue, path, value)
          break
        }
        case 'unset_visited': {
          const { path } = action.payload
          nextState.visited = immutable.del(nextState.visited, path)
          break
        }
        case 'set_errors': {
          const { path, errors } = action.payload

          nextState.errorCount = errors.length
          nextState.errors = immutable.set(nextState.errors, path, errors)
          break
        }
        case 'unset_errors': {
          const { errors, errorCount } = nextState
          const { path } = action.payload

          nextState.errorCount = errorCount - 1
          nextState.errors = immutable.set(errors, path, [])
          break
        }
        case 'set_submit_count': {
          const { value } = action.payload
          nextState.submitCount = value
          break
        }
        case 'inc_submit_count': {
          const { submitCount } = nextState
          const { value } = action.payload
          nextState.submitCount = submitCount + value
          break
        }
        default: {
          throw new Error('unknown action')
        }
      }

      return nextState
    },
    { ...state }
  )
}

const noop = () => {}

function createForm<FDefault extends object>(
  Provider: React.Provider<FormProvider<any, any> | Symbol>
): React.ComponentType<FormConfig<FDefault>> {
  function Form<F extends FDefault = FDefault>(props: FormConfig<F>) {
    const registerCache = React.useRef<string[]>([])

    const {
      disabled,
      onSubmit = noop,
      initialValue = {} as F,
      initialSubmitCount = 0,
      initialTouched = {},
      initialVisited = {},
      onStateChange,
      persistFieldState,
      onFormValueChange,
      submitUnregisteredValues,
      rememberStateOnReinitialize,
    } = props as Required<FormConfig<F>>

    const [state, dispatch] = React.useReducer<
      React.Reducer<FormState<F>, Action<F> | Action<F>[]>
    >(formReducer, {
      errors: {},
      errorCount: 0,
      activeField: null,
      initialMount: false,
      touched: initialTouched,
      visited: initialVisited,
      submitCount: initialSubmitCount,
      formValue: (initialValue || {}) as F,
    })

    const {
      formValue,
      initialMount,
      visited,
      touched,
      errorCount,
      errors,
      submitCount,
      activeField,
    } = state

    const isDisabled = disabled || !initialMount

    const prevState = usePrevious(state)
    const prevInitialValue = usePrevious(initialValue)

    useEffect(() => {
      dispatch([{ type: 'mount', payload: undefined }])
    }, [])

    useEffect(() => {
      if (!prevState || !onStateChange) return
      onStateChange(prevState, state)
    }, [onStateChange, state, prevState])

    const prevFormValue = prevState?.formValue
    useEffect(() => {
      if (!prevFormValue) return

      if (typeof onFormValueChange === 'function' && !isEqual(prevFormValue, formValue)) {
        onFormValueChange(prevFormValue, formValue)
      }
    }, [onFormValueChange, formValue, prevFormValue])

    useEffect(() => {
      if (!isEqual(prevInitialValue, initialValue)) {
        dispatch({ type: 'set_form_value', payload: { value: initialValue } })

        if (!rememberStateOnReinitialize) {
          dispatch([
            { type: 'set_form_touched', payload: { value: initialTouched } },
            { type: 'set_form_visited', payload: { value: initialVisited } },
            { type: 'set_submit_count', payload: { value: initialSubmitCount } },
          ])
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      initialValue,
      initialTouched,
      initialVisited,
      initialSubmitCount,
      rememberStateOnReinitialize,
    ])

    const registerField = useCallback((path: string) => {
      registerCache.current.push(path)
    }, [])

    const unregisterField = useCallback(
      (path: string) => {
        registerCache.current = registerCache.current.filter((x) => !x.startsWith(path))
        if (persistFieldState) return

        dispatch([
          { type: 'unset_touched', payload: { path } },
          { type: 'unset_visited', payload: { path } },
        ])
      },
      [persistFieldState]
    )

    const registerErrors = useCallback((path: string, errs: string[]) => {
      dispatch({ type: 'set_errors', payload: { path, errors: errs } })
    }, [])

    const unregisterErrors = useCallback((path: string) => {
      dispatch({ type: 'unset_errors', payload: { path } })
    }, [])

    const incSubmitCount = useCallback(() => {
      dispatch({ type: 'inc_submit_count', payload: { value: 1 } })
    }, [])

    const submit = () => {
      if (isDisabled) return

      const inc = submitUnregisteredValues
        ? onSubmit(formValue, collectProps())
        : onSubmit(constructFrom(formValue, registerCache.current), collectProps())

      if (inc !== false) {
        incSubmitCount()
      }
    }

    const setValue = useCallback(
      (path: string, val: any, touch = true) => {
        if (isDisabled) return
        const actions: Action<F>[] = [{ type: 'set_value', payload: { path, value: val } }]

        if (touch) {
          actions.push({ type: 'set_touched', payload: { path, value: touch } })
        }

        dispatch(actions)
      },
      [isDisabled]
    )

    const setFormValue = useCallback(
      (setFunc: SetFormValueFunc<F>) => {
        if (isDisabled) return
        dispatch({ type: 'set_form_value', payload: { value: setFunc(formValue) } })
      },
      [formValue, isDisabled]
    )

    const touchField = (path: string, touch: boolean) => {
      if (isDisabled) return
      dispatch({ type: 'set_touched', payload: { path, value: touch } })
    }

    const setTouched = useCallback(
      (setFunc: SetFormTouchedFunc<F>) => {
        if (isDisabled) return
        dispatch({ type: 'set_form_touched', payload: { value: setFunc(touched) } })
      },
      [isDisabled, touched]
    )

    const visitField = useCallback(
      (path: string, visit: boolean) => {
        if (isDisabled) return
        dispatch([
          { type: 'set_visited', payload: { path, value: visit } },
          { type: 'set_active_field', payload: { path: null } },
        ])
      },
      [isDisabled]
    )

    const setVisited = useCallback(
      (setFunc: SetFormVisitedFunc<F>) => {
        if (isDisabled) return
        dispatch({ type: 'set_form_visited', payload: { value: setFunc(visited) } })
      },
      [visited, isDisabled]
    )

    const setActiveField = useCallback(
      (path: string | null) => {
        if (isDisabled) return
        dispatch({ type: 'set_active_field', payload: { path } })
      },
      [isDisabled]
    )

    const resetForm = useCallback(() => {
      if (isDisabled) return
      dispatch([
        { type: 'set_form_value', payload: { value: initialValue } },
        { type: 'set_form_touched', payload: { value: initialTouched } },
        { type: 'set_form_visited', payload: { value: initialVisited } },
        { type: 'set_submit_count', payload: { value: initialSubmitCount } },
      ])
    }, [initialSubmitCount, initialTouched, initialValue, initialVisited, isDisabled])

    const forgetState = useCallback(() => {
      if (isDisabled) return
      dispatch([
        { type: 'set_form_touched', payload: { value: {} } },
        { type: 'set_form_visited', payload: { value: {} } },
        { type: 'set_submit_count', payload: { value: 0 } },
      ])
    }, [isDisabled])

    function collectProps(): FormProps<F> {
      const formIsValid = !initialMount || errorCount === 0
      const formIsDirty = initialMount && !isEqual(initialValue, formValue)

      return {
        submit,
        errors,
        touched,
        visited,
        resetForm,
        formValue,
        errorCount,
        forgetState,
        formIsDirty,
        activeField,
        submitCount,
        formIsValid,
        initialValue,
        initialMount,
        setFormValue,
        setFormTouched: setTouched,
        setFormVisited: setVisited,
      }
    }

    const { children } = props

    const collectedProps = collectProps()

    return (
      <Provider
        value={{
          ...collectedProps,
          submit,
          setValue,
          path: '',
          visitField,
          touchField,
          registerField,
          registerErrors,
          setActiveField,
          unregisterErrors,
          unregisterField,
          branchProps: {},
          sharedProps: {},
          value: formValue,
        }}
      >
        {typeof children === 'function' ? children(collectedProps) : children}
      </Provider>
    )
  }

  Form.defaultProps = {
    onSubmit: noop,
    rememberStateOnReinitialize: false,
    submitUnregisteredValues: false,
    initialValue: {} as FDefault,
    initialTouched: {} as BooleanTree<FDefault>,
    initialVisited: {} as BooleanTree<FDefault>,
    initialSubmitCount: 0,
    onStateChange: () => false,
  }

  return Form
}

export default createForm
