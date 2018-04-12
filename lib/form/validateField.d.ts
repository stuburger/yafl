import { FieldState, FormFieldState, Validator, ValidationResult } from '../index'
declare function validateField<T>(
  value: FieldState,
  form: FormFieldState<T>,
  validators?: Validator[]
): ValidationResult
export default validateField
