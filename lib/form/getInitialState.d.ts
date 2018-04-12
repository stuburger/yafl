import { FieldState, FormFieldState } from '../';
export declare const createEmptyField: () => FieldState;
export declare const getInitialFieldState: (value?: any) => FieldState;
export default function getInitialState<T>(val: T): FormFieldState<T>;
