import * as React from 'react'
import wrapProvider from './form/createFormProvider'
import createField from './form/createField'
import createFormComponent from './form/createFormComponent'
// import initializeState from './form/getInitialState'

export interface BoolFunc {
  (props: any): boolean
}

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
  (value: FieldState<T[K]>, formValue: FormFieldState<T>, fieldName: K): string | undefined
}

export type ValidatorSet<T> = { [P in keyof T]: Validator<T, P>[] }

export interface FormComponentWrapper<T> {
  render?: (state: FormBaseContextReceiverProps<T>) => React.ReactNode
  component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>
  [key: string]: any
}

export interface FormFieldProps<T, K extends keyof T> {
  name: K
  validators?: Validator<T, K>[]
  render?: (state: FormContextReceiverProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FormContextReceiverProps<T, K>> | React.ComponentType<any>
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
  setFieldValue: (fieldName: keyof T, value: T[keyof T]) => void
  submitCount: number
  value: FormFieldState<T>
  loaded: boolean
  unload: () => void
  submitting: boolean
  forgetState: () => void
  clearForm: () => void
  [key: string]: any
}
export interface FormContextReceiverProps<T, K extends keyof T> {
  name: K
  onChange: (e) => void
  value: any
  didBlur: boolean
  isDirty: boolean
  touched: boolean
  onBlur: (e) => void
  unload: () => void
  submit: () => void
  setFieldValue: (fieldName: K, value: T[K]) => void
  submitCount: number
  // formValue: FormFieldState<T>
  loaded: boolean
  submitting: boolean
  forgetState: () => void
  clearForm: () => void
  [key: string]: any
}

export interface ReactContextForm<T> {
  Form: React.ComponentClass<FormProviderProps<T>>
  Field: React.ComponentClass<FormFieldProps<T, keyof T>>
  FormComponent: React.ComponentClass<FormComponentWrapper<T>>
  createTypedField: any
}

export interface ProviderValue<T, K extends keyof T> {
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
  registerValidator: RegisterValidator<T, K>
  registerField: (fieldName: K, initialValue: T[K], validators: Validator<T, K>[]) => void
  onFieldBlur: (fieldName: K) => void
  setFieldValue: (fieldName: K, value: any) => void
  touch: (fieldName: K) => void
  untouch: (fieldName: K) => void
}

export interface BaseFormComponentProps<T> {
  submitCount: number
  clearForm: () => void
  unload: () => void
  forgetState: () => void
  submitting: boolean
  formIsDirty: boolean
  submit: () => void
  touch: (fieldName: keyof T) => void
  untouch: (fieldName: keyof T) => void
  setFieldValue: (fieldName: keyof T, value: any) => void
}

export interface BaseInnerFieldProps<T, K extends keyof T> {
  name: K
  isDirty: boolean
  initialValue?: any
  onBlur?: (e) => void
  validators?: Validator<T, K>[]
  validation: ValidationResult
  registerValidator: RegisterValidator<T, K>
  onFieldBlur: (fieldName: K) => void
  render?: (value) => React.ReactNode
  registerField: (fieldName: K, initialValue: T[K], validators: Validator<T, K>[]) => void
  component?: React.ComponentType<FormContextReceiverProps<T, K>> | React.ComponentType<any>

  submitCount: number
  clearForm: () => void
  unload: () => void
  forgetState: () => void
  submitting: boolean
  formIsDirty: boolean
  submit: () => void
  touch: (fieldName: K) => void
  untouch: (fieldName: K) => void
  setFieldValue: (fieldName: K, value: T[K]) => void
}

export interface FormComponentProps<T> extends BaseFormComponentProps<T> {
  loaded: boolean
  value: FormFieldState<T>
  render?: (value: FormBaseContextReceiverProps<T>) => React.ReactNode
  component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>
}

export type InnerFieldProps<T, K extends keyof T> = BaseInnerFieldProps<T, K> & FieldState<T[K]>

export interface RegisterValidator<T, K extends keyof T> {
  (fieldName: K, validators: Validator<T, K>[])
}

function getFormContext<T>(initialValue: T): React.Context<ProviderValue<T, keyof T>> {
  return React.createContext<ProviderValue<T, keyof T>>({
    // value: initializeState<T>(initialValue),
    // loaded: false,
    // submitting: false,
    // isBusy: false,
    // submitCount: 0,
    // initialValue: {} as T
  } as ProviderValue<T, keyof T>)
}

export function createForm<T>(initialState: Partial<T> = {}) {
  const { Consumer, Provider } = getFormContext<Partial<T>>(initialState)

  return {
    Form: wrapProvider<Partial<T>, keyof T>(Provider, {
      initialValue: initialState
    }),
    Field: createField<Partial<T>, keyof T>(Consumer),
    FormComponent: createFormComponent<Partial<T>>(Consumer),
    createTypedField: function<K extends keyof T>(fieldName: K, options?: any) {
      return (function<O>(f: any) {
        return f as O
      })<React.ComponentClass<FormFieldProps<T, K>>>(
        createField<Partial<T>, keyof T>(Consumer, fieldName)
      )
    }
  }
}
