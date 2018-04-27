/// <reference types="react" />
import * as React from 'react';
import * as Internal from './internal';
import * as Exp from './export';
export declare function createForm<T>(initialValue: T): {
    Form: {
        new (props: any): {
            validators: Partial<Internal.ValidatorSet<T>>;
            registerValidator<K extends keyof T>(fieldName: K, validators: Exp.Validator<T, K>[]): void;
            registerField<K extends keyof T>(fieldName: K, value: T[K], validators: Exp.Validator<T, K>[]): void;
            submit(): void;
            getFormValue(): T;
            setFieldValue<P extends keyof T>(fieldName: P, val: T[P]): void;
            touchField<K extends keyof T>(fieldName: K): void;
            touchFields<K extends keyof T>(fieldNames: K[]): void;
            untouchField<K extends keyof T>(fieldName: K): void;
            untouchFields<K extends keyof T>(fieldNames: K[]): void;
            onFieldBlur<K extends keyof T>(fieldName: K): void;
            clearForm(): void;
            resetForm(): void;
            unload(): void;
            forgetState(): void;
            validateForm(): Exp.FormValidationResult<T>;
            getComputedState(): Internal.ComputedFormState<T>;
            getProviderValue(): Internal.ProviderValueLoaded<T, keyof T>;
            render(): JSX.Element;
            setState<K extends "fields" | "initialValue" | "isBusy" | "loaded" | "submitting" | "submitCount">(state: Internal.FormProviderState<T> | ((prevState: Readonly<Internal.FormProviderState<T>>, props: Exp.FormProviderProps<T>) => Internal.FormProviderState<T> | Pick<Internal.FormProviderState<T>, K> | null) | Pick<Internal.FormProviderState<T>, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callBack?: (() => void) | undefined): void;
            props: Readonly<{
                children?: React.ReactNode;
            }> & Readonly<Exp.FormProviderProps<T>>;
            state: Readonly<Internal.FormProviderState<T>>;
            context: any;
            refs: {
                [key: string]: React.ReactInstance;
            };
        };
        getDerivedStateFromProps: (np: Exp.FormProviderProps<T>, ps: Internal.FormProviderState<T>) => Partial<Internal.FormProviderState<T>>;
    };
    Field: React.ComponentClass<Exp.FormFieldProps<T, keyof T>>;
    FormComponent: {
        new (props: any): {
            _render(provider: Internal.ProviderValueLoaded<T, keyof T>): JSX.Element;
            render(): JSX.Element;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Exp.FormComponentProps<T, keyof T>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callBack?: (() => void) | undefined): void;
            props: Readonly<{
                children?: React.ReactNode;
            }> & Readonly<Exp.FormComponentProps<T, keyof T>>;
            state: Readonly<{}>;
            context: any;
            refs: {
                [key: string]: React.ReactInstance;
            };
        };
    };
    createField: <K extends keyof T>(fieldName: K, component?: React.ComponentClass<Exp.FieldProps<T, K>> | React.StatelessComponent<Exp.FieldProps<T, K>> | undefined) => React.ComponentClass<Exp.TypedFormFieldProps<T, K>>;
};
export default createForm;
export declare const Form: {
    new (props: any): {
        validators: Partial<Internal.ValidatorSet<any>>;
        registerValidator<K extends string>(fieldName: K, validators: Exp.Validator<any, K>[]): void;
        registerField<K extends string>(fieldName: K, value: any, validators: Exp.Validator<any, K>[]): void;
        submit(): void;
        getFormValue(): any;
        setFieldValue<P extends string>(fieldName: P, val: any): void;
        touchField<K extends string>(fieldName: K): void;
        touchFields<K extends string>(fieldNames: K[]): void;
        untouchField<K extends string>(fieldName: K): void;
        untouchFields<K extends string>(fieldNames: K[]): void;
        onFieldBlur<K extends string>(fieldName: K): void;
        clearForm(): void;
        resetForm(): void;
        unload(): void;
        forgetState(): void;
        validateForm(): Exp.FormValidationResult<any>;
        getComputedState(): Internal.ComputedFormState<any>;
        getProviderValue(): Internal.ProviderValueLoaded<any, string>;
        render(): JSX.Element;
        setState<K extends "fields" | "initialValue" | "isBusy" | "loaded" | "submitting" | "submitCount">(state: Internal.FormProviderState<any> | ((prevState: Readonly<Internal.FormProviderState<any>>, props: Exp.FormProviderProps<any>) => Internal.FormProviderState<any> | Pick<Internal.FormProviderState<any>, K> | null) | Pick<Internal.FormProviderState<any>, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<Exp.FormProviderProps<any>>;
        state: Readonly<Internal.FormProviderState<any>>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    getDerivedStateFromProps: (np: Exp.FormProviderProps<any>, ps: Internal.FormProviderState<any>) => Partial<Internal.FormProviderState<any>>;
};
export declare const Field: React.ComponentClass<Exp.FormFieldProps<any, string>>;
export declare const FormComponent: {
    new (props: any): {
        _render(provider: Internal.ProviderValueLoaded<any, string>): JSX.Element;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Exp.FormComponentProps<any, string>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<Exp.FormComponentProps<any, string>>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
export { required, maxLength, minLength } from './validators';
