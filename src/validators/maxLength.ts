import { FieldState, FormFieldState, Validator, FieldName } from '../index'

function maxLength<T>(length: number, message?: string): Validator<T> {
  return function(
    value: FieldState,
    formValue: FormFieldState<T>,
    fieldName: FieldName<T>
  ): string | undefined | any {
    const val = value.value || ''
    if (value.touched && val.length > length) {
      return message || `${fieldName} should not be longer than ${length} characters`
    }
  }
}

export default maxLength
