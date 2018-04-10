import { transform, cloneDeep } from 'lodash'
import { FieldState, FormFieldState } from './index'

export const getInitialFieldState = (value?: any): FieldState => ({
  value: value ? cloneDeep(value) : null,
  originalValue: value ? cloneDeep(value) : null,
  didBlur: false,
  touched: false
})

export default function getInitialState<T>(val: T): FormFieldState<T> {
  return transform<any, FieldState>(
    val,
    (ret: FormFieldState<T>, fieldValue, fieldName: keyof T) => {
      ret[fieldName] = getInitialFieldState(fieldValue)
    },
    {}
  ) as FormFieldState<T>
}
