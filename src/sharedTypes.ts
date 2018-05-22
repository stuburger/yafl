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
export type FormErrors<T> = { [P in keyof T]: T[P] extends object ? FormErrors<T[P]> : string[] }

export interface Provider<T extends object, P extends keyof T = keyof T>
  extends FormProviderState<T> {
  defaultValue: T
  formIsTouched: boolean
  formIsValid: boolean
  formIsDirty: boolean
  getFormValue: (includeUnregisterdFields?: boolean) => T
  forgetState: (() => void)
  onSubmit: (() => void)
  resetForm: (() => void)
  submitCount: number
  clearForm: (() => void)
  errors: { [K in keyof T]: string[] }
  registerValidators: (<K extends keyof T>(fieldName: K, opts: ValidatorConfig<T, K>) => void)
  registerField: (<K extends P>(fieldName: K, opts: FieldOptions<T, K>) => void)
  renameField: (<K extends P>(prevName: K, nextName: K) => void)
  unregisterField: (<K extends P>(fieldName: K) => void)
  onFieldBlur: (<K extends P>(fieldName: K) => void)
  setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void)
  setFieldValues: (partialUpdate: Partial<T>) => void
  touchField: (<K extends P>(fieldName: K | keyof T) => void)
  untouchField: (<K extends P>(fieldName: K | keyof T) => void)
  setActiveField: (<K extends P>(fieldName: K | keyof T | null) => void)
  touchFields: (fieldNames: (keyof T)[]) => void
  untouchFields: (fieldNames: (keyof T)[]) => void
}

export interface FieldState<T> {
  value: T
  visited: boolean
  touched: boolean
  originalValue: T
}

export type FormFieldState<T extends object> = { [K in keyof T]: FieldState<T[K]> }

export interface Validator<T extends object, K extends keyof T = keyof T> {
  // FieldState is actually not what should be passed into here. it needs to contain isDirty value
  (value: T[K], formValue: T, fieldName: K): string | undefined
}

export type RegisteredFields<T extends object> = { [K in keyof T]?: true }
export type Touched<T extends object> = { [K in keyof T]?: true }
export type Blurred<T extends object> = { [K in keyof T]?: true }
export type ActiveField<T extends object> = keyof T | null

export type FormProviderState<T extends object> = {
  initialMount: boolean
  touched: Touched<T>
  blurred: Blurred<T>
  active: ActiveField<T>
  initialFormValue: T
  formValue: T
  registeredFields: RegisteredFields<T>
  isBusy: boolean
  loaded: boolean
  submitting: boolean
  submitCount: number
}

export interface ValidatorConfig<T extends object, K extends keyof T = keyof T> {
  validateOn?: ValidateOn<T, K>
  validators: Validator<T, K>[]
}

export interface FieldOptions<T extends object, K extends keyof T = keyof T>
  extends ValidatorConfig<T, K> {}

export type ValidationType = 'change' | 'blur' | 'submit'

export interface ValidateOnCustom<T extends object, K extends keyof T> {
  (field: T[K], fields: FormFieldState<T>, fieldName: K): boolean
}

export type ValidateOn<T extends object, K extends keyof T = keyof T> =
  | ValidationType
  | ValidationType[]
  | ValidateOnCustom<T, K>

export interface FormProviderConfig<T extends object> extends Partial<ValidatorConfig<T>> {
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

export interface BaseSectionConfig<T extends object, K extends keyof T> {
  children: React.ReactNode
}
export interface SectionConfig<T extends object, K extends keyof T>
  extends BaseSectionConfig<T, K> {
  name: K
}

export interface FieldUtils<T extends object, P extends keyof T> {
  resetForm: () => void
  getFormValue: (includeUnregisterdFields?: boolean) => T
  submit: () => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
  setFieldValues: (partialUpdate: Partial<T>) => void
  forgetState: () => void
  clearForm: () => void
  touch: <K extends keyof T>(fieldNames?: K | (keyof T)[]) => void
  untouch: <K extends keyof T>(fieldNames?: K | (keyof T)[]) => void
  setValue: (value: T[P]) => void
}

export interface FieldMapUtils<T extends object, P extends keyof T> {
  resetForm: () => void
  getFormValue: (includeUnregisterdFields?: boolean) => T
  submit: () => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
  setFieldValues: (partialUpdate: Partial<T>) => void
  forgetState: () => void
  clearForm: () => void
  touch: <K extends keyof T>(fieldNames?: K | (keyof T)[]) => void
  untouch: <K extends keyof T>(fieldNames?: K | (keyof T)[]) => void
  setValue: (value: T[P], _i: number) => void
}

export interface InnerFieldState<T extends object, K extends keyof T = keyof T> {
  _name: K
}

export interface InnerFieldProps<T extends object, K extends keyof T = keyof T>
  extends Partial<FieldOptions<T, K>> {
  name: K
  initialValue?: T[K]
  validators: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>>
  provider: Provider<T, K>
  forwardProps: { [key: string]: any }
  field: FieldState<T[K]>
}

export interface FieldMeta<T extends object, K extends keyof T = keyof T> {
  visited: boolean
  isDirty: boolean
  touched: boolean
  isActive: boolean
  activeField: ActiveField<T>
  submitCount: number
  loaded: boolean
  submitting: boolean
  isValid: boolean
  messages: string[]
  originalValue: T[K]
  defaultValue: T[K]
}

export interface InputProps<T extends object, K extends keyof T> {
  name: K
  value: T[K]
  onBlur: (e: React.FocusEvent<any>) => void
  onFocus: (e: React.FocusEvent<any>) => void
  onChange: (e: React.ChangeEvent<any>) => void
}

export interface FieldProps<T extends object, K extends keyof T> {
  input: InputProps<T, K>
  meta: FieldMeta<T, K>
  utils: FieldUtils<T, K>
  [key: string]: any
}

export interface FieldMapProps<T extends object, K extends keyof T> {
  input: InputProps<T, K>
  meta: FieldMeta<T, K>
  utils: FieldMapUtils<T, K>
  [key: string]: any
}

export interface BaseFieldConfig<T extends object, K extends keyof T>
  extends Partial<FieldOptions<T, K>> {
  defaultValue?: T[K]
  initialValue?: T[K]
  validators?: Validator<T, K>[]
  render?: (state: FieldProps<T, K>) => React.ReactNode
  component?: React.ComponentType<FieldProps<T, K>>
  [key: string]: any
}

export interface FieldConfig<T extends object, K extends keyof T = keyof T>
  extends BaseFieldConfig<T, K> {
  name: K
}

export interface ComponentConfig<T extends object, K extends keyof T = keyof T> {
  render?: (state: ComponentProps<T, K>) => React.ReactNode
  component?: React.ComponentType<ComponentProps<T, K>>
  [key: string]: any
}

export interface FormUtils<T extends object, P extends keyof T> {
  touch: (<K extends P>(fieldName: K | (keyof T)[]) => void)
  untouch: (<K extends P>(fieldName: K | (keyof T)[]) => void)
  resetForm: () => void
  getFormValue: (includeUnregisterdFields?: boolean) => T
  submit: () => void
  setFieldValue: <K extends P>(fieldName: K, value: T[K]) => void
  setFieldValues: (partialUpdate: Partial<T>) => void
  forgetState: () => void
  clearForm: () => void
}

export interface FormMeta<T extends object> {
  initialValue: T
  isDirty: boolean
  touched: boolean
  submitCount: number
  activeField: ActiveField<T>
  loaded: boolean
  submitting: boolean
  isValid: boolean
  errors: { [K in keyof T]: string[] }
}

export interface ComponentProps<T extends object, K extends keyof T = keyof T> {
  utils: FormUtils<T, K>
  state: FormMeta<T>
  [key: string]: any
}
