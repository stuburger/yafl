/// <reference types="react" />
import * as React from 'react';
import { ProviderValue, FormFieldProps } from '../';
declare function wrapConsumer<T>(Consumer: React.Consumer<ProviderValue<T>>): {
    new (props: FormFieldProps<T>, context?: any): {
        _render: ({value, loaded, formIsDirty, ...providerValue}: ProviderValue<T>) => JSX.Element;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: FormFieldProps<T>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormFieldProps<T>>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
export default wrapConsumer;
