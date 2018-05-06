import { transform, isEqual, clone, getDefaultOfType, shallowCopy } from './utils'
import {
  FieldState,
  FormFieldState,
  Validator,
  FormProviderState,
  RegisteredFields
} from './sharedTypes'

export function getDefaultInitialState<T extends object>(
  defaultValue: T = {} as T
): FormProviderState<T> {
  return {
    fields: getDefaultFormState(defaultValue),
    loaded: false,
    isBusy: false,
    registeredFields: {},
    submitting: false,
    submitCount: 0,
    initialValue: defaultValue
  }
}

function getDefaultFieldState<T>(defaultValue?: T): FieldState<T> {
  const field = createEmptyField<T>()
  field.value = clone(defaultValue)
  field.defaultValue = defaultValue
  field.originalValue = clone(defaultValue)
  return field as FieldState<T>
}

export function getDefaultFormState<T>(defaultValue = {} as T): FormFieldState<T> {
  return transform<T, FormFieldState<T>>(defaultValue, (ret, fieldValue, fieldName: keyof T) => {
    ret[fieldName] = getDefaultFieldState(fieldValue)
    return ret
  })
}

export function createEmptyField<T>(): FieldState<T | undefined> {
  return {
    value: undefined,
    originalValue: undefined,
    defaultValue: undefined,
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
  const { value } = form[fieldName]
  for (let validate of validators) {
    const message = validate(value, form, fieldName)
    if (message) {
      messages.push(message)
    }
  }
  return messages
}

export function setInitialFieldValue<T>(
  initialValue: T,
  field?: FieldState<T>,
  keepState = false
): FieldState<T> {
  const _field = field ? copy(field) : createEmptyField()
  _field.value = clone(initialValue)
  _field.originalValue = clone(initialValue)
  if (!keepState) {
    _field.didBlur = false
    _field.touched = false
  }
  return _field as FieldState<T>
}

export function getFieldFromValue<T>(value: T, defaultValue?: T): FieldState<T> {
  const field = createEmptyField()
  field.value = clone(value)
  field.originalValue = clone(value)
  field.defaultValue = defaultValue
  return field as FieldState<T>
}

export function setInitialFieldValues<T>(
  val: T,
  fields: Partial<FormFieldState<T>>,
  keepState = false
): FormFieldState<T> {
  return transform<T, FormFieldState<T>>(val, (ret, fieldValue, fieldName: keyof T) => {
    ret[fieldName] = setInitialFieldValue(fieldValue, fields[fieldName], keepState)
    return ret
  })
}

function copy<T>(field: FieldState<T>): FieldState<T> {
  return {
    value: clone(field.value),
    didBlur: field.didBlur,
    touched: field.touched,
    originalValue: clone(field.originalValue),
    defaultValue: field.defaultValue
  }
}

export function isDirty<T>({ value, originalValue }: FieldState<T>): boolean {
  return !isEqual(originalValue, value)
}

export function setDefaultFieldValue<T>(field: FieldState<T>, defaultValue: T): FieldState<T> {
  const res = copy(field)
  res.defaultValue = defaultValue
  return res
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
  result.originalValue = getDefaultOfType(field.originalValue, field.defaultValue)
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

export function modifyFields<T>(
  fields: FormFieldState<T>,
  update: Partial<T>,
  updater: (
    field: FieldState<T[keyof T]>,
    value: T[keyof T],
    key: keyof T
  ) => FieldState<T[keyof T]>
): FormFieldState<T> {
  const result = shallowCopy(fields)
  for (let x in update) {
    if (!fields[x]) continue
    const value = update[x] as T[keyof T]
    result[x] = updater(fields[x], value, x)
  }
  return result
}

export function addFormField<T, K extends keyof T>(
  fields: FormFieldState<T>,
  fieldName: K,
  field: FieldState<T[K]>
): FormFieldState<T> {
  const result = shallowCopy(fields)
  result[fieldName] = field
  return result
}

export function update<T, K extends keyof T>(
  fields: FormFieldState<T>,
  fieldName: K,
  updater: (field: FieldState<T[K]>) => FieldState<T[K]>,
  createIfAbsent = false
): FormFieldState<T> {
  let field = fields[fieldName]
  if (!createIfAbsent && !field) return fields
  const result = shallowCopy(fields)
  if (!field && createIfAbsent) {
    field = createEmptyField<T[K]>() as FieldState<T[K]>
  }
  result[fieldName] = updater(field)
  return result
}

export function setAll<T, K extends keyof T>(
  fields: FormFieldState<T>,
  fieldNames: K[],
  updater: (field: FieldState<T[K]>) => FieldState<T[K]>
): FormFieldState<T> {
  const result = shallowCopy(fields)
  for (let x of fieldNames) {
    if (fields[x]) {
      result[x] = updater(fields[x])
    }
  }
  return result
}

// export function getFormValue<T>(fields: FormFieldState<T>, collect: (keyof T)[]): T {
//   const ret = {} as T
//   for (let fieldName of collect) {
//     ret[fieldName] = fields[fieldName].value
//   }
//   return ret
// }

export function getFormValue<T extends object>(
  fields: FormFieldState<T>,
  registeredFields = {} as RegisteredFields<T>,
  includeUnregisteredFields = false
): T {
  return transform<FormFieldState<T>, T>(fields, (ret, field, fieldName) => {
    if (registeredFields[fieldName] || includeUnregisteredFields) {
      ret[fieldName] = field.value
    }
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
