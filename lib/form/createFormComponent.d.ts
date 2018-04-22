/// <reference types="react" />
import * as React from 'react';
import { ProviderValue, FormComponentWrapper } from '../';
declare function wrapConsumer<T>(Consumer: React.Consumer<ProviderValue<T>>): {
    new (props: FormComponentWrapper<T>, context?: any): {
        _render: ({registerValidator, registerField, onFieldBlur, ...providerValue}: ProviderValue<T, keyof T>) => JSX.Element;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: FormComponentWrapper<T>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormComponentWrapper<T>>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
export default wrapConsumer;
