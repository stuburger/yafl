import { transform, clone } from './utils/index'
import { FieldState, FormFieldState } from './index'

export const getInitialFieldState = (value?: any): FieldState => ({
  value: value ? clone(value) : null,
  originalValue: value ? clone(value) : null,
  didBlur: false,
  touched: false
})

export default function getInitialState<T>(val: T): FormFieldState<T> {
  return transform<T, FormFieldState<T>>(val, (ret, fieldValue, fieldName: keyof T) => {
    ret[fieldName] = getInitialFieldState(fieldValue)
    return ret
  })
}
