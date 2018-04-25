/// <reference types="react" />
import * as React from 'react';
import { FormProviderState, FormProviderOptions, FormProviderProps, Validator, FormValidationResult, ValidatorSet, ProviderValueLoaded } from '../';
declare function wrapFormProvider<T>(Provider: React.Provider<ProviderValueLoaded<T>>, opts: FormProviderOptions<T>): {
    new (props: any): {
        validators: Partial<ValidatorSet<T>>;
        registerValidator<K extends keyof T>(fieldName: K, validators: Validator<T, K>[]): void;
        registerField<K extends keyof T>(fieldName: K, value: T[K], validators: Validator<T, K>[]): void;
        submit(): void;
        setFieldValue<P extends keyof T>(fieldName: P, val: T[P]): void;
        touchField<K extends keyof T>(fieldName: K): void;
        touchFields<K extends keyof T>(fieldNames: K[]): void;
        untouchField<K extends keyof T>(fieldName: K): void;
        untouchFields<K extends keyof T>(fieldNames: K[]): void;
        onFieldBlur<K extends keyof T>(fieldName: K): void;
        clearForm(): void;
        unload(): void;
        forgetState(): void;
        validateForm(): FormValidationResult<T>;
        formIsDirty(): boolean;
        getProviderValue(): ProviderValueLoaded<T, keyof T>;
        render(): JSX.Element;
        setState<K extends "fields" | "initialValue" | "isBusy" | "loaded" | "submitting" | "submitCount">(state: FormProviderState<T> | ((prevState: Readonly<FormProviderState<T>>, props: FormProviderProps<T>) => FormProviderState<T> | Pick<FormProviderState<T>, K> | null) | Pick<FormProviderState<T>, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormProviderProps<T>>;
        state: Readonly<FormProviderState<T>>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    getDerivedStateFromProps: (np: FormProviderProps<T>, ps: FormProviderState<T>) => Partial<FormProviderState<T>>;
};
export default wrapFormProvider;
