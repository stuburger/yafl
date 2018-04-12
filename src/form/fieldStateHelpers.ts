import { FormFieldState, FieldState } from '../'

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
  return {
    touched: true,
    value: field.value,
    didBlur: field.didBlur,
    originalValue: field.originalValue
  }
}

export function untouchField(field: FieldState): FieldState {
  return {
    touched: false,
    didBlur: false,
    value: field.value,
    originalValue: field.originalValue
  }
}

export function resetField(field: FieldState): FieldState {
  return {
    touched: false,
    didBlur: false,
    value: '',
    originalValue: ''
  }
}

export const touchAllFields = createFormUpdater(touchField)
export const untouchAllFields = createFormUpdater(untouchField)
export const resetFields = createFormUpdater(resetField)
