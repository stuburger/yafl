import { FieldState, FormFieldState, Validator, ValidationResult } from '../index'

function validateField<T>(
  value: FieldState,
  form: FormFieldState<T>,
  validators = [] as Validator[]
): ValidationResult {
  const messages: ValidationResult = []
  for (let validate of validators) {
    const message = validate(value, form)
    if (message) {
      messages.push(message)
    }
  }
  return messages
}

export default validateField
