import { transform, clone } from '../utils/index'
import { FieldState, FormFieldState } from '../'

export const createEmptyField = <T>(): FieldState<T> => {
  return {
    value: null,
    originalValue: null,
    didBlur: false,
    touched: false
  }
}

export const getInitialFieldState = <T>(value: T, copyFrom?: FieldState<T>): FieldState<T> => {
  const field = copyFrom ? clone(copyFrom) : createEmptyField<T>()
  field.value = value ? clone(value) : null
  field.originalValue = value ? clone(value) : null
  return field
}

export function reinitializeState<T>(val: T, formState: FormFieldState<T>): FormFieldState<T> {
  return transform<T, FormFieldState<T>>(val, (ret, fieldValue, fieldName: keyof T) => {
    ret[fieldName] = getInitialFieldState<T[keyof T]>(fieldValue, formState[fieldName])
    return ret
  })
}

export default function initializeState<T>(val: T): FormFieldState<T> {
  return transform<T, FormFieldState<T>>(val, (ret, fieldValue, fieldName: keyof T) => {
    ret[fieldName] = getInitialFieldState(fieldValue)
    return ret
  })
}
