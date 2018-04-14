import { FieldState, FormFieldState, Validator, FieldName } from '../index'

function required<T>(message?: string): Validator<T> {
  return function(
    value: FieldState,
    formValue: FormFieldState<T>,
    fieldName: FieldName<T>
  ): string | undefined {
    if (value.touched && !value.value) {
      return message || `${fieldName} is required`
    }
    return undefined
  }
}

export default required

// const required: Validator = function(
//   field,
//   fieldName,
//   formValue
// ): string | undefined {
//   if (!field.value) {
//     return `${fieldName} is required`
//   }
//   return
// }
