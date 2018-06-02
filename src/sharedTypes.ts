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

export interface Provider<T = any> extends FormState<T> {
  value: any
  path: Path
  defaultFormValue: T
  defaultValue: any
  initialValue: any
  submitCount: number
  formIsValid: boolean
  formIsDirty: boolean
  formIsTouched: boolean
  errors: FormErrors<T>
  onSubmit: (() => void)
  resetForm: (() => void)
  clearForm: (() => void)
  forgetState: (() => void)
  setActiveField: ((path: Path) => void)
  setValue: ((path: Path, value: boolean) => void)
  touchField: ((path: Path, touched: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  renameField: ((prevName: Path, nextName: Path) => void)
  setFormValue: ((value: Partial<T>, overwrite: boolean) => void)
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
export type Visited<T = any> = { [K in keyof T]: any extends object ? Visited<T[K]> : boolean }
export type RegisteredFields<T = any> = {
  [K in keyof T]: any extends object ? RegisteredFields<T[K]> : true
}

export type ActiveField = Path

export interface ValidatorConfig<T> {
  validateOn?: ValidateOn<T>
  validators: Validator<T>[]
}

export type ValidationType = 'change' | 'blur' | 'submit'

export interface ValidateOnCustom<T> {
  (field: any, fields: FormFieldState<T>, fieldName: Name): boolean
}

export type ValidateOn<T> = ValidationType | ValidationType[] | ValidateOnCustom<T>

export interface SectionConfig<T = any> {
  name: Name
  defaultValue?: any
  children: React.ReactNode | ((value: any) => React.ReactNode)
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

export type Name = string | number

export type Path = Name[]

export interface FormState<T = any> {
  initialMount: boolean
  touched: Touched<T>
  visited: Visited<T>
  active: Path
  initialFormValue: T
  formValue: T
  registeredFields: RegisteredFields<T>
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  formIsTouched: boolean
  submitCount: number
}
