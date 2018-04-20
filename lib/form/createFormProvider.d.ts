/// <reference types="react" />
import * as React from 'react';
import { FormProviderState, FormProviderOptions, FormProviderProps, ProviderValue, Validator, FormValidationResult, ValidatorSet } from '../';
declare function wrapFormProvider<T, K extends keyof T>(Provider: React.Provider<ProviderValue<T, K>>, opts: FormProviderOptions<T>): {
    new (props: any): {
        validators: Partial<ValidatorSet<T>>;
        state: FormProviderState<T>;
        submit(): void;
        setFieldValue(fieldName: K, val: T[K]): void;
        touchField(fieldName: K): void;
        touchFields(fieldNames: K[]): void;
        untouchField(fieldName: K): void;
        untouchFields(fieldNames: K[]): void;
        onFieldBlur(fieldName: K): void;
        unload(): void;
        forgetState(): void;
        validateForm(): FormValidationResult<T>;
        clearForm(): void;
        registerField(fieldName: K, value: T[K], validators: Validator<T, K>[]): void;
        formIsDirty(): boolean;
        registerValidator(fieldName: K, validators: Validator<T, K>[]): void;
        getProviderValue(): ProviderValue<T, K>;
        render(): JSX.Element;
        setState<K extends "value" | "initialValue" | "isBusy" | "loaded" | "submitting" | "submitCount">(state: FormProviderState<T> | ((prevState: Readonly<FormProviderState<T>>, props: FormProviderProps<T>) => FormProviderState<T> | Pick<FormProviderState<T>, K> | null) | Pick<FormProviderState<T>, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormProviderProps<T>>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    getDerivedStateFromProps: (np: FormProviderProps<T>, ps: FormProviderState<T>) => Partial<FormProviderState<T>>;
};
export default wrapFormProvider;
