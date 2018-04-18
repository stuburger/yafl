import { FieldState, FormFieldState, StringOrNothing } from '../index'

function maxLength<T>(length: number, message?: string) {
  const test = function<P extends keyof T>(
    value: FieldState<T[P] & (string | any[])>,
    formValue: FormFieldState<T>,
    fieldName: P
  ): StringOrNothing {
    const val = value.value || ''
    if (typeof val === 'string') {
      if (value.touched && val.length > length) {
        return message || `${fieldName} should not be longer than ${length} characters`
      }
    }
    return undefined
  }

  return test
}

export default maxLength
