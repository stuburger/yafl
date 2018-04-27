import { Validator, FormFieldState } from '../export';
declare function validateField<T>(fieldName: keyof T, form: FormFieldState<T>, validators?: Validator<T, keyof T>[]): string[];
export default validateField;
