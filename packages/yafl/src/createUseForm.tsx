/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useEffect } from 'react'
import isEqual from 'react-fast-compare'
import { get, set, del } from 'object-path-immutable'
import { constructFrom, usePrevious, isFunction } from './utils'
import {
  FormState,
  SetFormValueFunc,
  SetFormVisitedFunc,
  SetFormTouchedFunc,
  FormProps,
  BooleanTree,
  YaflBaseContext,
  UseFormConfig,
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
type UnsetErrors = { type: 'unset_errors'; payload: { path: string; errors: string[] } }
type SetActiveField = { type: 'set_active_field'; payload: { path: string | null } }
type SetSubmitCount = { type: 'set_submit_count'; payload: { value: number } }

type Action<F extends object> =
  | SetValue
  | Mount
  | UnsetTouched
  | UnsetVisited
  | SetErrors
  | UnsetErrors
  | SetTouched
  | SetVisited
  | SetFormValue<F>
  | SetFormTouched
  | SetFormVisited
  | SetActiveField
  | SetSubmitCount

/** Form state is updated using this reducer. Pretty straight forward but note that:
 * 1. It supports dispatching of both single and multiple actions
 * 2. Each part of state for the most part is updated by a single action. This makes state updates easier to
 *    reason about because I don't have to think about abstract actions and their corresponding payloads.
 *    In the past I've found that dispatching an action (like "reset_form") would require an arbitrary payload that
 *    was harder to reason about. Instead we run a reduce over the dispatched comments to update each piece of state
 *    at a time. One action should only update one piece of state - however there are some places I've broken this rule.
 *
 *    For example, the resetForm() function has to update 4 "pieces" of state
 *    so we simply dispatch 4 actions:
 *
 *   dispatch([
 *     { type: 'set_form_value', payload: { value: initialValue } },
 *     { type: 'set_form_touched', payload: { value: initialTouched } },
 *     { type: 'set_form_visited', payload: { value: initialVisited } },
 *     { type: 'set_submit_count', payload: { value: initialSubmitCount } },
 *   ])
 *
 * 3. Setting field values is the norm usually using the path of the field being updated. Actions that update the form are
 *    in the format "set_form__" and are usually done when performing macro actions like state resets, reinitialization, etc
 */
function formReducer<F extends object>(
  state: FormState<F>,
  actionOrActions: Action<F> | Action<F>[]
): FormState<F> {
  const actions = Array.isArray(actionOrActions) ? actionOrActions : [actionOrActions]

  return actions.reduce(
    (nextState, action) => {
      switch (action.type) {
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
          nextState.touched = del(nextState.touched, path)
          break
        }
        case 'set_touched': {
          const { path, value } = action.payload
          nextState.touched = set(nextState.touched, path, value)

          break
        }
        case 'set_visited': {
          const { path, value } = action.payload
          nextState.visited = set(nextState.visited, path, value)

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
          nextState.formValue = set(formValue, path, value)
          break
        }
        case 'unset_visited': {
          const { path } = action.payload
          nextState.visited = del(nextState.visited, path)
          break
        }
        case 'set_errors': {
          const { path, errors } = action.payload
          const fieldErrors = get<string[]>(nextState.errors as any, path, [])
          const prevErrorCount = fieldErrors.length

          // field error messages must be unique per field
          const fieldErrorSet = new Set(fieldErrors.concat(errors))

          nextState.errorCount = nextState.errorCount - prevErrorCount + fieldErrorSet.size
          nextState.errors = set(nextState.errors, path, Array.from(fieldErrorSet))
          break
        }
        case 'unset_errors': {
          const { path, errors } = action.payload

          const fieldErrors = get<string[]>(nextState.errors as any, path, [])
          const nextFieldErrors = fieldErrors.filter((x) => !errors.includes(x))
          nextState.errorCount -= errors.length
          nextState.errors = set(nextState.errors, path, nextFieldErrors)
          break
        }
        case 'set_submit_count': {
          const { value } = action.payload
          nextState.submitCount = value
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

function createUseForm<FDefault extends object>() {
  function useForm<F extends FDefault = FDefault>(props: UseFormConfig<F>): YaflBaseContext<F> {
    const registerCache = React.useRef<string[]>([])

    const {
      disabled,
      onSubmit = noop,
      initialValue = {} as F,
      initialSubmitCount = 0,
      initialTouched = {},
      initialVisited = {},
      onStateChange = noop,
      persistFieldState,
      onFormValueChange,
      submitUnregisteredValues = false,
      rememberStateOnReinitialize = false,
    } = props as Required<UseFormConfig<F>>

    const [state, dispatch] = React.useReducer<
      React.Reducer<FormState<F>, Action<F> | Action<F>[]>
    >(formReducer, {
      errors: {},
      errorCount: 0,
      activeField: null,
      touched: initialTouched,
      visited: initialVisited,
      submitCount: initialSubmitCount,
      formValue: (initialValue || {}) as F,
    })

    const { formValue, visited, touched, errorCount, errors, submitCount, activeField } = state

    const dispatchIfEnabled = disabled ? noop : dispatch
    const prevState = usePrevious(state)
    const prevInitialValue = usePrevious(initialValue)

    useEffect(() => {
      if (!prevState) return
      onStateChange(prevState, state)
    }, [onStateChange, state, prevState])

    const prevFormValue = prevState?.formValue
    useEffect(() => {
      if (!prevFormValue) return

      // don't compare formValues if not necessary
      if (typeof onFormValueChange === 'function' && !isEqual(prevFormValue, formValue)) {
        onFormValueChange(prevFormValue, formValue)
      }
    }, [onFormValueChange, formValue, prevFormValue])

    useEffect(() => {
      // Automatically reinitialize form when initialValue changes. This is usually the desired behavior
      // when submitting a form and the form transitions from "Unsaved" -> "Saved"
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
    }, [
      initialValue,
      initialTouched,
      initialVisited,
      prevInitialValue,
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

    // Errors are fairly simple in Yafl - a useField hook validates its value
    // inline (inside the hook) and if it produces errors we "register" them
    // and store them in state even though errors are technically derived state.
    // Therefore there should only be one way to set and one way to unset errors.
    const registerErrors = useCallback((path: string, errs: string[]) => {
      dispatch({ type: 'set_errors', payload: { path, errors: errs } })
    }, [])

    const unregisterErrors = useCallback((path: string, errs: string[]) => {
      dispatch({ type: 'unset_errors', payload: { path, errors: errs } })
    }, [])

    const incSubmitCount = () => {
      dispatch({ type: 'set_submit_count', payload: { value: submitCount + 1 } })
    }

    const submit = (e?: React.FormEvent<HTMLFormElement>) => {
      if (disabled) return

      if (e && isFunction(e?.preventDefault)) {
        e.preventDefault()
      }

      if (e && isFunction(e?.stopPropagation)) {
        e.stopPropagation()
      }

      const inc = submitUnregisteredValues
        ? // submit formValue as is
          onSubmit(formValue, collectProps())
        : // only submit the values of the Fields currently mounted
          onSubmit(constructFrom(formValue, registerCache.current), collectProps())

      if (inc !== false) {
        // only increment submitCount if the client didn't
        // specifically return false from the onSubmit handler
        incSubmitCount()
      }
    }

    const setValue = useCallback(
      (path: string, val: any, touch = true) => {
        const actions: Action<F>[] = [{ type: 'set_value', payload: { path, value: val } }]

        if (touch) {
          actions.push({ type: 'set_touched', payload: { path, value: touch } })
        }

        dispatchIfEnabled(actions)
      },
      [dispatchIfEnabled]
    )

    const setFormValue = useCallback(
      (setFunc: SetFormValueFunc<F>) => {
        dispatchIfEnabled({ type: 'set_form_value', payload: { value: setFunc(formValue) } })
      },
      [dispatchIfEnabled, formValue]
    )

    const touchField = (path: string, touch: boolean) => {
      dispatchIfEnabled({ type: 'set_touched', payload: { path, value: touch } })
    }

    const setTouched = useCallback(
      (setFunc: SetFormTouchedFunc<F>) => {
        dispatchIfEnabled({ type: 'set_form_touched', payload: { value: setFunc(touched) } })
      },
      [dispatchIfEnabled, touched]
    )

    const visitField = useCallback(
      (path: string, visit: boolean) => {
        dispatchIfEnabled([
          { type: 'set_visited', payload: { path, value: visit } },
          { type: 'set_active_field', payload: { path: null } },
        ])
      },
      [dispatchIfEnabled]
    )

    const setVisited = useCallback(
      (setFunc: SetFormVisitedFunc<F>) => {
        dispatchIfEnabled({ type: 'set_form_visited', payload: { value: setFunc(visited) } })
      },
      [dispatchIfEnabled, visited]
    )

    const setActiveField = useCallback(
      (path: string | null) => {
        dispatchIfEnabled({ type: 'set_active_field', payload: { path } })
      },
      [dispatchIfEnabled]
    )

    const resetForm = useCallback(() => {
      dispatchIfEnabled([
        { type: 'set_form_value', payload: { value: initialValue } },
        { type: 'set_form_touched', payload: { value: initialTouched } },
        { type: 'set_form_visited', payload: { value: initialVisited } },
        { type: 'set_submit_count', payload: { value: initialSubmitCount } },
      ])
    }, [dispatchIfEnabled, initialSubmitCount, initialTouched, initialValue, initialVisited])

    const forgetState = useCallback(() => {
      dispatchIfEnabled([
        { type: 'set_form_touched', payload: { value: {} } },
        { type: 'set_form_visited', payload: { value: {} } },
        { type: 'set_submit_count', payload: { value: 0 } },
      ])
    }, [dispatchIfEnabled])

    function collectProps(): FormProps<F> {
      const formIsValid = errorCount === 0
      const formIsDirty = !isEqual(initialValue, formValue)

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
        setFormValue,
        setFormTouched: setTouched,
        setFormVisited: setVisited,
      }
    }

    const collectedProps = collectProps()

    return {
      ...collectedProps,
      submit,
      setValue,
      visitField,
      touchField,
      registerField,
      registerErrors,
      setActiveField,
      unregisterErrors,
      unregisterField,
      // technically an alias for formValue at this point in time
      // but this value is usually split at every intersection component
      // (i.e. Section, Repeat) and is delivered to individual fields
      value: formValue,
    }
  }

  return useForm
}

export default createUseForm
