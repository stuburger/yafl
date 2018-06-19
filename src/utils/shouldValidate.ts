import { FieldValidator, ValidateOn, SectionValidateOn, BooleanTree } from '../sharedTypes'
import incl from './includes'

export function shouldValidate(
  value: any,
  initialValue: any,
  touched: boolean,
  visited: boolean,
  submitCount: number,
  formState: any,
  validate?: FieldValidator<any, any>,
  validateOn?: ValidateOn<any, any>
) {
  if (!validate || !validate.length) return false
  if (typeof validateOn === 'function') {
    return validateOn({ name, value, touched, visited, initialValue }, formState)
  }
  if (typeof validateOn === 'string' || Array.isArray(validateOn)) {
    return (
      (visited && incl(validateOn, 'blur')) ||
      (touched && incl(validateOn, 'change')) ||
      (submitCount > 0 && incl(validateOn, 'submit'))
    )
  }
  return true
}

export function shouldValidateSection(
  value: any,
  initialValue: any,
  touched: BooleanTree<any>,
  visited: BooleanTree<any>,
  submitCount: number,
  formState: any,
  validate?: FieldValidator<any, any>,
  validateOn?: SectionValidateOn<any, any>
) {
  if (!validate || !validate.length) return false
  if (typeof validateOn === 'function') {
    return validateOn({ name, value, touched, visited, initialValue }, formState)
  }
  if (validateOn === 'submit') {
    return submitCount > 0
  }
  return true
}
