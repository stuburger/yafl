import { FieldState, FormFieldState } from '../';
export declare const createEmptyField: () => FieldState;
export declare const getInitialFieldState: (value: any, copyFrom?: FieldState | undefined) => FieldState;
export declare function reinitializeState<T>(val: T, formState: FormFieldState<T>): FormFieldState<T>;
export default function initializeState<T>(val: T): FormFieldState<T>;
