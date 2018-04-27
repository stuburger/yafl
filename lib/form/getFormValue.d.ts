import { Nullable, FormFieldState } from '../export';
declare function getFormValue<T extends Nullable<T>>(fields: FormFieldState<T>): T;
export default getFormValue;
