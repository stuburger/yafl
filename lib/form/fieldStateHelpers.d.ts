import { FormFieldState, FieldState } from '../'
export interface FieldUpdater {
  (fields: FieldState): FieldState
}
export declare function createFormUpdater(
  update: FieldUpdater
): <T>(fields: FormFieldState<T>) => FormFieldState<T>
export declare const touchField: FieldUpdater
export declare function untouchField(field: FieldState): FieldState
export declare function resetField(field: FieldState): FieldState
export declare const touchAllFields: <T>(fields: FormFieldState<T>) => FormFieldState<T>
export declare const untouchAllFields: <T>(fields: FormFieldState<T>) => FormFieldState<T>
export declare const resetFields: <T>(fields: FormFieldState<T>) => FormFieldState<T>
