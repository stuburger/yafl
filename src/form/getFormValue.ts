import { FormFieldState } from '../'
import { transform } from '../utils'

function getFormValue<T>(fields: FormFieldState<T>): T {
  return transform<FormFieldState<T>, T>(fields, (ret, value, fieldName) => {
    ret[fieldName] = fields[fieldName].value
    return ret
  })
}

export default getFormValue
