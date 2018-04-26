/// <reference types="react" />
import * as React from 'react';
import { ProviderValueLoaded, FormComponentProps } from '../';
declare function wrapConsumer<T>(Consumer: React.Consumer<ProviderValueLoaded<T>>): {
    new (props: any): {
        _render(provider: ProviderValueLoaded<T, keyof T>): JSX.Element;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: FormComponentProps<T, keyof T>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormComponentProps<T, keyof T>>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
export default wrapConsumer;
