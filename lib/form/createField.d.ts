/// <reference types="react" />
import * as React from 'react';
import { ProviderValue, FormFieldProps } from '../';
declare function wrapConsumer<T, K extends keyof T>(Consumer: React.Consumer<ProviderValue<T>>, fieldName?: K): {
    new (props: FormFieldProps<T, K>, context?: any): {
        _render: ({value, loaded, formIsDirty, ...providerValue}: ProviderValue<T>) => JSX.Element;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: FormFieldProps<T, K>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormFieldProps<T, K>>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
export default wrapConsumer;
