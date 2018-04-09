import * as React from 'react'
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

export interface FieldState {
  value: any
  didBlur: boolean
  isTouched: boolean
  originalValue: any
}

export interface MapPropsToFields<T> {
  (props): T
}

export type FormFieldState<T> = { [k in keyof T]?: FieldState } | null

export interface FormProviderState<T> {
  value: FormFieldState<T>
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  submitCount: number
}

export interface FormProviderProps<T> {
  getInitialValueAsync?: () => Promise<T>
  initialValue?: T
  submit?: (formValue: T) => any
  children: React.ReactNode
  loading?: (props: any) => boolean
  submitting?: (props: any) => boolean
}

export interface Validator {
  (value, fieldName, formValue): string | undefined
}

export interface FormComponentWrapper<T> {
  render?: (state: FormContextReceiverProps<T>) => React.ReactNode
  component?: React.ComponentType<FormContextReceiverProps<T>> | React.ComponentType<any>
  [key: string]: any
}

export interface FormFieldProps<T> extends FormComponentWrapper<T> {
  name: FieldName<T>
  validators?: Validator[]
}

export interface PropsToBool {
  (props): boolean
}

export interface FormProviderOptions<T> {
  initialValue: T
  getInitialValueAsync: () => Promise<T>
  submit?: (formValue: T) => any
  loading?: PropsToBool
  submitting?: PropsToBool
  getInitialValueFromProps: MapPropsToFields<T>
}

export type ValidationResult = string[]
export interface FieldValidationResult {
  isValid: boolean
  messages: ValidationResult
}

export type FormValidationResult<T> = { [K in keyof T]?: string[] }

export interface FormContextReceiverProps<T> {
  name: FieldName<T>
  onChange: (value: any) => void
  submit: () => void
  value: any
  didBlur: boolean
  isDirty: boolean
  isTouched: boolean
  onBlur: (e) => void
  clearForm: () => void
  submitCount: number
  validation: FieldValidationResult
}

export interface ReactContextForm<T> {
  Form: React.ComponentClass<FormProviderProps<T>>
  Field: React.ComponentClass<FormFieldProps<T>>
  FormComponent: React.ComponentClass<FormComponentWrapper<T>>
}

export interface ProviderValue<T> {
  value: FormFieldState<T>
  loaded: boolean
  submitting: boolean
  isBusy: boolean
  submit: (formValue: T) => any
  submitCount: number
  clearForm: () => void
  validation: FormValidationResult<T>
  registerValidator: RegisterValidator<T>
  onFieldBlur: (fieldName: FieldName<T>) => void
  setFieldValue: (fieldName: FieldName<T>, value: any) => void
}

export interface BaseFormComponentProps<T> {
  submitCount: number
  submit: (formValue: T) => any
  clearForm: () => void
  render?: (value) => React.ReactNode
  setFieldValue: (fieldName: FieldName<T>, value: any) => void
  component?: React.ComponentType<FormContextReceiverProps<T>> | React.ComponentType<any>
}

export interface BaseInnerFieldProps<T> extends BaseFormComponentProps<T> {
  name: FieldName<T>
  isDirty: boolean
  state: FieldState
  onBlur?: (e) => void
  validators?: Validator[]
  validation: ValidationResult
  registerValidator: RegisterValidator<T>
  onFieldBlur: (fieldName: FieldName<T>) => void
}

export interface FormComponentProps<T> extends BaseFormComponentProps<T> {
  value: FormFieldState<T>
  loaded: boolean
}

export type InnerFieldProps<T> = BaseInnerFieldProps<T> & FieldState

export interface RegisterValidator<T> {
  (fieldName: FieldName<T>, validators: Validator[])
}
