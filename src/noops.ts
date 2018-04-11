import { ValidationResult, FieldName, FormValidationResult } from '.'
const initialValidation: ValidationResult = []

function getNoops<T>() {
  return {
    noopSubmit: () => {
      console.error('submit: form not loaded')
    },
    noopOnFieldBlur: (fieldName: FieldName<T>) => {
      console.error('blur: form not loaded')
    },
    noopSetFieldValue: (fieldName: FieldName<T>, value) => {
      console.error('setFieldValue: form not loaded')
    },
    noopValidateForm: (): FormValidationResult<T> => ({} as FormValidationResult<T>),
    noopValidateField: (fieldName: FieldName<T>): ValidationResult => initialValidation
  }
}

export default getNoops
