import { FieldState, FormFieldState } from '../sharedTypes'

function required<T>(message?: string) {
  const test = function<P extends keyof T>(
    value: FieldState<T[P] & (string | any[])>,
    formValue: FormFieldState<T>,
    fieldName: P
  ): string | undefined {
    if (!value.value) {
      return message || `${fieldName} is required`
    }
    return undefined
  }

  return test
}

export default required
