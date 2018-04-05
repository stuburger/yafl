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
  isDirty: boolean
  isValid: boolean
  isTouched: boolean
  originalValue: any
}

export type FormFieldState<T> = { [k in keyof T]: FieldState } | null

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
  (value, fieldName, formValue): string
}

export interface FormFieldProps<T> {
  name: keyof T
  validators?: Validator[]
  render: (state: FormContextReceiverProps) => React.ReactNode
}

export interface FormProviderOptions<T> {
  initialValue: T
  loadAsync: () => Promise<T>
}

export interface FieldValidationResult {
  isValid: boolean
  messages: string[]
}

export interface FormContextReceiverProps {
  onChange: (value: any) => void
  submit: () => void
  value: any
  validation: FieldValidationResult
}

export interface ReactContextForm<T> {
  Form: React.ComponentClass<FormProviderProps<T>>
  Field: React.ComponentClass<FormFieldProps<T>>
}

export interface ProviderValue<T> {
  value: FormFieldState<T>
  loaded: boolean
  submit: () => void
  registerValidator: RegisterValidator<T>
  validateField: (fieldName: keyof T, value: any) => FieldValidationResult
  setFieldValue: (fieldName: keyof T, value: any) => void
}

export interface InnerFieldProps<T> extends FieldState {
  submit: () => void
  render: (value) => React.ReactNode
  name: keyof T
  validationResult: FieldValidationResult
  setFieldValue: (fieldName: keyof T, value: any) => void
  validators?: Validator[]
  registerValidator: RegisterValidator<T>
}

export interface RegisterValidator<T> {
  (fieldName: keyof T, validators: Validator[])
}
