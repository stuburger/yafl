import { FormFieldState, Validator, ValidationResult } from '../index'

function validateField<T>(
  fieldName: keyof T,
  form: FormFieldState<T>,
  validators = [] as Validator<T, keyof T>[]
): ValidationResult {
  const messages: ValidationResult = []
  const value = form[fieldName]
  for (let validate of validators) {
    const message = validate(value, form, fieldName)
    if (message) {
      messages.push(message)
    }
  }
  return messages
}

export default validateField
