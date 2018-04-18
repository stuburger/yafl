import { FormFieldState, FieldState } from '../'
import { createEmptyField } from './getInitialState'
import { transform, isEqual, clone } from '../utils'

export interface FieldUpdater<T, K extends keyof T> {
  (fields: FieldState<T[K]>): FieldState<T[K]>
}

export function setFieldValue<T>(field: FieldState<T>, value: T): FieldState<T> {
  const res = touchField<T>(field)
  res.value = value
  return res
}

export function blurField<T>(field: FieldState<T>): FieldState<T> {
  if (field.didBlur) return field
  const res = clone(field)
  res.didBlur = true
  return res
}

export function touchField<T>(field: FieldState<T>): FieldState<T> {
  const res = clone(field)
  res.touched = true
  return res
}

export function untouchField<T>(field: FieldState<T>): FieldState<T> {
  const res = clone(field)
  res.touched = false
  return res
}

export function resetField(): FieldState<null> {
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

export function touchAllFields<T>(fields: FormFieldState<T>) {
  const state = clone(fields)
  for (let key in state) {
    state[key] = touchField(state[key])
  }
  return state
}

export function untouchAllFields<T>(fields: FormFieldState<T>): FormFieldState<T> {
  const state = clone(fields)
  for (let key in state) {
    state[key] = untouchField(state[key])
  }
  return state
}

export function resetFields<T>(fields: FormFieldState<T>): FormFieldState<T> {
  const state = clone(fields)
  for (let key in state) {
    state[key] = resetField()
  }
  return state
}
