export type Name = string | number
export type Path = Name[]
export type ValidationType = 'change' | 'blur' | 'submit'
// export type FormFieldState<T> = { [K in keyof T]: FieldState<T[K]> }
export interface FormFieldState<T = any> {
  touched: Touched<T>
  visited: Visited<T>
  initialValue: T
}
export type FieldValidatorPair<T = any> = {
  path: Path
  test: AggregateValidator<T>
  type: 'section' | 'field'
}

export type FieldValidatorList<T = any> = FieldValidatorPair<T>[]
export type Touched<T = any> = { [K in keyof T]: T[K] extends object ? Touched<T[K]> : boolean }
export type Visited<T = any> = { [K in keyof T]: T[K] extends object ? Visited<T[K]> : boolean }
export type ValidateOn<T> = ValidationType | ValidationType[] | ValidateOnCustom<T>
export type FormErrors<T = any> = {
  [P in keyof T]: T[P] extends object ? FormErrors<T[P]> & { _errors: string[] } : string[]
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
  address: Address
}

/* @internal */
export interface Address {
  code: string
  street: string
}

export interface FormMeta<T = any> {
  loaded: boolean
  submitting: boolean
  resetForm: () => void
  submit: () => void
  forgetState: () => void
  clearForm: () => void
  setFormValue: ((value: Partial<T>, overwrite: boolean) => void)
  setVisited: ((value: Visited<T>, overwrite: boolean) => void)
  setTouched: ((value: Touched<T>, overwrite: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  touchField: ((path: Path, visited: boolean) => void)
}

export interface FieldState<T> {
  name: Name
  value: T
  visited: boolean
  touched: boolean
  originalValue: T
}

export interface AggregateValidator<T = any> {
  (formState: FormState<T>, ret: FormErrors<T>): string[]
}

export type FieldValidator<T = any> = Validator<T> | Validator<T>[]

export interface Validator<T = any> {
  (value: any, formValue: T, fieldName: Name): string | undefined
}

export interface ValidateOnCustom<T> {
  (field: FieldState<T>, fieldName: Name, fields?: FormFieldState<T>): boolean
}

export interface RegisteredField<T = any> {
  path: Path
  type: 'section' | 'field'
}
export interface ValidatorConfig<T = any> {
  validate: AggregateValidator<T>
  shouldValidate: ShouldValidateFunc<T>
}

export interface ShouldValidateFunc<T = any> {
  (state: FormState<T>): boolean
}

export interface ValidatorDictionary<T = any> {
  [key: string]: ValidatorConfig<T>
}

export type RegisteredFields<T = any> = {
  [key: string]: RegisteredField<T>
}

export interface FormState<T = any> {
  initialMount: boolean
  touched: Touched<T>
  visited: Visited<T>
  activeField: string | null
  initialFormValue: T
  formValue: T
  registeredFields: RegisteredFields<T>
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  formIsTouched: boolean
  submitCount: number
}

export interface FormProvider<T = any> extends FormState<T> {
  value: any
  path: Path
  defaultFormValue: T
  defaultValue: any
  initialValue: any
  formIsValid: boolean
  formIsDirty: boolean
  formIsTouched: boolean
  errors: FormErrors<T>
  onSubmit: (() => void)
  resetForm: (() => void)
  clearForm: (() => void)
  forgetState: (() => void)
  validateOn: ValidateOn<T>
  setActiveField: ((path: string | null) => void)
  setValue: ((path: Path, value: any, setTouched?: boolean) => void)
  touchField: ((path: Path, touched: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  renameField: ((prevName: Path, nextName: Path) => void)
  setFormValue: ((value: Partial<T>, overwrite: boolean) => void)
  setTouched: ((value: Touched<T>, overwrite: boolean) => void)
  setVisited: ((value: Visited<T>, overwrite: boolean) => void)
  unregisterField: ((path: Path) => void)
  registerField: ((path: Path, type: 'section' | 'field', config: ValidatorConfig<T>) => void)
}
