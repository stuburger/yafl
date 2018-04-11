import { FieldState, FormFieldState, Validator, ValidationResult } from '.'
declare function validateField<T>(
  value: FieldState,
  form: FormFieldState<T>,
  validators?: Validator[]
): ValidationResult
export default validateField
