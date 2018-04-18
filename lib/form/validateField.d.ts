import { FormFieldState, Validator, ValidationResult, FieldName } from '../index';
declare function validateField<T>(fieldName: FieldName<T>, form: FormFieldState<T>, validators?: Validator<T, keyof T>[]): ValidationResult;
export default validateField;
