import { FormProviderProps, FormProviderState } from '../';
declare function getGetDerivedStateFromProps<T>(): (np: FormProviderProps<T>, ps: FormProviderState<T>) => Partial<FormProviderState<T>>;
export default getGetDerivedStateFromProps;
