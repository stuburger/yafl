import { FieldState, FormFieldState } from './index'
export declare const getInitialFieldState: (value?: any) => FieldState
export default function getInitialState<T>(val: T): FormFieldState<T>
