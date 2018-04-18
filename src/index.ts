import * as React from 'react'
import wrapProvider from './form/createFormProvider'
import createField from './form/createField'
import createFormComponent from './form/createFormComponent'
import initializeState from './form/getInitialState'

declare module 'react' {
  type Provider<T> = React.ComponentType<{
    value: T
    children?: React.ReactNode
  }>
  type Consumer<T> = React.ComponentType<{
    children: (value: T) => React.ReactNode
    unstable_observedBits?: number
  }>
  interface Context<T> {
    Provider: Provider<T>
    Consumer: Consumer<T>
  }
  function createContext<T>(
    defaultValue: T,
    calculateChangedBits?: (prev: T, next: T) => number
  ): Context<T>
}

export type FieldName<T> = keyof T

export interface BoolFunc {
  (props: any): boolean
}

export type FieldValue<T, K extends keyof T> = T[K]
//{ [P in keyof T]: T[P] | null }

export type Nullable<T> = { [P in keyof T]: T[P] | null }

export interface FieldState<T> {
  value: T | null
  didBlur: boolean
  touched: boolean
  originalValue: T | null
}

export type FormFieldState<T> = { [K in keyof T]: FieldState<T[K]> }

export interface FormProviderState<T> {
  value: FormFieldState<T>
  initialValue: T
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  submitCount: number
}

export interface Person {
  name: string
  surname: string
  age: number
  gender: string
  contact: Contact
  favorites: string[]
}

export interface Contact {
  tel: string
}

export type StringOrNothing = string | undefined

export interface FormProviderProps<T> {
  initialValue?: T
  submit?: (formValue: Nullable<T>) => void
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
}

export interface Validator<T, K extends keyof T> {
  (value: FieldState<FieldValue<T, K>>, formValue: FormFieldState<T>, fieldName: FieldName<T>):
    | string
    | undefined
}

export type ValidatorSet<T> = { [P in FieldName<T>]: Validator<T, P>[] }

export interface FormComponentWrapper<T> {
  render?: (state: FormBaseContextReceiverProps<T>) => React.ReactNode
  component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>
  [key: string]: any
}

export interface FormFieldProps<T> extends FormComponentWrapper<T> {
  name: FieldName<T>
  validators?: Validator<T, keyof T>[]
  render?: (state: FormContextReceiverProps<T>) => React.ReactNode
  component?: React.ComponentType<FormContextReceiverProps<T>> | React.ComponentType<any>
}

export interface FormProviderOptions<T> {
  initialValue?: T
  submit?: (formValue: Nullable<T>) => void
}

export type ValidationResult = string[]
export interface FieldValidationResult {
  isValid: boolean
  messages: ValidationResult
}

export type FormValidationResult<T> = { [K in keyof T]: string[] }

export interface FormBaseContextReceiverProps<T> {
  submit: () => void
  setFieldValue: (fieldName: FieldName<T>, value: FieldValue<T, keyof T>) => void
  submitCount: number
  value: FormFieldState<T>
  loaded: boolean
  unload: () => void
  submitting: boolean
  forgetState: () => void
  clearForm: () => void
  [key: string]: any
}
export interface FormContextReceiverProps<T> extends FormBaseContextReceiverProps<T> {
  name: FieldName<T>
  onChange: (value: any) => void
  value: any
  didBlur: boolean
  isDirty: boolean
  touched: boolean
  onBlur: (e) => void
  unload: () => void
}

export interface ReactContextForm<T> {
  Form: React.ComponentClass<FormProviderProps<T>>
  Field: React.ComponentClass<FormFieldProps<T>>
  FormComponent: React.ComponentClass<FormComponentWrapper<T>>
}

export interface ProviderValue<T> {
  value: FormFieldState<T>
  initialValue: T
  unload: () => void
  loaded: boolean
  submitting: boolean
  isBusy: boolean
  formIsDirty: boolean
  forgetState: () => void
  submit: () => void
  submitCount: number
  clearForm: () => void
  validation: FormValidationResult<T>
  registerValidator: RegisterValidator<T>
  registerField: (
    fieldName: FieldName<T>,
    initialValue: any,
    validators: Validator<T, keyof T>[]
  ) => void
  onFieldBlur: (fieldName: FieldName<T>) => void
  setFieldValue: (fieldName: FieldName<T>, value: any) => void
  touch: (fieldName: FieldName<T>) => void
  untouch: (fieldName: FieldName<T>) => void
}

export interface BaseFormComponentProps<T> {
  submitCount: number
  clearForm: () => void
  unload: () => void
  forgetState: () => void
  submitting: boolean
  formIsDirty: boolean
  submit: () => void
  touch: (fieldName: FieldName<T>) => void
  untouch: (fieldName: FieldName<T>) => void
  setFieldValue: (fieldName: FieldName<T>, value: any) => void
}

export interface BaseInnerFieldProps<T> extends BaseFormComponentProps<T> {
  name: FieldName<T>
  isDirty: boolean
  initialValue?: any
  onBlur?: (e) => void
  validators?: Validator<T, keyof T>[]
  validation: ValidationResult
  registerValidator: RegisterValidator<T>
  onFieldBlur: (fieldName: FieldName<T>) => void
  render?: (value) => React.ReactNode
  registerField: (
    fieldName: FieldName<T>,
    initialValue: any,
    validators: Validator<T, keyof T>[]
  ) => void
  component?: React.ComponentType<FormContextReceiverProps<T>> | React.ComponentType<any>
}

export interface FormComponentProps<T> extends BaseFormComponentProps<T> {
  loaded: boolean
  value: FormFieldState<T>
  render?: (value: FormBaseContextReceiverProps<T>) => React.ReactNode
  component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>
}

export type InnerFieldProps<T, P extends keyof T> = BaseInnerFieldProps<T> & FieldState<T[P]>

export interface RegisterValidator<T> {
  (fieldName: FieldName<T>, validators: Validator<T, keyof T>[])
}

function getFormContext<T>(initialValue: T): React.Context<FormProviderState<T>> {
  return React.createContext<FormProviderState<T>>({
    value: initializeState<T>(initialValue),
    loaded: false,
    submitting: false,
    isBusy: false,
    submitCount: 0,
    initialValue: {} as T
  })
}

export function createForm<T>(initialState: Partial<T> = {}): ReactContextForm<Partial<T>> {
  const { Consumer, Provider } = getFormContext<Partial<T>>(initialState)

  return {
    Form: wrapProvider<Partial<T>>(Provider, {
      initialValue: initialState
    }),
    Field: createField<Partial<T>>(Consumer),
    FormComponent: createFormComponent<Partial<T>>(Consumer)
  }
}
