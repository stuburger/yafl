import { BooleanTree, SetFieldValueAction, SetActiveFieldAction } from './sharedTypes'

export const setTouched = <F extends object>(touchedState: BooleanTree<F>) => ({
  type: 'set_form_touched',
  payload: touchedState
})

export const setVisited = <F extends object>(visitedState: BooleanTree<F>) => ({
  type: 'set_form_visited',
  payload: visitedState
})

export const setFieldValue = <T = any>(
  path: PathV2,
  val: T,
  setTouched = true
): SetFieldValueAction => ({
  type: 'set_field_value',
  payload: { path, val, setTouched }
})

export const setFormValue = <F extends object>(formValue: F) => ({
  type: 'set_form_value',
  payload: formValue
})

export const setActiveField = (activeField: PathV2 | null): SetActiveFieldAction => ({
  type: 'set_active_field',
  payload: activeField
})

export const clearForm = () => ({ type: 'reset_form' })

export const unregister_error = (path: PathV2) => ({ type: 'register_field', payload: path })

export const forgetState = () => ({ type: 'forget_state' })

export const registerError = (path: PathV2, error: string) => ({
  type: 'register_error',
  payload: { path, error }
})

export const unregisterError = (path: PathV2, error: string) => ({
  type: 'unregister_error',
  payload: { path, error }
})
