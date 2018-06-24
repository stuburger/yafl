export type Name = string | number
export type Path = Name[]
export type ValidationType = 'change' | 'blur' | 'submit'

export type BooleanTree<T> =
  | { [K in keyof T]?: T[K] extends object ? BooleanTree<T[K]> : boolean }
  | undefined
  | boolean

export type FormErrors<T extends object> = {
  [P in keyof T]?: T[P] extends object ? FormErrors<T[P]> & { _errors: string[] } : string[]
}

export type ValidateOn<F extends object, T = any> =
  | ValidationType
  | ValidationType[]
  | ValidateOnCustom<F, T>

export type SectionValidateOn<F extends object, T = any> = 'submit' | SectionValidateOnCustom<F, T>

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
  initialValue: T
}

export interface SectionState<T> {
  name: Name
  value: T
  visited: BooleanTree<T>
  touched: BooleanTree<T>
  initialValue: T
}

export interface AggregateValidator<F extends object> {
  (formState: FormState<F>, ret: FormErrors<F>): string[]
}

export type FieldValidator<F extends object, T> = Validator<F, T> | Validator<F, T>[]

export interface Validator<F extends object, T> {
  (value: T, fieldName: Name, formValue: F): string | undefined
}

export interface ValidateOnCustom<F extends object, T> {
  (field: FieldState<T>, formState: FormState<F>): boolean
}

export interface SectionValidateOnCustom<F extends object, T> {
  (field: SectionState<T>, formState: FormState<F>): boolean
}

export interface FormValidateOnCustom<F extends object> {
  (formState: FormState<F>): boolean
}

export interface RegisteredField {
  path: Path
  type: 'section' | 'field'
}
export interface ShouldValidateFunc<F extends object> {
  (state: FormState<F>): boolean
}

export type RegisteredFields = {
  [key: string]: RegisteredField
}

export type ComponentTypes<F extends object> = {
  [key: string]: React.ComponentType<FieldProps<F, any>> | React.ComponentType<GizmoProps<F>>
}

export interface InputProps<T = any> {
  name: Name
  value: any
  onBlur: (e: React.FocusEvent<any>) => void
  onFocus: (e: React.FocusEvent<any>) => void
  onChange: (e: React.ChangeEvent<any>) => void
}

export interface FieldConfig<F extends object, T = any> {
  name: Name
  validate?: FieldValidator<F, T>
  type?: string
  validateOn?: ValidateOn<F, T>
  render?: (state: FieldProps<F, T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<F, T>>
  [key: string]: any
}
export interface FieldProps<F extends object, T = any> {
  input: InputProps<T>
  field: FieldMeta<T>
  form: FormMeta<F>
  [key: string]: any
}

export interface FieldMeta<T = any> {
  path: Path
  visited: boolean
  isDirty: boolean
  touched: boolean
  isActive: boolean
  isValid: boolean
  errors: string[]
  initialValue: any
  defaultValue: any
  setValue: (value: any) => void
  setVisited: (value: boolean) => void
  setTouched: (value: boolean) => void
}

export interface InnerFieldProps<F extends object, T> extends FormProvider<F, T> {
  name: Name
  formValue: F
  value: T
  initialValue: T
  type: string
  validate?: FieldValidator<F, T>
  validateOn: ValidateOn<F, T>
  render?: (state: FieldProps<F, T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<F, T>>
  forwardProps: { [key: string]: any }
}

export interface FormState<F extends object> {
  errors: FormErrors<F>
  initialMount: boolean
  touched: BooleanTree<F>
  visited: BooleanTree<F>
  activeField: string | null
  initialValue: F | null
  defaultValue: F
  formValue: F
  registeredFields: RegisteredFields
  submitCount: number
}

export interface CommonFieldProps<F extends object> {
  validateOn: ValidateOn<F, any>
  [key: string]: any
}

export interface FormProvider<F extends object, T = F> {
  path: Path
  value: T
  defaultValue: T
  initialValue: T
  formValue: F
  initialMount: boolean
  touched: BooleanTree<T>
  visited: BooleanTree<T>
  activeField: string | null
  registeredFields: RegisteredFields
  componentTypes: ComponentTypes<F>
  submitCount: number
  formIsValid: boolean
  formIsDirty: boolean
  formIsTouched: boolean
  allErrors: FormErrors<F>
  formErrors: FormErrors<F>
  fieldErrors: FormErrors<F>
  submit: (() => void)
  resetForm: (() => void)
  clearForm: (() => void)
  forgetState: (() => void)
  unwrapFormState: (() => FormState<F>)
  commonFieldProps: CommonFieldProps<F>
  setActiveField: ((path: string | null) => void)
  touchField: ((path: Path, touched: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  setErrors: ((path: Path, errors: string[] | undefined) => void)
  setFormValue: ((value: Partial<F>, overwrite?: boolean) => void)
  setValue: ((path: Path, value: any, setTouched?: boolean) => void)
  setTouched: ((value: BooleanTree<F>, overwrite?: boolean) => void)
  setVisited: ((value: BooleanTree<F>, overwrite?: boolean) => void)
  unregisterField: ((path: Path) => void)
  registerField: ((path: Path, type: 'section' | 'field') => void)
}

export interface GizmoProps<F extends object> extends FormMeta<F> {
  formValue: F
  defaultValue: F
  initialValue: F
  formIsTouched: boolean
  formIsValid: boolean
  formIsDirty: boolean
  submitCount: number
  activeField: string | null
  visited: BooleanTree<F>
  touched: BooleanTree<F>
  errors: FormErrors<F>
  [key: string]: any
}

export interface GizmoConfig<F extends object> {
  render?: (props: GizmoProps<F>) => React.ReactNode
  component?: React.ComponentType<GizmoProps<F>>
  [key: string]: any
}

export interface GeneralComponentConfig<F extends object> extends GizmoConfig<F> {
  type: string
  formValue: F
  defaultValue: F
  initialValue: F
  initialMount: boolean
  touched: BooleanTree<F>
  visited: BooleanTree<F>
  activeField: string | null
  submitCount: number
  formIsValid: boolean
  formIsDirty: boolean
  formIsTouched: boolean
  errors: FormErrors<F>
  submit: (() => void)
  resetForm: (() => void)
  clearForm: (() => void)
  forgetState: (() => void)
  componentTypes: ComponentTypes<F>
  setActiveField: ((path: string | null) => void)
  setValue: ((path: Path, value: any, setTouched?: boolean) => void)
  touchField: ((path: Path, touched: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  setFormValue: ((value: Partial<F>, overwrite?: boolean) => void)
  setTouched: ((value: BooleanTree<F>, overwrite?: boolean) => void)
  setVisited: ((value: BooleanTree<F>, overwrite?: boolean) => void)
  forwardProps: { [key: string]: any }
}
