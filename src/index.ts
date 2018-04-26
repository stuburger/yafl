import * as React from 'react'
import wrapProvider from './form/createFormProvider'
import createField, { getTypedField } from './form/createField'
import createFormComponent from './form/createFormComponent'

export interface ProviderValue<T, P extends keyof T = keyof T> {
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

export interface ProviderValueLoaded<T, P extends keyof T = keyof T> extends ProviderValue<T, P> {
  unload: (() => void)
  getFormValue: () => T
  forgetState: (() => void)
  submit: (() => void)
  resetForm: (() => void)
  submitCount: number
  clearForm: (() => void)
  validation: FormValidationResult<T>
  registerValidator: RegisterValidator<T>
  registerField: (<K extends P>(
    fieldName: K,
    initialValue: T[K],
    validators: Validator<T, K>[]
  ) => void)
  onFieldBlur: (<K extends P>(fieldName: K) => void)
  setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void)
  touch: (<K extends P>(fieldName: K) => void)
  untouch: (<K extends P>(fieldName: K) => void)
}

export type GenericFieldHTMLAttributes =
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.SelectHTMLAttributes<HTMLSelectElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>

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

/// ***
export interface FormComponentProps<T, K extends keyof T = keyof T> extends UnrecognizedProps {
  render?: (state: GeneralComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<GeneralComponentProps<T, K>> | React.ComponentType<any>
}

export interface FormFieldProps<T, K extends keyof T = keyof T> extends UnrecognizedProps {
  name: K
  initialValue?: T[K]
  validators?: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>> | React.ComponentType<any>
}

export interface TypedFormFieldProps<T, K extends keyof T> {
  initialValue?: T[K]
  validators?: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>> | React.ComponentType<any>
  [key: string]: any
}

export interface FieldValidationResult {
  isValid: boolean
  messages: string[]
}

export type FormValidationResult<T> = { [K in keyof T]: string[] }

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

export interface FieldUtils<T, P extends keyof T> extends FormUtils<T, P> {
  touch: () => void
  untouch: () => void
  setValue: (value: T[P]) => void
}

export interface FormMeta<T> {
  initialValue: T
  isDirty: boolean
  touched: boolean
  submitCount: number
  loaded: boolean
  submitting: boolean
  isValid: boolean
  validation: FormValidationResult<T>
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

export interface UnrecognizedProps {
  // children?: React.ReactNode
  [key: string]: any
}

export interface BaseRequiredInnerComponentProps<T, K extends keyof T> {
  render?: (state: GeneralComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<GeneralComponentProps<T, K>> | React.ComponentType<any>
}

export interface ComputedFormState<T> {
  formIsDirty: boolean
  formIsTouched: boolean
  formIsValid: boolean
  validation: FormValidationResult<T>
}

export interface GeneralComponentProps<T, K extends keyof T = keyof T> extends UnrecognizedProps {
  utils: FormUtils<T, K>
  state: FormMeta<T>
}

export interface FieldProps<T, K extends keyof T> extends UnrecognizedProps {
  input: InputProps<T, K>
  meta: FieldMeta<T, K>
  utils: FieldUtils<T, K>
  [key: string]: any
}

export interface RecognizedFieldProps<T, K extends keyof T> {
  name: K
  initialValue?: T[K]
  validators: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>> | React.ComponentType<any>
}

export interface InnerGeneralComponentProps<T, K extends keyof T = keyof T> {
  provider: ProviderValueLoaded<T, K>
  forwardProps: UnrecognizedProps
  render?: (state: GeneralComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<GeneralComponentProps<T, K>> | React.ComponentType<any>
}

export interface InnerFieldProps<T, K extends keyof T = keyof T>
  extends RecognizedFieldProps<T, K> {
  provider: ProviderValueLoaded<T, K>
  forwardProps: UnrecognizedProps
  field: FieldState<T[K]>
}

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
    formIsTouched: false,
    formIsValid: true,
    submitCount: 0,
    submitting: false,
    formIsDirty: false,
    initialValue: {} as T,
    validation: {} as FormValidationResult<T>,
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

function getFormContext<T>(): React.Context<ProviderValueLoaded<T>> {
  return React.createContext<ProviderValueLoaded<T>>(getDefaultProviderValue())
}

export function createForm<T>(initialValue: T) {
  const { Consumer, Provider } = getFormContext<T>()

  const form = wrapProvider<T>(Provider, initialValue)
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
export { required, maxLength, minLength } from './validators'

// export interface ReactContextForm<T> {
//   Form: React.ComponentClass<FormProviderProps<T>>
//   Field: React.ComponentClass<FormFieldProps<T>>
//   FormComponent: React.ComponentClass<GeneralComponentProps<T>>
//   createTypedField: any
// }
