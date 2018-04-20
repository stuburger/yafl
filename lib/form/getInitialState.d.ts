import { FieldState, FormFieldState } from '../';
export declare const createEmptyField: <T>() => FieldState<T>;
export declare const getInitialFieldState: <T>(value: T, copyFrom?: FieldState<T> | undefined) => FieldState<T>;
export declare function reinitializeState<T>(val: T, formState: FormFieldState<T>): FormFieldState<T>;
export default function initializeState<T>(val: T): FormFieldState<T>;
