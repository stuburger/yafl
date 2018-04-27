export type Nullable<T> = { [P in keyof T]: T[P] | null }

export type FormFieldState<T> = { [K in keyof T]: FieldState<T[K]> }

export interface FieldState<T> {
  value: T
  didBlur: boolean
  touched: boolean
  originalValue: T
}

export interface FormProviderProps<T> {
  initialValue?: T
  submit?: (formValue: Nullable<T>) => void
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
}

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

export interface UnrecognizedProps {
  // children?: React.ReactNode
  [key: string]: any
}

export interface BaseRequiredInnerComponentProps<T, K extends keyof T> {
  render?: (state: GeneralComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<GeneralComponentProps<T, K>> | React.ComponentType<any>
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

export interface Validator<T, K extends keyof T = keyof T> {
  // FieldState is actually not what should be passed into here. it needs to contain isDirty value
  (value: FieldState<T[K]>, fields: FormFieldState<T>, fieldName: K): string | undefined
}

export type GenericFieldHTMLAttributes =
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.SelectHTMLAttributes<HTMLSelectElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
