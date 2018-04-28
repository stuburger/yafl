import * as React from 'react'
import { wrapProvider, Provider } from './wrapProvider'
import { wrapConsumer, wrapFormConsumer, getTypedField } from './wrapConsumer'
import { Noop, Nullable, FormFieldState, FieldState } from './sharedTypes'

export interface FormProviderConfig<T> {
  initialValue?: T
  submit?: (formValue: Nullable<T>) => void
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
}

export interface FieldUtils<T, P extends keyof T> {
  resetForm: () => void
  getFormValue: () => T
  unload: () => void
  submit: () => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
  forgetState: () => void
  clearForm: () => void
  touch: () => void
  untouch: () => void
  setValue: (value: T[P]) => void
}

export interface InnerFieldProps<T, K extends keyof T = keyof T> {
  name: K
  initialValue?: T[K]
  validators: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>>
  provider: Provider<T, K>
  forwardProps: { [key: string]: any }
  field: FieldState<T[K]>
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
  onBlur: (e: any) => void
  onChange: (e: any) => void
}

export interface FieldProps<T, K extends keyof T> {
  input: InputProps<T, K>
  meta: FieldMeta<T, K>
  utils: FieldUtils<T, K>
  [key: string]: any
}

export interface BaseFieldConfig<T, K extends keyof T> {
  initialValue?: T[K]
  validators?: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>>
  [key: string]: any
}

export interface FieldConfig<T, K extends keyof T = keyof T> extends BaseFieldConfig<T, K> {
  name: K
}

export type FormProviderState<T> = {
  fields: FormFieldState<T>
  initialValue: T
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  submitCount: number
}

/* @internal */
interface DefaultProviderValue<T, P extends keyof T = keyof T> {
  fields: FormFieldState<T>
  getFormValue: (() => T) | Noop
  initialValue: T
  unload: (() => void) | Noop
  resetForm: (() => void) | Noop
  loaded: boolean
  submitting: boolean
  isBusy: boolean
  formIsTouched: boolean
  formIsValid: boolean
  formIsDirty: boolean
  forgetState: (() => void) | Noop
  submit: (() => void) | Noop
  submitCount: number
  clearForm: (() => void) | Noop
  validation: { [K in keyof T]: string[] }
  registerValidator:
    | (<K extends keyof T>(fieldName: K, validators: Validator<T, K>[]) => void)
    | Noop
  registerField:
    | (<K extends P>(fieldName: K, initialValue: T[K], validators: Validator<T, K>[]) => void)
    | Noop
  onFieldBlur: (<K extends P>(fieldName: K) => void) | Noop
  setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void) | Noop
  touch: (<K extends P>(fieldName: K) => void) | Noop
  untouch: (<K extends P>(fieldName: K) => void) | Noop
}

export interface Validator<T, K extends keyof T = keyof T> {
  // FieldState is actually not what should be passed into here. it needs to contain isDirty value
  (value: FieldState<T[K]>, fields: FormFieldState<T>, fieldName: K): string | undefined
}

export interface ComponentConfig<T, K extends keyof T = keyof T> {
  render?: (state: ComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<ComponentProps<T, K>>
  [key: string]: any
}

export interface FormUtils<T, P extends keyof T> {
  touch: <K extends P>(fieldName: K) => void
  untouch: <K extends P>(fieldName: K) => void
  resetForm: () => void
  getFormValue: () => T
  unload: () => void
  submit: () => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
  forgetState: () => void
  clearForm: () => void
}

export interface FormMeta<T> {
  initialValue: T
  isDirty: boolean
  touched: boolean
  submitCount: number
  loaded: boolean
  submitting: boolean
  isValid: boolean
  validation: { [K in keyof T]: string[] }
}

export interface ComponentProps<T, K extends keyof T = keyof T> {
  utils: FormUtils<T, K>
  state: FormMeta<T>
  [key: string]: any
}

function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

function getDefaultProviderValue<T>(): DefaultProviderValue<T> {
  return {
    fields: {} as FormFieldState<T>,
    loaded: false,
    isBusy: true,
    formIsTouched: false,
    formIsValid: true,
    submitCount: 0,
    submitting: false,
    formIsDirty: false,
    initialValue: {} as T,
    validation: {} as { [K in keyof T]: string[] },
    getFormValue: noop,
    unload: noop,
    submit: noop,
    resetForm: noop,
    clearForm: noop,
    touch: noop,
    untouch: noop,
    forgetState: noop,
    onFieldBlur: noop,
    setFieldValue: noop,
    registerField: noop,
    registerValidator: noop
  }
}

export const createForm = <T>(initialValue: T) => {
  const { Consumer, Provider } = React.createContext<Provider<T>>(getDefaultProviderValue())

  const form = wrapProvider<T>(Provider, initialValue)
  const field = wrapConsumer<T>(Consumer)
  const component = wrapFormConsumer<T>(Consumer)

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

export const { Form, Field, FormComponent } = createForm<any>({})
export { required, maxLength, minLength } from './validators'
