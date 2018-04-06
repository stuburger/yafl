import { transform, cloneDeep } from 'lodash'
import { FieldState, FormFieldState } from './types/index'
export default function getInitialState<T>(value: T): FormFieldState<T> {
  return transform<any, FieldState>(
    value,
    (ret: FormFieldState<T>, value, fieldName: keyof T) => {
      ret[fieldName] = {
        value,
        originalValue: cloneDeep(value),
        isValid: false,
        isDirty: false,
        didBlur: false,
        isTouched: false
      }
    },
    {} as FormFieldState<T>
  )
}
