import * as exp from './export'

export interface ProviderValue<T, P extends keyof T = keyof T> {
  fields: exp.FormFieldState<T>
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
  validation: exp.FormValidationResult<T>
  registerValidator: RegisterValidator<T> | Noop
  registerField:
    | (<K extends P>(fieldName: K, initialValue: T[K], validators: exp.Validator<T, K>[]) => void)
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
  validation: exp.FormValidationResult<T>
  registerValidator: RegisterValidator<T>
  registerField: (<K extends P>(
    fieldName: K,
    initialValue: T[K],
    validators: exp.Validator<T, K>[]
  ) => void)
  onFieldBlur: (<K extends P>(fieldName: K) => void)
  setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void)
  touch: (<K extends P>(fieldName: K) => void)
  untouch: (<K extends P>(fieldName: K) => void)
}

export interface FormProviderState<T> {
  fields: exp.FormFieldState<T>
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

export type ValidatorSet<T> = { [P in keyof T]: exp.Validator<T, P>[] }

/// ***

export interface ComputedFormState<T> {
  formIsDirty: boolean
  formIsTouched: boolean
  formIsValid: boolean
  validation: exp.FormValidationResult<T>
}

export interface InnerGeneralComponentProps<T, K extends keyof T = keyof T> {
  provider: ProviderValueLoaded<T, K>
  forwardProps: exp.UnrecognizedProps
  render?: (state: exp.GeneralComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<exp.GeneralComponentProps<T, K>> | React.ComponentType<any>
}

export interface InnerFieldProps<T, K extends keyof T = keyof T>
  extends exp.RecognizedFieldProps<T, K> {
  provider: ProviderValueLoaded<T, K>
  forwardProps: exp.UnrecognizedProps
  field: exp.FieldState<T[K]>
}

export interface RegisterValidator<T> {
  <K extends keyof T>(fieldName: K, validators: exp.Validator<T, K>[]): void
}

export interface Noop {
  (): never
}
