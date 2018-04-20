import { FormFieldState, FieldState } from '../';
export interface FieldUpdater<T, K extends keyof T> {
    (fields: FieldState<T[K]>): FieldState<T[K]>;
}
export declare function setFieldValue<T>(field: FieldState<T>, value: T): FieldState<T>;
export declare function blurField<T>(field: FieldState<T>): FieldState<T>;
export declare function touchField<T>(field: FieldState<T>): FieldState<T>;
export declare function untouchField<T>(field: FieldState<T>): FieldState<T>;
export declare function resetField<T>(): FieldState<T>;
export declare function formIsDirty<T>(value: FormFieldState<T>): boolean;
export declare function touchAllFields<T>(fields: FormFieldState<T>): FormFieldState<T>;
export declare function untouchAllFields<T>(fields: FormFieldState<T>): FormFieldState<T>;
export declare function resetFields<T>(fields: FormFieldState<T>): FormFieldState<T>;
