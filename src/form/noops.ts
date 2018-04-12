import { ValidationResult, FieldName, FormValidationResult } from '../'
const initialValidation: ValidationResult = []

function getNoops<T>() {
  return {
    noop: function() {},
    noopSubmit: function() {
      console.error('submit: form not loaded')
    },
    noopOnFieldBlur: function(fieldName: FieldName<T>) {
      console.error('blur: form not loaded')
    },
    noopSetFieldValue: function(fieldName: FieldName<T>, value) {
      console.error('setFieldValue: form not loaded')
    },
    noopValidateForm: function(): FormValidationResult<T> {
      return {} as FormValidationResult<T>
    },
    noopValidateField: function(fieldName: FieldName<T>): ValidationResult {
      return initialValidation
    }
  }
}

export default getNoops
