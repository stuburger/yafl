import { FormFieldState, FieldState } from '../'
import { createEmptyField } from './getInitialState'

export interface FieldUpdater {
  (fields: FieldState): FieldState
}

export function createFormUpdater(update: FieldUpdater) {
  return function<T>(fields: FormFieldState<T>) {
    const state = {} as FormFieldState<T>
    for (let key in fields) {
      state[key] = update(fields[key])
    }
    return state
  }
}

export const touchField: FieldUpdater = (field: FieldState) => {
  const res = createEmptyField()
  res.touched = true
  res.value = field.value
  res.didBlur = field.didBlur
  res.originalValue = field.originalValue
  return res
}

export function untouchField(field: FieldState): FieldState {
  const res = createEmptyField()
  res.touched = false
  res.value = field.value
  res.didBlur = false
  res.originalValue = field.originalValue
  return res
}

export function resetField(field: FieldState): FieldState {
  const res = createEmptyField()
  res.touched = false
  res.value = null
  res.didBlur = false
  res.originalValue = null
  return res
}

export const touchAllFields = createFormUpdater(touchField)
export const untouchAllFields = createFormUpdater(untouchField)
export const resetFields = createFormUpdater(resetField)
