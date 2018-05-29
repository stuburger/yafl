/* @internal */
export interface Noop {
  (): never
}

/* @internal */
export interface Person {
  name: string
  surname: string
  age: number
  gender: string
  contact: Contact
  favorites: string[]
}

/* @internal */
export interface Contact {
  tel: string
}

export type Nullable<T> = { [P in keyof T]: T[P] | null }
export type FormErrors<T = any> = {
  [P in keyof T]: T[P] extends object ? FormErrors<T[P]> : string[]
}

export interface Provider<T = any> extends FormProviderState<T> {
  value: T
  path: Path
  defaultValue: T
  submitCount: number
  formIsValid: boolean
  formIsDirty: boolean
  formIsTouched: boolean
  errors: FormErrors<T>
  onSubmit: (() => void)
  resetForm: (() => void)
  clearForm: (() => void)
  forgetState: (() => void)
  setValue: ((path: Path, value: boolean) => void)
  touchField: ((path: Path, touched: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  renameField: ((prevName: Path, nextName: Path) => void)
  registerField: ((path: Path, validator: AggregateValidator) => void)
  unregisterField: ((path: Path, validator?: AggregateValidator) => void)
}

export interface FieldState<T> {
  value: T
  visited: boolean
  touched: boolean
  originalValue: T
}

export type FormFieldState<T> = { [K in keyof T]: FieldState<T[K]> }

// n.b. ret is mutated
export interface AggregateValidator<T = any> {
  (formValue: T, ret: FormErrors<T>): string[]
}

export interface Validator<T> {
  (value: any, formValue: T, fieldName: Name): string | undefined
}

export interface FieldValidator<T = any> {
  (value: any, formValue: T, fieldName: Name): string[]
}

export type FieldValidatorPair<T = any> = { path: Path; test: AggregateValidator<T> }
export type FieldValidatorList<T = any> = FieldValidatorPair<T>[]
export type Touched<T = any> = { [K in keyof T]: any extends object ? Touched<T[K]> : boolean }
export type Blurred<T = any> = { [K in keyof T]: any extends object ? Blurred<T[K]> : boolean }
export type RegisteredFields<T = any> = {
  [K in keyof T]: any extends object ? RegisteredFields<T[K]> : true
}

export type ActiveField = string | null

export type FormProviderState<T> = {
  initialMount: boolean
  touched: Touched<T>
  blurred: Blurred<T>
  active: ActiveField
  initialFormValue: T
  formValue: T
  registeredFields: RegisteredFields<T>
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  submitCount: number
}

export interface ValidatorConfig<T> {
  validateOn?: ValidateOn<T>
  validators: Validator<T>[]
}

export type ValidationType = 'change' | 'blur' | 'submit'

export interface ValidateOnCustom<T> {
  (field: any, fields: FormFieldState<T>, fieldName: Name): boolean
}

export type ValidateOn<T> = ValidationType | ValidationType[] | ValidateOnCustom<T>

export interface FormProviderConfig<T> extends Partial<ValidatorConfig<T>> {
  initialValue?: T
  defaultValue?: T
  onSubmit?: (formValue: Nullable<T>) => void
  onChange?: (formValue: T) => void
  // validator:
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
}

export interface BaseSectionConfig<T> {
  defaultValue?: any
  children: React.ReactNode | ((value: any) => React.ReactNode)
}
export interface SectionConfig<T> extends BaseSectionConfig<T> {
  name: Name
}

export interface FieldUtils<T = any> {
  resetForm: () => void
  getFormValue: (includeUnregisterdFields?: boolean) => T
  submit: () => void
  setFieldValue: (fieldName: Name, value: any) => void
  setFieldValues: (partialUpdate: Partial<T>) => void
  forgetState: () => void
  clearForm: () => void
  setValue: (value: any) => void
}

export interface InnerFieldState<T> {
  _name: Name
}

export interface InnerFieldProps<T = any> extends Partial<ValidatorConfig<T>> {
  name: Name
  path: Path
  initialValue?: any
  setValue: (path: Path, value: any, validate: (value: any, formValue: T) => string[]) => void
  validators: Validator<T>[]
  render?: (state: FieldProps<T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T>>
  registerField: (path: Path, validate: (value: any, formValue: T) => string[]) => void
  touchField: (path: Path, touched: boolean) => void
  visitField: (path: Path, visited: boolean) => void
  unregisterField: (path: Path) => void
  forwardProps: { [key: string]: any }
  field: FieldState<any>
}

export interface FieldMeta<T = any> {
  visited: boolean
  isDirty: boolean
  touched: boolean
  isActive: boolean
  activeField: ActiveField
  submitCount: number
  loaded: boolean
  submitting: boolean
  isValid: boolean
  messages: string[]
  originalValue: any
  defaultValue: any
}

export interface InputProps<T = any> {
  name: Name
  value: any
  onBlur: (e: React.FocusEvent<any>) => void
  onFocus: (e: React.FocusEvent<any>) => void
  onChange: (e: React.ChangeEvent<any>) => void
}

export interface FieldProps<T = any> {
  input: InputProps<T>
  meta: FieldMeta<T>
  utils: FieldUtils<T>
  [key: string]: any
}

export interface BaseFieldConfig<T = any> extends Partial<ValidatorConfig<T>> {
  validators?: Validator<T>[]
  render?: (state: FieldProps<T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T>>
  [key: string]: any
}

export interface FieldConfig<T = any> extends BaseFieldConfig<T> {
  name: Name
}

export interface ComponentConfig<T> {
  render?: (state: ComponentProps<T>) => React.ReactNode
  component?: React.ComponentType<ComponentProps<T>>
  [key: string]: any
}

export interface FormUtils<T> {
  resetForm: () => void
  getFormValue: (includeUnregisterdFields?: boolean) => T
  submit: () => void
  setFieldValue: (fieldName: Name, value: any) => void
  setFieldValues: (partialUpdate: Partial<T>) => void
  forgetState: () => void
  clearForm: () => void
}

export interface FormMeta<T> {
  initialValue: T
  isDirty: boolean
  touched: boolean
  submitCount: number
  activeField: ActiveField
  loaded: boolean
  submitting: boolean
  isValid: boolean
  errors: { [K in keyof T]: string[] }
}

export interface ComponentProps<T> {
  utils: FormUtils<T>
  state: FormMeta<T>
  [key: string]: any
}

/*******************NEW TYPES **********************************/

export type Name = string | number

export type Path = Name[]

export interface FormProps<T = any> {
  initialValue?: T
  defaultValue?: T
  onSubmit?: (formValue: T) => void
  children: React.ReactNode
  loaded?: boolean
  submitting?: boolean
  allowReinitialize?: boolean
  rememberStateOnReinitialize?: boolean
}

export interface FormState<T = any> {
  initialMount: boolean
  touched: Touched<T>
  blurred: Blurred<T>
  active: string | null
  initialFormValue: T
  value: T
  registeredFields: RegisteredFields<T>
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  formIsDirty: boolean
  formIsValid: boolean
  formIsTouched: boolean
  submitCount: number
}
