import { FieldState, FormFieldState } from '../index';
declare function required<T>(message?: string): <P extends keyof T>(value: FieldState<(T[P] & string) | (T[P] & any[])>, formValue: FormFieldState<T>, fieldName: P) => string | undefined;
export default required;
