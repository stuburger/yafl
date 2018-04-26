/// <reference types="react" />
import * as React from 'react';
export interface ProviderValue<T, P extends keyof T = keyof T> {
    fields: FormFieldState<T>;
    getFormValue: (() => T) | Noop;
    initialValue: T;
    unload: (() => void) | Noop;
    resetForm: (() => void) | Noop;
    loaded: boolean;
    submitting: boolean;
    isBusy: boolean;
    formIsTouched: boolean;
    formIsValid: boolean;
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
export interface ProviderValueLoaded<T, P extends keyof T = keyof T> extends ProviderValue<T, P> {
    unload: (() => void);
    getFormValue: () => T;
    forgetState: (() => void);
    submit: (() => void);
    resetForm: (() => void);
    submitCount: number;
    clearForm: (() => void);
    validation: FormValidationResult<T>;
    registerValidator: RegisterValidator<T>;
    registerField: (<K extends P>(fieldName: K, initialValue: T[K], validators: Validator<T, K>[]) => void);
    onFieldBlur: (<K extends P>(fieldName: K) => void);
    setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void);
    touch: (<K extends P>(fieldName: K) => void);
    untouch: (<K extends P>(fieldName: K) => void);
}
export declare type GenericFieldHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement> | React.SelectHTMLAttributes<HTMLSelectElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export interface BoolFunc {
    (props: any): boolean;
}
export declare type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
export interface FieldState<T> {
    value: T;
    didBlur: boolean;
    touched: boolean;
    originalValue: T;
}
export declare type FormFieldState<T> = {
    [K in keyof T]: FieldState<T[K]>;
};
export interface FormProviderState<T> {
    fields: FormFieldState<T>;
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
    (value: FieldState<T[K]>, fields: FormFieldState<T>, fieldName: K): string | undefined;
}
export declare type ValidatorSet<T> = {
    [P in keyof T]: Validator<T, P>[];
};
export interface FormComponentProps<T, K extends keyof T = keyof T> extends UnrecognizedProps {
    render?: (state: GeneralComponentProps<T, K>) => React.ReactNode;
    component?: React.ComponentType<GeneralComponentProps<T, K>> | React.ComponentType<any>;
}
export interface FormFieldProps<T, K extends keyof T = keyof T> extends UnrecognizedProps {
    name: K;
    initialValue?: T[K];
    validators?: Validator<T, K>[];
    render?: (state: FieldProps<T, K>) => React.ReactNode;
    component?: React.ComponentType<FieldProps<T, K>> | React.ComponentType<any>;
}
export interface TypedFormFieldProps<T, K extends keyof T> {
    initialValue?: T[K];
    validators?: Validator<T, K>[];
    render?: (state: FieldProps<T, K>) => React.ReactNode;
    component?: React.ComponentType<FieldProps<T, K>> | React.ComponentType<any>;
    [key: string]: any;
}
export interface FieldValidationResult {
    isValid: boolean;
    messages: string[];
}
export declare type FormValidationResult<T> = {
    [K in keyof T]: string[];
};
export interface FormUtils<T, P extends keyof T> {
    touch: <K extends P>(fieldName: K) => void;
    untouch: <K extends P>(fieldName: K) => void;
    resetForm: () => void;
    getFormValue: () => T;
    unload: () => void;
    submit: () => void;
    setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void;
    forgetState: () => void;
    clearForm: () => void;
}
export interface FieldUtils<T, P extends keyof T> extends FormUtils<T, P> {
    touch: () => void;
    untouch: () => void;
    setValue: (value: T[P]) => void;
}
export interface FormMeta<T> {
    initialValue: T;
    isDirty: boolean;
    touched: boolean;
    submitCount: number;
    loaded: boolean;
    submitting: boolean;
    isValid: boolean;
    validation: FormValidationResult<T>;
}
export interface FieldMeta<T, K extends keyof T> {
    didBlur: boolean;
    isDirty: boolean;
    touched: boolean;
    submitCount: number;
    loaded: boolean;
    submitting: boolean;
    isValid: boolean;
    messages: string[];
    originalValue: T[K];
}
export interface InputProps<T, K extends keyof T> {
    name: K;
    value: T[K];
    onBlur: (e) => void;
    onChange: (e) => void;
}
export interface UnrecognizedProps {
    [key: string]: any;
}
export interface BaseRequiredInnerComponentProps<T, K extends keyof T> {
    render?: (state: GeneralComponentProps<T, K>) => React.ReactNode;
    component?: React.ComponentType<GeneralComponentProps<T, K>> | React.ComponentType<any>;
}
export interface ComputedFormState<T> {
    formIsDirty: boolean;
    formIsTouched: boolean;
    formIsValid: boolean;
    validation: FormValidationResult<T>;
}
export interface GeneralComponentProps<T, K extends keyof T = keyof T> extends UnrecognizedProps {
    utils: FormUtils<T, K>;
    state: FormMeta<T>;
}
export interface FieldProps<T, K extends keyof T> extends UnrecognizedProps {
    input: InputProps<T, K>;
    meta: FieldMeta<T, K>;
    utils: FieldUtils<T, K>;
    [key: string]: any;
}
export interface RecognizedFieldProps<T, K extends keyof T> {
    name: K;
    initialValue?: T[K];
    validators: Validator<T, K>[];
    render?: (state: FieldProps<T, K>) => React.ReactNode;
    component?: React.ComponentType<FieldProps<T, K>> | React.ComponentType<any>;
}
export interface InnerGeneralComponentProps<T, K extends keyof T = keyof T> {
    provider: ProviderValueLoaded<T, K>;
    forwardProps: UnrecognizedProps;
    render?: (state: GeneralComponentProps<T, K>) => React.ReactNode;
    component?: React.ComponentType<GeneralComponentProps<T, K>> | React.ComponentType<any>;
}
export interface InnerFieldProps<T, K extends keyof T = keyof T> extends RecognizedFieldProps<T, K> {
    provider: ProviderValueLoaded<T, K>;
    forwardProps: UnrecognizedProps;
    field: FieldState<T[K]>;
}
export interface RegisterValidator<T> {
    <K extends keyof T>(fieldName: K, validators: Validator<T, K>[]): void;
}
export interface Noop {
    (): never;
}
export declare function createForm<T>(initialValue: T): {
    Form: {
        new (props: any): {
            validators: Partial<ValidatorSet<T>>;
            registerValidator<K extends keyof T>(fieldName: K, validators: Validator<T, K>[]): void;
            registerField<K extends keyof T>(fieldName: K, value: T[K], validators: Validator<T, K>[]): void;
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
            validateForm(): FormValidationResult<T>;
            getComputedState(): ComputedFormState<T>;
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
    Field: React.ComponentClass<FormFieldProps<T, keyof T>>;
    FormComponent: {
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
    createField: <K extends keyof T>(fieldName: K, component?: React.ComponentClass<FieldProps<T, K>> | React.StatelessComponent<FieldProps<T, K>> | undefined) => React.ComponentClass<TypedFormFieldProps<T, K>>;
};
export default createForm;
export declare const Form: {
    new (props: any): {
        validators: Partial<ValidatorSet<any>>;
        registerValidator<K extends string>(fieldName: K, validators: Validator<any, K>[]): void;
        registerField<K extends string>(fieldName: K, value: any, validators: Validator<any, K>[]): void;
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
        validateForm(): FormValidationResult<any>;
        getComputedState(): ComputedFormState<any>;
        getProviderValue(): ProviderValueLoaded<any, string>;
        render(): JSX.Element;
        setState<K extends "fields" | "initialValue" | "isBusy" | "loaded" | "submitting" | "submitCount">(state: FormProviderState<any> | ((prevState: Readonly<FormProviderState<any>>, props: FormProviderProps<any>) => FormProviderState<any> | Pick<FormProviderState<any>, K> | null) | Pick<FormProviderState<any>, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormProviderProps<any>>;
        state: Readonly<FormProviderState<any>>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    getDerivedStateFromProps: (np: FormProviderProps<any>, ps: FormProviderState<any>) => Partial<FormProviderState<any>>;
};
export declare const Field: React.ComponentClass<FormFieldProps<any, string>>;
export declare const FormComponent: {
    new (props: any): {
        _render(provider: ProviderValueLoaded<any, string>): JSX.Element;
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: FormComponentProps<any, string>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<FormComponentProps<any, string>>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
export { required, maxLength, minLength } from './validators';
