import { transform } from '../utils'
import { Nullable, FormFieldState } from '../export'

function getFormValue<T extends Nullable<T>>(fields: FormFieldState<T>): T {
  return transform<FormFieldState<T>, T>(fields, (ret, field, fieldName) => {
    ret[fieldName] = field.value
    return ret
  })
}

export default getFormValue
