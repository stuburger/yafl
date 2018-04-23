import * as React from 'react'
import wrapProvider from './form/createFormProvider'
import createField, { getTypedField } from './form/createField'
import createFormComponent from './form/createFormComponent'

export interface BoolFunc {
  (props: any): boolean
}

export type Nullable<T> = { [P in keyof T]: T[P] | null }

export interface FieldState<T> {
  value: T
  didBlur: boolean
  touched: boolean
  originalValue: T
}

export type FormFieldState<T> = { [K in keyof T]: FieldState<T[K]> }

export interface FormProviderState<T> {
  fields: FormFieldState<T>
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

export interface Validator<T, K extends keyof T = keyof T> {
  (value: FieldState<T[K]>, fields: FormFieldState<T>, fieldName: K): string | undefined
}

export type ValidatorSet<T> = { [P in keyof T]: Validator<T, P>[] }

export interface FormComponentWrapper<T> {
  render?: (state: FormBaseContextReceiverProps<T>) => React.ReactNode
  component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>
  [key: string]: any
}

export interface FormFieldProps<T, K extends keyof T = keyof T> {
  name: K
  initialValue?: T[K]
  validators?: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>> | React.ComponentType<any>
  [key: string]: any
}

export interface TypedFormFieldProps<T, K extends keyof T> {
  initialValue?: T[K]
  validators?: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>> | React.ComponentType<any>
  [key: string]: any
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
  setFieldValue: <K extends keyof T>(fieldName: K, value: T[K]) => void
  submitCount: number
  fields: FormFieldState<T>
  loaded: boolean
  unload: () => void
  submitting: boolean
  forgetState: () => void
  clearForm: () => void
  [key: string]: any
}
export interface FormContextReceiverProps<T, P extends keyof T = keyof T> {
  name: P
  onChange: (e) => void
  value: T[P]
  didBlur: boolean
  isDirty: boolean
  touched: boolean
  onBlur: (e) => void
  unload: () => void
  submit: () => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
  setValue: (value: T[P]) => void
  submitCount: number
  // formValue: FormFieldState<T>
  loaded: boolean
  submitting: boolean
  forgetState: () => void
  clearForm: () => void
  [key: string]: any
}

export interface FieldUtils<T, P extends keyof T> {
  touch: <K extends P>(fieldName: K) => void
  untouch: <K extends P>(fieldName: K) => void
  unload: () => void
  submit: () => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
  setValue: (value: T[P]) => void
  forgetState: () => void
  clearForm: () => void
}

export interface FieldMeta<T, K extends keyof T> {
  didBlur: boolean
  isDirty: boolean
  touched: boolean
  submitCount: number
  loaded: boolean
  submitting: boolean
  isValid: boolean
  messages: string[]
  originalValue: T[K]
}

export interface InputProps<T, K extends keyof T> {
  name: K
  value: T[K]
  onBlur: (e) => void
  onChange: (e) => void
}

export interface ForwardProps {
  [key: string]: any
}

export interface FieldProps<T, K extends keyof T> {
  input: InputProps<T, K> // spread safe
  forward: ForwardProps // probably spread safe
  meta: FieldMeta<T, K> // not spread safe
  utils: FieldUtils<T, K> // not spread safe
}

export interface ReactContextForm<T> {
  Form: React.ComponentClass<FormProviderProps<T>>
  Field: React.ComponentClass<FormFieldProps<T>>
  FormComponent: React.ComponentClass<FormComponentWrapper<T>>
  createTypedField: any
}

export interface ProviderValue<T, P extends keyof T = keyof T> {
  fields: FormFieldState<T>
  initialValue: T
  unload: (() => void) | Noop
  loaded: boolean
  submitting: boolean
  isBusy: boolean
  formIsDirty: boolean
  forgetState: (() => void) | Noop
  submit: (() => void) | Noop
  submitCount: number
  clearForm: (() => void) | Noop
  validation: FormValidationResult<T>
  registerValidator: RegisterValidator<T> | Noop
  registerField:
    | (<K extends P>(fieldName: K, initialValue: T[K], validators: Validator<T, K>[]) => void)
    | Noop
  onFieldBlur: (<K extends P>(fieldName: K) => void) | Noop
  setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void) | Noop
  touch: (<K extends P>(fieldName: K) => void) | Noop
  untouch: (<K extends P>(fieldName: K) => void) | Noop
}

export interface BaseFormComponentProps<T, P extends keyof T = keyof T> {
  submitCount: number
  clearForm: () => void
  unload: () => void
  forgetState: () => void
  submitting: boolean
  formIsDirty: boolean
  submit: () => void
  touch: (fieldName: P) => void
  untouch: (fieldName: P) => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
}

export type GenericFieldHTMLAttributes =
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.SelectHTMLAttributes<HTMLSelectElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>

export interface BaseInnerFieldProps<T, P extends keyof T = keyof T> {
  name: P
  isDirty: boolean
  initialValue?: T[P]
  onBlur?: (e) => void
  validators?: Validator<T, P>[]
  validation: ValidationResult
  registerValidator: RegisterValidator<T>
  onFieldBlur: <K extends P>(fieldName: K) => void
  render?: (value: FieldProps<T, P>) => React.ReactNode
  registerField: <K extends P>(
    fieldName: K,
    initialValue: T[K],
    validators: Validator<T, K>[]
  ) => void
  component?: React.ComponentType<FieldProps<T, P>> | React.ComponentType<any>
  submitCount: number
  clearForm: () => void
  unload: () => void
  forgetState: () => void
  loaded: boolean
  submitting: boolean
  formIsDirty: boolean
  submit: () => void
  touch: <K extends P>(fieldName: K) => void
  untouch: <K extends P>(fieldName: K) => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
}

export interface FormComponentProps<T> extends BaseFormComponentProps<T> {
  loaded: boolean
  fields: FormFieldState<T>
  render?: (value: FormBaseContextReceiverProps<T>) => React.ReactNode
  component?: React.ComponentType<FormBaseContextReceiverProps<T>> | React.ComponentType<any>
}

export type InnerFieldProps<T, K extends keyof T = keyof T> = BaseInnerFieldProps<T, K> &
  FieldState<T[K]>

// export type Primitive = string | number | boolean
// export type BasicAllowedTypes = Primitive | null | undefined | Date
// export type AllowedTypesOfArray = BasicAllowedTypes[]
// export type AllowedTypes = BasicAllowedTypes | AllowedTypesOfArray | { [K in keyof any]: AllowedTypes }

export interface RegisterValidator<T> {
  <K extends keyof T>(fieldName: K, validators: Validator<T, K>[]): void
}

export interface Noop {
  (): never
}

const noop: Noop = function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

function getDefaultProviderValue<T>(): ProviderValue<T> {
  return {
    fields: {} as FormFieldState<T>,
    loaded: false,
    isBusy: true,
    submitCount: 0,
    submitting: false,
    formIsDirty: false,
    initialValue: {} as T,
    validation: {} as FormValidationResult<T>,
    unload: noop,
    submit: noop,
    clearForm: noop,
    touch: noop,
    untouch: noop,
    forgetState: noop,
    onFieldBlur: noop,
    setFieldValue: noop,
    registerField: noop,
    registerValidator: noop
  } as ProviderValue<T>
}

function getFormContext<T>(): React.Context<ProviderValue<T>> {
  return React.createContext<ProviderValue<T>>(getDefaultProviderValue())
}

export function createForm<T>(initialValue: T) {
  const { Consumer, Provider } = getFormContext<T>()

  const form = wrapProvider<T>(Provider, { initialValue })
  const field = createField<T>(Consumer)
  const component = createFormComponent<T>(Consumer)

  return {
    Form: form,
    Field: field,
    FormComponent: component,
    createField: function<K extends keyof T>(
      fieldName: K,
      component?: React.ComponentType<FieldProps<T, K>>
    ) {
      return getTypedField<T, K>(Consumer, fieldName, component)
    }
  }
}

export default createForm

const formContext = createForm<any>({})
export const Form = formContext.Form
export const Field = formContext.Field
export const FormComponent = formContext.FormComponent
