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
}

export interface FormProviderProps<T> {
  loadAsync?: () => Promise<T>
  initialValue?: T
  children: React.ReactNode
}

export interface Validator {
  (value, fieldName, formValue): string | undefined
}

export interface FormFieldProps<T> {
  name: keyof T
  validators?: Validator[]
  render?: (state: FormContextReceiverProps) => React.ReactNode
  component?: React.ComponentType<FormContextReceiverProps> | React.ComponentType<any>
  [key: string]: any
}

export interface FormProviderOptions<T> {
  initialValue: T
  loadAsync: () => Promise<T>
}

export interface ValidationResult {
  isValid: boolean
  messages: string[]
}

export interface FormContextReceiverProps {
  onChange: (value: any) => void
  submit: () => void
  value: any
  didBlur: boolean
  isTouched: boolean
  onBlur: (e) => void
  validation: ValidationResult
}

export interface ReactContextForm<T> {
  Form: React.ComponentClass<FormProviderProps<T>>
  Field: React.ComponentClass<FormFieldProps<T>>
}

export interface ProviderValue<T> {
  value: FormFieldState<T>
  loaded: boolean
  submit: () => void
  validation: ValidationResult
  registerValidator: RegisterValidator<T>
  onFieldBlur: (fieldName: keyof T) => void
  validateField: (fieldName: keyof T, value: FieldState) => ValidationResult
  setFieldValue: (fieldName: keyof T, value: any) => void
}

export interface InnerFieldProps<T> extends FieldState {
  submit: () => void
  state: FieldState
  render: (value) => React.ReactNode
  name: keyof T
  component: React.ComponentType<FormContextReceiverProps> | React.ComponentType<any>
  validateField: (fieldName: keyof T, value: FieldState) => ValidationResult
  validationResult: ValidationResult
  setFieldValue: (fieldName: keyof T, value: any) => void
  onFieldBlur: (fieldName: keyof T) => void
  validators?: Validator[]
  registerValidator: RegisterValidator<T>
  onBlur?: (e) => void
  isDirty: boolean
}

export interface RegisterValidator<T> {
  (fieldName: keyof T, validators: Validator[])
}
