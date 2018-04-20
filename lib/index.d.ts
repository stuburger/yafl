/// <reference types="react" />
import * as React from 'react';
declare module 'react' {
    type Provider<T> = React.ComponentType<{
        value: T;
        children?: React.ReactNode;
    }>;
    type Consumer<T> = React.ComponentType<{
        children: (value: T) => React.ReactNode;
        unstable_observedBits?: number;
    }>;
    interface Context<T> {
        Provider: Provider<T>;
        Consumer: Consumer<T>;
    }
    function createContext<T>(defaultValue: T, calculateChangedBits?: (prev: T, next: T) => number): Context<T>;
}
export declare type FieldName<T> = keyof T;
export interface BoolFunc {
    (props: any): boolean;
}
export declare type FieldValue<T, K extends keyof T> = T[K];
export declare type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
export interface FieldState<T> {
    value: T | null;
    didBlur: boolean;
    touched: boolean;
    originalValue: T | null;
}
export declare type FormFieldState<T> = {
    [K in keyof T]: FieldState<T[K]>;
};
export interface FormProviderState<T> {
    value: FormFieldState<T>;
    initialValue: T;
    isBusy: boolean;
    loaded: boolean;
    submitting: boolean;
    submitCount: number;
}
export interface Person {
    name: string;
    surname: string;
    age: number;
    gender: string;
    contact: Contact;
    favorites: string[];
}
export interface Contact {
    tel: string;
}
export declare type StringOrNothing = string | undefined;
export interface FormProviderProps<T> {
    initialValue?: T;
    submit?: (formValue: Nullable<T>) => void;
    children: React.ReactNode;
    loaded?: boolean;
    submitting?: boolean;
    allowReinitialize?: boolean;
    rememberStateOnReinitialize?: boolean;
}
export interface Validator<T, K extends keyof T> {
    (value: FieldState<FieldValue<T, K>>, formValue: FormFieldState<T>, fieldName: FieldName<T>): string | undefined;
}
export declare type ValidatorSet<T> = {
    [P in FieldName<T>]: Validator<T, P>[];
};
export interface FormComponentWrapper<T> {
    render?: (state: FormBaseContextReceiverProps<T>) => React.ReactNode;
    component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>;
    [key: string]: any;
}
export interface FormFieldProps<T, K extends keyof T> extends FormComponentWrapper<T> {
    name: K;
    validators?: Validator<T, K>[];
    render?: (state: FormContextReceiverProps<T, K>) => React.ReactNode;
    component?: React.ComponentType<FormContextReceiverProps<T, K>> | React.ComponentType<any>;
}
export interface FormProviderOptions<T> {
    initialValue?: T;
    submit?: (formValue: Nullable<T>) => void;
}
export declare type ValidationResult = string[];
export interface FieldValidationResult {
    isValid: boolean;
    messages: ValidationResult;
}
export declare type FormValidationResult<T> = {
    [K in keyof T]: string[];
};
export interface FormBaseContextReceiverProps<T> {
    submit: () => void;
    setFieldValue: (fieldName: FieldName<T>, value: T[keyof T]) => void;
    submitCount: number;
    value: FormFieldState<T>;
    loaded: boolean;
    unload: () => void;
    submitting: boolean;
    forgetState: () => void;
    clearForm: () => void;
    [key: string]: any;
}
export interface FormContextReceiverProps<T, K extends keyof T> {
    name: K;
    onChange: (e) => void;
    value: any;
    didBlur: boolean;
    isDirty: boolean;
    touched: boolean;
    onBlur: (e) => void;
    unload: () => void;
    submit: () => void;
    setFieldValue: (fieldName: K, value: T[K]) => void;
    submitCount: number;
    loaded: boolean;
    submitting: boolean;
    forgetState: () => void;
    clearForm: () => void;
    [key: string]: any;
}
export interface ReactContextForm<T> {
    Form: React.ComponentClass<FormProviderProps<T>>;
    Field: React.ComponentClass<FormFieldProps<T, keyof T>>;
    FormComponent: React.ComponentClass<FormComponentWrapper<T>>;
    createTypedField: any;
}
export interface ProviderValue<T> {
    value: FormFieldState<T>;
    initialValue: T;
    unload: () => void;
    loaded: boolean;
    submitting: boolean;
    isBusy: boolean;
    formIsDirty: boolean;
    forgetState: () => void;
    submit: () => void;
    submitCount: number;
    clearForm: () => void;
    validation: FormValidationResult<T>;
    registerValidator: RegisterValidator<T>;
    registerField: (fieldName: FieldName<T>, initialValue: any, validators: Validator<T, keyof T>[]) => void;
    onFieldBlur: (fieldName: FieldName<T>) => void;
    setFieldValue: (fieldName: FieldName<T>, value: any) => void;
    touch: (fieldName: FieldName<T>) => void;
    untouch: (fieldName: FieldName<T>) => void;
}
export interface BaseFormComponentProps<T> {
    submitCount: number;
    clearForm: () => void;
    unload: () => void;
    forgetState: () => void;
    submitting: boolean;
    formIsDirty: boolean;
    submit: () => void;
    touch: (fieldName: FieldName<T>) => void;
    untouch: (fieldName: FieldName<T>) => void;
    setFieldValue: (fieldName: FieldName<T>, value: any) => void;
}
export interface BaseInnerFieldProps<T, K extends keyof T> {
    name: K;
    isDirty: boolean;
    initialValue?: any;
    onBlur?: (e) => void;
    validators?: Validator<T, K>[];
    validation: ValidationResult;
    registerValidator: RegisterValidator<T>;
    onFieldBlur: (fieldName: K) => void;
    render?: (value) => React.ReactNode;
    registerField: (fieldName: K, initialValue: T[K], validators: Validator<T, K>[]) => void;
    component?: React.ComponentType<FormContextReceiverProps<T, K>> | React.ComponentType<any>;
    submitCount: number;
    clearForm: () => void;
    unload: () => void;
    forgetState: () => void;
    submitting: boolean;
    formIsDirty: boolean;
    submit: () => void;
    touch: (fieldName: K) => void;
    untouch: (fieldName: K) => void;
    setFieldValue: (fieldName: K, value: T[K]) => void;
}
export interface FormComponentProps<T> extends BaseFormComponentProps<T> {
    loaded: boolean;
    value: FormFieldState<T>;
    render?: (value: FormBaseContextReceiverProps<T>) => React.ReactNode;
    component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>;
}
export declare type InnerFieldProps<T, K extends keyof T> = BaseInnerFieldProps<T, K> & FieldState<T[K]>;
export interface RegisterValidator<T> {
    (fieldName: FieldName<T>, validators: Validator<T, keyof T>[]): any;
}
export declare function createForm<T>(initialState?: Partial<T>): {
    Form: React.ComponentClass<FormProviderProps<Partial<T>>>;
    Field: {
        new (props: FormFieldProps<Partial<T>, keyof T>, context?: any): {
            _render: ({value, loaded, formIsDirty, ...providerValue}: ProviderValue<Partial<T>>) => JSX.Element;
            render(): JSX.Element;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: FormFieldProps<Partial<T>, keyof T>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callBack?: (() => void) | undefined): void;
            props: Readonly<{
                children?: React.ReactNode;
            }> & Readonly<FormFieldProps<Partial<T>, keyof T>>;
            state: Readonly<{}>;
            context: any;
            refs: {
                [key: string]: React.ReactInstance;
            };
        };
    };
    FormComponent: {
        new (props: FormComponentWrapper<Partial<T>>, context?: any): {
            _render: ({registerValidator, registerField, onFieldBlur, ...providerValue}: ProviderValue<Partial<T>>) => JSX.Element;
            render(): JSX.Element;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: FormComponentWrapper<Partial<T>>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callBack?: (() => void) | undefined): void;
            props: Readonly<{
                children?: React.ReactNode;
            }> & Readonly<FormComponentWrapper<Partial<T>>>;
            state: Readonly<{}>;
            context: any;
            refs: {
                [key: string]: React.ReactInstance;
            };
        };
    };
    createTypedField: <K extends keyof T>(fieldName: K) => {
        new (props: FormFieldProps<Partial<T>, K>, context?: any): {
            _render: ({value, loaded, formIsDirty, ...providerValue}: ProviderValue<Partial<T>>) => JSX.Element;
            render(): JSX.Element;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: FormFieldProps<Partial<T>, K>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callBack?: (() => void) | undefined): void;
            props: Readonly<{
                children?: React.ReactNode;
            }> & Readonly<FormFieldProps<Partial<T>, K>>;
            state: Readonly<{}>;
            context: any;
            refs: {
                [key: string]: React.ReactInstance;
            };
        };
    };
};
