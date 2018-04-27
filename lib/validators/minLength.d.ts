import { FieldState, FormFieldState } from '../export';
declare function minLength<T>(length: number, message?: string): <P extends keyof T>(value: FieldState<(T[P] & string) | (T[P] & any[])>, formValue: FormFieldState<T>, fieldName: P) => string | undefined;
export default minLength;
