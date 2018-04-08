import { transform, cloneDeep } from 'lodash'
import { FieldState, FormFieldState } from './types/index'
export default function getInitialState<T>(val: T): FormFieldState<T> {
  return transform<any, FieldState>(
    val,
    (ret: FormFieldState<T>, fieldValue, fieldName: keyof T) => {
      ret[fieldName] = {
        value: fieldValue,
        originalValue: cloneDeep(fieldValue),
        didBlur: false,
        isTouched: false
      }
    },
    {}
  ) as FormFieldState<T>
}
