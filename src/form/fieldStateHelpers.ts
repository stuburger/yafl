import { FormFieldState, FieldState } from '../'
import { createEmptyField } from './getInitialState'
import { transform, isEqual, clone } from '../utils'

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

export const setFieldValue = (field: FieldState, value: any): FieldState => {
  const res = touchField(field)
  res.value = value
  return res
}

export const blurField: FieldUpdater = (field: FieldState): FieldState => {
  if (field.didBlur) return field
  const res = clone(field)
  res.didBlur = true
  return res
}

export const touchField: FieldUpdater = (field: FieldState) => {
  const res = clone(field)
  res.touched = true
  return res
}

export function untouchField(field: FieldState): FieldState {
  const res = clone(field)
  res.touched = false
  res.didBlur = false
  return res
}

export function resetField(field: FieldState): FieldState {
  return createEmptyField()
}

export function formIsDirty<T>(value: FormFieldState<T>): boolean {
  let clean = transform(
    value,
    (ret, field, key) => ret && isEqual(field.value, field.originalValue),
    true
  )
  return !clean
}

export const touchAllFields = createFormUpdater(touchField)
export const untouchAllFields = createFormUpdater(untouchField)
export const resetFields = createFormUpdater(resetField)
