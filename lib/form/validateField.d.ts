import { FormFieldState, Validator, ValidationResult } from '../index';
declare function validateField<T>(fieldName: keyof T, form: FormFieldState<T>, validators?: Validator<T, keyof T>[]): ValidationResult;
export default validateField;
