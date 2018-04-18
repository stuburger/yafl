import { FormFieldState, Nullable } from '../index';
declare function getFormValue<T extends Nullable<T>>(fields: FormFieldState<T>): T;
export default getFormValue;
