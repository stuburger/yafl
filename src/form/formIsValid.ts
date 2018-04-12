import { FormValidationResult } from '../index'

function formIsValid<T>(validation: FormValidationResult<T>): boolean {
  for (let k in validation) {
    if (validation[k].length > 0) {
      return false
    }
  }
  return true
}

export default formIsValid
