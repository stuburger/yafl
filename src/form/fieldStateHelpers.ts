import { FormFieldState, FieldState } from '../export'
import { transform, isEqual, clone, getDefaultOfType, shallowCopy } from '../utils'

function copy<T>(field: FieldState<T>): FieldState<T> {
  return {
    value: clone(field.value),
    didBlur: field.didBlur,
    touched: field.touched,
    originalValue: clone(field.originalValue)
  }
}

export function isDirty<T>({ value, originalValue }: FieldState<T>): boolean {
  return !isEqual(originalValue, value)
}

export function setFieldValue<T>(field: FieldState<T>, value: T): FieldState<T> {
  const res = touchField<T>(field)
  res.value = value
  return res
}

export function blurField<T>(field: FieldState<T>): FieldState<T> {
  if (field.didBlur) return field
  const res = copy(field)
  res.didBlur = true
  return res
}

export function touchField<T>(field: FieldState<T>): FieldState<T> {
  const res = copy(field)
  res.touched = true
  return res
}

export function untouchField<T>(field: FieldState<T>): FieldState<T> {
  const res = copy(field)
  res.touched = false
  return res
}

export function resetField<T>(field: FieldState<T>): FieldState<T> {
  const result = copy(field)
  result.value = clone(field.originalValue)
  return result
}

export function clearField<T>(field: FieldState<T>): FieldState<T> {
  const result = copy(field)
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
  const state = clone(fields) // shallow copy would be fine if all fields are cloned
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

export function clearFields<T>(fields: FormFieldState<T>): FormFieldState<T> {
  const state = clone(fields)
  for (let key in state) {
    state[key] = clearField(state[key])
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

export function set<T, K extends keyof T>(
  fields: FormFieldState<T>,
  fieldName: K,
  updatedField: FieldState<T[K]>
): FormFieldState<T> {
  const result = shallowCopy(fields)
  result[fieldName] = updatedField
  return result
}
