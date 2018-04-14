import { FieldState, FormFieldState, Validator, FieldName } from '../index'

function minLength<T>(length: number, message?: string): Validator<T> {
  return function(
    value: FieldState,
    formValue: FormFieldState<T>,
    fieldName: FieldName<T>
  ): string | undefined | any {
    const val = value.value || ''
    if (value.touched && val.length < length) {
      return message || `${fieldName} should be at least ${length} characters`
    }
  }
}

export default minLength

// function minLength(len): (field, fieldName, formValue) => string | undefined {
//   return function(field, fieldName, formValue): string | undefined {
//     if (field.value.length < len) {
//       return `${fieldName} must be at least ${len} characters`
//     }
//     return
//   }
// }
