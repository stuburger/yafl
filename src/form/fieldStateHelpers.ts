import { FormFieldState, FieldState } from '../'
import {
  transform,
  isEqual,
  clone,
  isNullOrUndefined,
  isBoolean,
  isNumber,
  isDate,
  isString,
  isObject
} from '../utils'

export interface FieldUpdater<T, K extends keyof T> {
  (fields: FieldState<T[K]>): FieldState<T[K]>
}

// untested
export function getDefaultOfType<T>(value: T, defaultValue?: T): T {
  if (defaultValue) {
    return defaultValue
  }
  if (isNullOrUndefined(value)) {
    return value
  }
  let res: any
  if (isBoolean(value)) {
    res = false
  } else if (Array.isArray(value)) {
    res = []
  } else if (isNumber(value)) {
    res = 0
  } else if (isDate(value)) {
    res = new Date()
  } else if (isString(value)) {
    res = ''
  } else if (isObject(value)) {
    res = {}
    const keys = Object.keys(value) as (keyof T)[]
    for (let key of keys) {
      res[key] = getDefaultOfType(value[key])
    }
  } else {
    throw new Error('unexpected value type ' + value)
  }
  return res as T
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

export function resetField<T>(field: FieldState<T>): FieldState<T> {
  const result = clone(field)
  result.originalValue = getDefaultOfType(field.originalValue)
  result.value = clone(result.originalValue)
  return result
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
    state[key] = resetField(state[key])
  }
  return state
}
