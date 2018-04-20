/// <reference types="react" />
import * as React from 'react';
export interface BoolFunc {
    (props: any): boolean;
}
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
    (value: FieldState<T[K]>, formValue: FormFieldState<T>, fieldName: K): string | undefined;
}
export declare type ValidatorSet<T> = {
    [P in keyof T]: Validator<T, P>[];
};
export interface FormComponentWrapper<T> {
    render?: (state: FormBaseContextReceiverProps<T>) => React.ReactNode;
    component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>;
    [key: string]: any;
}
export interface FormFieldProps<T, K extends keyof T> {
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
    setFieldValue: (fieldName: keyof T, value: T[keyof T]) => void;
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
export interface ProviderValue<T, K extends keyof T> {
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
    registerValidator: RegisterValidator<T, K>;
    registerField: (fieldName: K, initialValue: T[K], validators: Validator<T, K>[]) => void;
    onFieldBlur: (fieldName: K) => void;
    setFieldValue: (fieldName: K, value: any) => void;
    touch: (fieldName: K) => void;
    untouch: (fieldName: K) => void;
}
export interface BaseFormComponentProps<T> {
    submitCount: number;
    clearForm: () => void;
    unload: () => void;
    forgetState: () => void;
    submitting: boolean;
    formIsDirty: boolean;
    submit: () => void;
    touch: (fieldName: keyof T) => void;
    untouch: (fieldName: keyof T) => void;
    setFieldValue: (fieldName: keyof T, value: any) => void;
}
export interface BaseInnerFieldProps<T, K extends keyof T> {
    name: K;
    isDirty: boolean;
    initialValue?: any;
    onBlur?: (e) => void;
    validators?: Validator<T, K>[];
    validation: ValidationResult;
    registerValidator: RegisterValidator<T, K>;
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
export interface RegisterValidator<T, K extends keyof T> {
    (fieldName: K, validators: Validator<T, K>[]): any;
}
export declare function createForm<T>(initialState?: Partial<T>): {
    Form: {
        new (props: any): {
            validators: Partial<ValidatorSet<Partial<T>>>;
            state: FormProviderState<Partial<T>>;
            submit(): void;
            setFieldValue(fieldName: keyof T, val: Partial<T>[keyof T]): void;
            touchField(fieldName: keyof T): void;
            touchFields(fieldNames: (keyof T)[]): void;
            untouchField(fieldName: keyof T): void;
            untouchFields(fieldNames: (keyof T)[]): void;
            onFieldBlur(fieldName: keyof T): void;
            unload(): void;
            forgetState(): void;
            validateForm(): FormValidationResult<Partial<T>>;
            clearForm(): void;
            registerField(fieldName: keyof T, value: Partial<T>[keyof T], validators: Validator<Partial<T>, keyof T>[]): void;
            formIsDirty(): boolean;
            registerValidator(fieldName: keyof T, validators: Validator<Partial<T>, keyof T>[]): void;
            getProviderValue(): ProviderValue<Partial<T>, keyof T>;
            render(): JSX.Element;
            setState<K extends "value" | "initialValue" | "isBusy" | "loaded" | "submitting" | "submitCount">(state: FormProviderState<Partial<T>> | ((prevState: Readonly<FormProviderState<Partial<T>>>, props: FormProviderProps<Partial<T>>) => FormProviderState<Partial<T>> | Pick<FormProviderState<Partial<T>>, K> | null) | Pick<FormProviderState<Partial<T>>, K> | null, callback?: (() => void) | undefined): void;
            forceUpdate(callBack?: (() => void) | undefined): void;
            props: Readonly<{
                children?: React.ReactNode;
            }> & Readonly<FormProviderProps<Partial<T>>>;
            context: any;
            refs: {
                [key: string]: React.ReactInstance;
            };
        };
        getDerivedStateFromProps: (np: FormProviderProps<Partial<T>>, ps: FormProviderState<Partial<T>>) => Partial<FormProviderState<Partial<T>>>;
    };
    Field: React.ComponentClass<FormFieldProps<Partial<T>, keyof T>>;
    FormComponent: {
        new (props: FormComponentWrapper<Partial<T>>, context?: any): {
            _render: ({registerValidator, registerField, onFieldBlur, ...providerValue}: ProviderValue<Partial<T>, keyof T>) => JSX.Element;
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
    createTypedField: <K extends keyof T>(fieldName: K, options?: any) => React.ComponentClass<FormFieldProps<T, K>>;
};
