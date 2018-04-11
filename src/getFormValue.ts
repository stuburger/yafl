import { FormFieldState } from './index'

function getFormValue<T>(fields: FormFieldState<T>): T {
  const result = {} as T
  for (let fieldName in fields) {
    const temp = fields[fieldName]
    result[fieldName] = temp.value
  }
  return result
}

export default getFormValue
