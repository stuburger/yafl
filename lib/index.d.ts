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
export interface Validator<T, K extends keyof T = keyof T> {
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
export interface FormFieldProps<T, P extends keyof T = keyof T> {
    name: P;
    validators?: Validator<T, P>[];
    render?: (state: FormContextReceiverProps<T, P>) => React.ReactNode;
    component?: React.ComponentType<FormContextReceiverProps<T, P>> | React.ComponentType<any>;
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
    setFieldValue: <K extends keyof T>(fieldName: K, value: T[K]) => void;
    submitCount: number;
    value: FormFieldState<T>;
    loaded: boolean;
    unload: () => void;
    submitting: boolean;
    forgetState: () => void;
    clearForm: () => void;
    [key: string]: any;
}
export interface FormContextReceiverProps<T, P extends keyof T = keyof T> {
    name: P;
    onChange: (e) => void;
    value: T[P];
    didBlur: boolean;
    isDirty: boolean;
    touched: boolean;
    onBlur: (e) => void;
    unload: () => void;
    submit: () => void;
    setFieldValue: <K extends keyof T>(fieldName: K, value: T[K]) => void;
    setValue: (value: T[P]) => void;
    submitCount: number;
    loaded: boolean;
    submitting: boolean;
    forgetState: () => void;
    clearForm: () => void;
    [key: string]: any;
}
export interface ReactContextForm<T> {
    Form: React.ComponentClass<FormProviderProps<T>>;
    Field: React.ComponentClass<FormFieldProps<T>>;
    FormComponent: React.ComponentClass<FormComponentWrapper<T>>;
    createTypedField: any;
}
export interface ProviderValue<T, P extends keyof T = keyof T> {
    value: FormFieldState<T>;
    initialValue: T;
    unload: (() => void) | Noop;
    loaded: boolean;
    submitting: boolean;
    isBusy: boolean;
    formIsDirty: boolean;
    forgetState: (() => void) | Noop;
    submit: (() => void) | Noop;
    submitCount: number;
    clearForm: (() => void) | Noop;
    validation: FormValidationResult<T>;
    registerValidator: RegisterValidator<T> | Noop;
    registerField: (<K extends P>(fieldName: K, initialValue: T[K], validators: Validator<T, K>[]) => void) | Noop;
    onFieldBlur: (<K extends P>(fieldName: K) => void) | Noop;
    setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void) | Noop;
    touch: (<K extends P>(fieldName: K) => void) | Noop;
    untouch: (<K extends P>(fieldName: K) => void) | Noop;
}
export interface BaseFormComponentProps<T, P extends keyof T = keyof T> {
    submitCount: number;
    clearForm: () => void;
    unload: () => void;
    forgetState: () => void;
    submitting: boolean;
    formIsDirty: boolean;
    submit: () => void;
    touch: (fieldName: P) => void;
    untouch: (fieldName: P) => void;
    setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void;
}
export interface BaseInnerFieldProps<T, P extends keyof T = keyof T> {
    name: P;
    isDirty: boolean;
    initialValue?: any;
    onBlur?: (e) => void;
    validators?: Validator<T, P>[];
    validation: ValidationResult;
    registerValidator: RegisterValidator<T>;
    onFieldBlur: <K extends P>(fieldName: K) => void;
    render?: (value) => React.ReactNode;
    registerField: <K extends P>(fieldName: K, initialValue: T[K], validators: Validator<T, K>[]) => void;
    component?: React.ComponentType<FormContextReceiverProps<T>> | React.ComponentType<any>;
    submitCount: number;
    clearForm: () => void;
    unload: () => void;
    forgetState: () => void;
    submitting: boolean;
    formIsDirty: boolean;
    submit: () => void;
    touch: <K extends P>(fieldName: K) => void;
    untouch: <K extends P>(fieldName: K) => void;
    setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void;
}
export interface FormComponentProps<T> extends BaseFormComponentProps<T> {
    loaded: boolean;
    value: FormFieldState<T>;
    render?: (value: FormBaseContextReceiverProps<T>) => React.ReactNode;
    component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>;
}
export declare type InnerFieldProps<T, K extends keyof T = keyof T> = BaseInnerFieldProps<T, K> & FieldState<T[keyof T]>;
export interface RegisterValidator<T> {
    <K extends keyof T>(fieldName: K, validators: Validator<T, K>[]): void;
}
export interface Noop {
    (): never;
}
export declare function createForm<T>(initialValue?: Partial<T>): {
    Form: {
        new (props: any): {
            validators: Partial<ValidatorSet<Partial<T>>>;
            state: FormProviderState<Partial<T>>;
            submit(): void;
            setFieldValue<P extends keyof T>(fieldName: P, val: Partial<T>[P]): void;
            touchField<K extends keyof T>(fieldName: K): void;
            touchFields<K extends keyof T>(fieldNames: K[]): void;
            untouchField<K extends keyof T>(fieldName: K): void;
            untouchFields<K extends keyof T>(fieldNames: K[]): void;
            onFieldBlur<K extends keyof T>(fieldName: K): void;
            unload(): void;
            forgetState(): void;
            validateForm(): FormValidationResult<Partial<T>>;
            clearForm(): void;
            registerField<K extends keyof T>(fieldName: K, value: Partial<T>[K], validators: Validator<Partial<T>, K>[]): void;
            formIsDirty(): boolean;
            registerValidator<K extends keyof T>(fieldName: K, validators: Validator<Partial<T>, K>[]): void;
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
    createTypedField: <K extends keyof T>(fieldName: K, options?: any) => React.ComponentClass<FormFieldProps<Partial<T>, K>>;
};
export default createForm;
export declare const Form: {
    new (props: any): {
        validators: Partial<ValidatorSet<Partial<{}>>>;
        state: FormProviderState<Partial<{}>>;
        submit(): void;
        setFieldValue<P extends never>(fieldName: P, val: Partial<{}>[P]): void;
        touchField<K extends never>(fieldName: K): void;
        touchFields<K extends never>(fieldNames: K[]): void;
        untouchField<K extends never>(fieldName: K): void;
        untouchFields<K extends never>(fieldNames: K[]): void;
        onFieldBlur<K extends never>(fieldName: K): void;
        unload(): void;
        forgetState(): void;
        validateForm(): FormValidationResult<Partial<{}>>;
        clearForm(): void;
        registerField<K extends never>(fieldName: K, value: Partial<{}>[K], validators: Validator<Partial<{}>, K>[]): void;
        formIsDirty(): boolean;
        registerValidator<K extends never>(fieldName: K, validators: Validator<Partial<{}>, K>[]): void;
        getProviderValue(): ProviderValue<Partial<{}>, never>;
        render(): JSX.Element;
        setState<K extends "value" | "initialValue" | "isBusy" | "loaded" | "submitting" | "submitCount">(state: FormProviderState<Partial<{}>> | ((prevState: Readonly<FormProviderState<Partial<{}>>>, props: FormProviderProps<Partial<{}>>) => FormProviderState<Partial<{}>> | Pick<FormProviderState<Partial<{}>>, K> | null) | Pick<FormProviderState<Partial<{}>>, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormProviderProps<Partial<{}>>>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    getDerivedStateFromProps: (np: FormProviderProps<Partial<{}>>, ps: FormProviderState<Partial<{}>>) => Partial<FormProviderState<Partial<{}>>>;
};
export declare const Field: React.ComponentClass<FormFieldProps<Partial<{}>, never>>;
export declare const FormComponent: {
    new (props: FormComponentWrapper<Partial<{}>>, context?: any): {
        _render: ({registerValidator, registerField, onFieldBlur, ...providerValue}: ProviderValue<Partial<{}>, never>) => JSX.Element;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: FormComponentWrapper<Partial<{}>>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormComponentWrapper<Partial<{}>>>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
