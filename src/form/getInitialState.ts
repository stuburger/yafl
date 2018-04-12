import { transform, clone } from '../utils/index'
import { FieldState, FormFieldState } from '../'

export const createEmptyField = (): FieldState => {
  return {
    value: null,
    originalValue: null,
    didBlur: false,
    touched: false
  }
}

export const getInitialFieldState = (value?: any): FieldState => {
  const field = createEmptyField()
  field.value = value ? clone(value) : null
  field.originalValue = value ? clone(value) : null
  return field
}

export default function getInitialState<T>(val: T): FormFieldState<T> {
  return transform<T, FormFieldState<T>>(val, (ret, fieldValue, fieldName: keyof T) => {
    ret[fieldName] = getInitialFieldState(fieldValue)
    return ret
  })
}
