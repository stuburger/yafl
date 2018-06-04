export type Name = string | number
export type Path = Name[]
export type ValidationType = 'change' | 'blur' | 'submit'
export type FormFieldState<T> = { [K in keyof T]: FieldState<T[K]> }
export type FieldValidatorPair<T = any> = {
  path: Path
  test: AggregateValidator<T>
  type: 'section' | 'field'
}
export type FieldValidatorList<T = any> = FieldValidatorPair<T>[]
export type Touched<T = any> = { [K in keyof T]: any extends object ? Touched<T[K]> : boolean }
export type Visited<T = any> = { [K in keyof T]: any extends object ? Visited<T[K]> : boolean }
export type ValidateOn<T> = ValidationType | ValidationType[] | ValidateOnCustom<T>
export type FormErrors<T = any> = {
  [P in keyof T]: T[P] extends object ? FormErrors<T[P]> : string[]
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

export interface FormMeta<T = any> {
  formValue: T
  defaultValue: T
  initialValue: T
  submitCount: number
  loaded: boolean
  submitting: boolean
  activeField: Path
  isTouched: boolean
  isDirty: boolean
  isValid: boolean
  visited: Visited<T>
  touched: Touched<T>
  errors: FormErrors<T>
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
  value: T
  visited: boolean
  touched: boolean
  originalValue: T
}

export interface AggregateValidator<T = any> {
  (formValue: T, ret: FormErrors<T>): string[]
}

export interface Validator<T> {
  (value: any, formValue: T, fieldName: Name): string | undefined
}

export interface FieldValidator<T = any> {
  (value: any, formValue: T, fieldName: Name): string[]
}

export interface ValidatorConfig<T> {
  validateOn?: ValidateOn<T>
  validators: Validator<T>[]
}

export interface ValidateOnCustom<T> {
  (field: any, fields: FormFieldState<T>, fieldName: Name): boolean
}

export interface FormState<T = any> {
  initialMount: boolean
  touched: Touched<T>
  visited: Visited<T>
  activeField: Path
  initialFormValue: T
  formValue: T
  registeredFields: Path[]
  registeredSections: Path[]
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  formIsTouched: boolean
  submitCount: number
  errors: FormErrors<T>
}

export interface FormProvider<T = any> extends FormState<T> {
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
  errorState: FormErrors<T>
  sectionErrors: FormErrors<T>
  touchedState: Touched<T>
  visitedState: Visited<T>
  onSubmit: (() => void)
  resetForm: (() => void)
  clearForm: (() => void)
  forgetState: (() => void)
  setActiveField: ((path: Path) => void)
  setValue: ((path: Path, value: any, setTouched?: boolean) => void)
  touchField: ((path: Path, touched: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  renameField: ((prevName: Path, nextName: Path) => void)
  setFormValue: ((value: Partial<T>, overwrite: boolean) => void)
  setTouched: ((value: Touched<T>, overwrite: boolean) => void)
  setVisited: ((value: Visited<T>, overwrite: boolean) => void)
  registerField: ((path: Path, type: 'section' | 'field') => void)
  unregisterField: ((path: Path) => void)
}
