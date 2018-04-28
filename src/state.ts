import { transform, isEqual, clone, getDefaultOfType, shallowCopy } from './utils'
import { FieldState, FormFieldState, Nullable, Validator, FormProviderState } from './sharedTypes'

export function getStartingState<T>(initialValue: T = {} as T): FormProviderState<T> {
  return {
    fields: initializeState(initialValue),
    loaded: false,
    isBusy: false,
    submitting: false,
    submitCount: 0,
    initialValue
  }
}

export function createEmptyField(): FieldState<undefined> {
  return {
    value: undefined,
    originalValue: undefined,
    didBlur: false,
    touched: false
  }
}

export function validateField<T>(
  fieldName: keyof T,
  form: FormFieldState<T>,
  validators = [] as Validator<T, keyof T>[]
): string[] {
  const messages: string[] = []
  const value = form[fieldName]
  for (let validate of validators) {
    const message = validate(value, form, fieldName)
    if (message) {
      messages.push(message)
    }
  }
  return messages
}

export function getInitialFieldState<T>(value: T, copyFrom?: FieldState<T>): FieldState<T> {
  const field = copyFrom ? clone(copyFrom) : createEmptyField()
  field.value = clone(value)
  field.originalValue = clone(value)
  return field as FieldState<T>
}

export function reinitializeState<T>(val: T, formState: FormFieldState<T>): FormFieldState<T> {
  return transform<T, FormFieldState<T>>(val, (ret, fieldValue, fieldName: keyof T) => {
    ret[fieldName] = getInitialFieldState<T[keyof T]>(fieldValue, formState[fieldName])
    return ret
  })
}

export function initializeState<T>(val: T): FormFieldState<T> {
  return transform<T, FormFieldState<T>>(val, (ret, fieldValue, fieldName: keyof T) => {
    ret[fieldName] = getInitialFieldState(fieldValue)
    return ret
  })
}

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
    (ret, field) => ret && isEqual(field.value, field.originalValue),
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

export function getFormValue<T extends Nullable<T>>(fields: FormFieldState<T>): T {
  return transform<FormFieldState<T>, T>(fields, (ret, field, fieldName) => {
    ret[fieldName] = field.value
    return ret
  })
}

export function formIsValid<T>(validation: { [K in keyof T]: string[] }): boolean {
  for (let k in validation) {
    if (validation[k].length > 0) {
      return false
    }
  }
  return true
}
