import { FormFieldState, FieldState } from '../';
export declare function isDirty<T>({value, originalValue}: FieldState<T>): boolean;
export declare function setFieldValue<T>(field: FieldState<T>, value: T): FieldState<T>;
export declare function blurField<T>(field: FieldState<T>): FieldState<T>;
export declare function touchField<T>(field: FieldState<T>): FieldState<T>;
export declare function untouchField<T>(field: FieldState<T>): FieldState<T>;
export declare function resetField<T>(field: FieldState<T>): FieldState<T>;
export declare function clearField<T>(field: FieldState<T>): FieldState<T>;
export declare function formIsDirty<T>(value: FormFieldState<T>): boolean;
export declare function touchAllFields<T>(fields: FormFieldState<T>): FormFieldState<T>;
export declare function untouchAllFields<T>(fields: FormFieldState<T>): FormFieldState<T>;
export declare function clearFields<T>(fields: FormFieldState<T>): FormFieldState<T>;
export declare function resetFields<T>(fields: FormFieldState<T>): FormFieldState<T>;
export declare function set<T, K extends keyof T>(fields: FormFieldState<T>, fieldName: K, updatedField: FieldState<T[K]>): FormFieldState<T>;
