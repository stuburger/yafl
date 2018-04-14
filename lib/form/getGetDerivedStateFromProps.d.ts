import { FormProviderOptions, FormProviderProps, FormProviderState } from '../';
declare function getGetDerivedStateFromProps<T>(opts: FormProviderOptions<T>): (np: FormProviderProps<T>, ps: FormProviderState<T>) => Partial<FormProviderState<Partial<T>>>;
export default getGetDerivedStateFromProps;
