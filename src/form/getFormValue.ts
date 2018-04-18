import { FormFieldState, Nullable } from '../index'
import { transform } from '../utils'

function getFormValue<T extends Nullable<T>>(fields: FormFieldState<T>): T {
  return transform<FormFieldState<T>, T>(fields, (ret, field, fieldName) => {
    ret[fieldName] = field.value
    return ret
  })
}

export default getFormValue
