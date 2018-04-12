// import {
//   FieldName,
//   FormValidationResult,
//   ValidationResult,
//   Validator,
//   ProviderValue
// } from '..'
// import { clone, transform, isEqual } from '../utils'
// import {
//   touchAllFields,
//   resetFields,
//   untouchAllFields,
//   getNullState,
//   validateField,
//   formIsValid,
//   getFormValue
// } from '.'
// import { getInitialFieldState } from './getInitialState'
// submit<T>() {
//   this.setState(({ value, submitCount }) => ({
//     value: touchAllFields(value),
//     submitCount: submitCount + 1
//   }))
//   if (formIsValid<T>(this.validateForm())) {
//     const { submit = () => {} } = this.props
//     submit(getFormValue<T>(this.state.value))
//   } else {
//     console.warn('cannot submit, form is not valid...')
//   }
// }
// setFieldValue<T>(fieldName: FieldName<T>, value: any) {
//   const state = clone(this.state)
//   state.value[fieldName].value = value
//   state.value[fieldName].touched = true
//   this.setState(state)
// }
// onFieldBlur<T>(fieldName: FieldName<T>) {
//   if (this.state.value[fieldName].didBlur) return
//   const state = clone(this.state)
//   state.value[fieldName].didBlur = true
//   this.setState(state)
// }
// unload<T>() {
//   this.setState(getNullState<T>())
// }
// forgetState() {
//   this.setState(({ value }) => ({ value: untouchAllFields(value), submitCount: 0 }))
// }
// validateForm<T>(): FormValidationResult<T> {
//   if (!this.state.loaded) return {} as FormValidationResult<T>
//   let result = {} as FormValidationResult<T>
//   for (let v in this.validators) {
//     result[v] = this.validateField(v)
//   }
//   return result
// }
// validateSingleField<T>(fieldName: FieldName<T>): ValidationResult {
//   const form = this.state.value
//   const value = form[fieldName]
//   const validators = this.validators[fieldName]
//   return validateField<T>(value, form, validators)
// }
// clearForm<T>() {
//   this.setState({ value: resetFields<T>(this.state.value) })
// }
// registerField<T>(
//   fieldName: FieldName<T>,
//   value: T[keyof T],
//   validators: Validator[]
// ) {
//   console.log(this)
//   this.registerValidator(fieldName, validators)
//   this.setState(s => {
//     const state = clone(s)
//     state.value[fieldName] = getInitialFieldState(value)
//     return state
//   })
// }
// formIsDirty(): boolean {
//   const { loaded, value } = this.state
//   let clean = true
//   if (loaded) {
//     clean = transform(
//       value,
//       (ret, field, key) => ret && isEqual(field.value, field.originalValue),
//       clean
//     )
//   }
//   return !clean
// }
// registerValidator<T>(fieldName: FieldName<T>, validators: Validator[]) {
//   this.validators[fieldName] = validators
// }
// getProviderValue<T>(): ProviderValue<T> {
//   return {
//     ...this.state,
//     unload: this.unload,
//     submit: this.submit,
//     clearForm: this.clearForm,
//     forgetState: this.forgetState,
//     formIsDirty: this.formIsDirty(),
//     onFieldBlur: this.onFieldBlur,
//     validation: this.validateForm(),
//     setFieldValue: this.setFieldValue,
//     registerField: this.registerField,
//     registerValidator: this.registerValidator
//   }
// } 
//# sourceMappingURL=prototypeFunctions.js.map