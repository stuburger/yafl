import { Validator } from './form'
import { FormFieldState } from './sharedTypes'

function validateField<T>(
  fieldName: keyof T,
  form: FormFieldState<T>,
  validators = [] as Validator<T, keyof T>[]
): string[] {
  const messages: string[] = []
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
