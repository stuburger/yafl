import { FormProviderState } from '../internal';
import { FormProviderProps } from '../export';
declare function getGetDerivedStateFromProps<T>(): (np: FormProviderProps<T>, ps: FormProviderState<T>) => Partial<FormProviderState<T>>;
export default getGetDerivedStateFromProps;
