export type Name = string | number
export type Path = Name[]
export type ValidationType = 'change' | 'blur' | 'submit'
// export type FormFieldState<T> = { [K in keyof T]: FieldState<T[K]> }
// export interface FormFieldState<T = any> {
//   touched: Touched<T>
//   visited: Visited<T>
//   initialValue: T
// }

export type BooleanTree<T> = T extends object ? BooleanLeaf<T> : boolean | undefined
export type BooleanLeaf<T> = { [K in keyof T]?: T[K] extends object ? BooleanLeaf<T[K]> : boolean }

export type FormErrors<T extends object> = {
  [P in keyof T]?: T[P] extends object ? FormErrors<T[P]> & { _errors: string[] } : string[]
}

export type ValidateOn<F extends object, T = any> =
  | ValidationType
  | ValidationType[]
  | ValidateOnCustom<F, T>

/* @internal */
export interface Person {
  name: string
  surname: string
  age: number
  gender: string
  contact: Contact
  contacts: Contact[]
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

export interface FormMeta<T extends object> {
  loaded: boolean
  submitting: boolean
  resetForm: () => void
  submit: () => void
  forgetState: () => void
  clearForm: () => void
  setFormValue: ((value: Partial<T>, overwrite?: boolean) => void)
  setVisited: ((value: BooleanTree<T>, overwrite?: boolean) => void)
  setTouched: ((value: BooleanTree<T>, overwrite?: boolean) => void)
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

export interface AggregateValidator<F extends object> {
  (formState: FormState<F>, ret: FormErrors<F>): string[]
}

export type FieldValidator<F extends object, T> = Validator<F, T> | Validator<F, T>[]

export interface Validator<F extends object, T> {
  (value: T, formValue: F, fieldName: Name): string | undefined
}

export interface ValidateOnCustom<F extends object, T> {
  (field: FieldState<T>, fieldName: Name, state: FormState<F>): boolean
}

export interface RegisteredField {
  path: Path
  type: 'section' | 'field'
}
export interface ValidatorConfig<F extends object> {
  validate: AggregateValidator<F>
  shouldValidate: ShouldValidateFunc<F>
}

export interface ShouldValidateFunc<F extends object> {
  (state: FormState<F>): boolean
}

export interface ValidatorDictionary<F extends object> {
  [key: string]: ValidatorConfig<F>
}

export type RegisteredFields = {
  [key: string]: RegisteredField
}

export interface FormState<F extends object> {
  initialMount: boolean
  touched: BooleanTree<F>
  visited: BooleanTree<F>
  activeField: string | null
  initialFormValue: F
  formValue: F
  registeredFields: RegisteredFields
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  formIsTouched: boolean
  submitCount: number
}

export interface FormProvider<F extends object, T = F> {
  path: Path
  value: T
  defaultValue: T
  initialValue: T
  formValue: F
  defaultFormValue: F
  initialFormValue: F
  initialMount: boolean
  touched: BooleanTree<T> // | boolean | undefined
  visited: BooleanTree<T> // | boolean | undefined
  activeField: string | null
  registeredFields: RegisteredFields
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  submitCount: number
  formIsValid: boolean
  validateOn: ValidateOn<F, T>
  formIsDirty: boolean
  formIsTouched: boolean
  errors: FormErrors<F>
  submit: (() => void)
  resetForm: (() => void)
  clearForm: (() => void)
  forgetState: (() => void)
  setActiveField: ((path: string | null) => void)
  setValue: ((path: Path, value: any, setTouched?: boolean) => void)
  touchField: ((path: Path, touched: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  setFormValue: ((value: Partial<F>, overwrite?: boolean) => void)
  setTouched: ((value: BooleanTree<F>, overwrite?: boolean) => void)
  setVisited: ((value: BooleanTree<F>, overwrite?: boolean) => void)
  unregisterField: ((path: Path) => void)
  registerField: ((path: Path, type: 'section' | 'field', config: ValidatorConfig<F>) => void)
}
