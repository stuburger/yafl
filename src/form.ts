import * as React from 'react'
import { wrapProvider } from './wrapProvider'
import { wrapConsumer, wrapFormConsumer, getTypedField, createFormComponent } from './wrapConsumer'
import {
  Noop,
  Provider,
  FormFieldState,
  Validator,
  FieldProps,
  ComponentConfig,
  FieldConfig,
  FormProviderConfig,
  BaseFieldConfig,
  ComponentProps,
  FieldOptions,
  ValidationType,
  ValidateOnCustom,
  ValidateOn
} from './sharedTypes'

export {
  FormProviderConfig,
  ComponentConfig,
  ComponentProps,
  FieldConfig,
  BaseFieldConfig,
  FieldProps,
  FieldOptions,
  ValidationType,
  ValidateOnCustom,
  ValidateOn
}

export type FPC<T> = FormProviderConfig<T>
export type GCC<T, K extends keyof T = keyof T> = ComponentConfig<T, K>
export type GCP<T, K extends keyof T = keyof T> = ComponentProps<T, K>
export type FCC<T, K extends keyof T = keyof T> = FieldConfig<T, K>
export type FC<T, K extends keyof T = keyof T> = BaseFieldConfig<T, K>
export type FP<T, K extends keyof T = keyof T> = FieldProps<T, K>

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
  setFieldValues: ((partialUpdate: Partial<T>) => void) | Noop
  touchField: (<K extends P>(fieldName: K) => void) | Noop
  untouchField: (<K extends P>(fieldName: K) => void) | Noop
  touchFields: ((fieldNames: (keyof T)[]) => void) | Noop
  untouchFields: ((fieldNames: (keyof T)[]) => void) | Noop
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
    touchField: noop,
    untouchField: noop,
    touchFields: noop,
    untouchFields: noop,
    forgetState: noop,
    onFieldBlur: noop,
    setFieldValue: noop,
    setFieldValues: noop,
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
    },
    createFormComponent: function<K extends keyof T>(
      component: React.ComponentType<ComponentProps<T, K>>
    ) {
      return createFormComponent<T>(Consumer, component)
    }
  }
}

export const { Form, Field, FormComponent } = createForm<any>({})
export { required, maxLength, minLength } from './validators'
