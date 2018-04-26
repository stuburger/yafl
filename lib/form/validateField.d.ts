import { FormFieldState, Validator } from '../index';
declare function validateField<T>(fieldName: keyof T, form: FormFieldState<T>, validators?: Validator<T, keyof T>[]): string[];
export default validateField;
