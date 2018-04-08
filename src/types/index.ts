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

export type FormFieldState<T> = { [k in keyof T]?: FieldState } | null

export interface FormProviderState<T> {
  value: FormFieldState<T>
  loaded: boolean
  submitCount: number
}

export interface FormProviderProps<T> {
  loadAsync?: () => Promise<T>
  initialValue?: T
  submit?: (formValue: T) => any
  children: React.ReactNode
}

export interface Validator {
  (value, fieldName, formValue): string | undefined
}

export interface FormFieldProps<T> {
  name: FieldName<T>
  validators?: Validator[]
  render?: (state: FormContextReceiverProps<T>) => React.ReactNode
  component?: React.ComponentType<FormContextReceiverProps<T>> | React.ComponentType<any>
  [key: string]: any
}

export interface FormProviderOptions<T> {
  initialValue: T
  loadAsync: () => Promise<T>
  submit?: (formValue: T) => any
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
  isTouched: boolean
  onBlur: (e) => void
  clearForm: () => void
  submitCount: number
  validation: FieldValidationResult
}

export interface ReactContextForm<T> {
  Form: React.ComponentClass<FormProviderProps<T>>
  Field: React.ComponentClass<FormFieldProps<T>>
}

export interface ProviderValue<T> {
  value: FormFieldState<T>
  loaded: boolean
  submit: (formValue: T) => any
  submitCount: number
  clearForm: () => void
  validation: FormValidationResult<T>
  registerValidator: RegisterValidator<T>
  onFieldBlur: (fieldName: FieldName<T>) => void
  setFieldValue: (fieldName: FieldName<T>, value: any) => void
}

export interface InnerFieldProps<T> extends FieldState {
  name: FieldName<T>
  isDirty: boolean
  state: FieldState
  submitCount: number
  submit: (formValue: T) => any
  onBlur?: (e) => void
  clearForm: () => void
  validators?: Validator[]
  validation: ValidationResult
  render: (value) => React.ReactNode
  registerValidator: RegisterValidator<T>
  onFieldBlur: (fieldName: FieldName<T>) => void
  setFieldValue: (fieldName: FieldName<T>, value: any) => void
  component: React.ComponentType<FormContextReceiverProps<T>> | React.ComponentType<any>
}

export interface RegisterValidator<T> {
  (fieldName: FieldName<T>, validators: Validator[])
}
