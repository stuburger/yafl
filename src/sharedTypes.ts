export type Name = string | number
export type Path = Name[]

export type BooleanTree<T> =
  | { [K in keyof T]?: T[K] extends object ? BooleanTree<T[K]> : boolean }
  | undefined
  | boolean

export type FormErrors<T extends object> = {
  [P in keyof T]?: T[P] extends object ? FormErrors<T[P]> : string[]
}

export interface FormMeta<T extends object> {
  /**
   * The current value of the form.
   */
  value: T
  /**
   * The number of times the form has been submitted.
   */
  submitCount: number
  /**
   * Clears all form state. Form value is reset to its initialValue.
   */
  resetForm: () => void
  /**
   * Calls the onSubmit function supplied to the Form component
   */
  submit: () => void
  /**
   * Resets submitCount, touched and visited. The form value is not reset.
   */
  forgetState: () => void
  /**
   * Clears all form state. Form value is reset to its defaultValue.
   */
  clearForm: () => void
  /**
   * Sets the form value imperatively.
   * @param set A function that accepts the previous form value and returns the next form value.
   */
  setFormValue: (setValue: SetFormValueFunc<T>) => void
  /**
   * Sets the form's visited state imperatively.
   * @param set A function that accepts the previous visited state and returns the next visited state.
   */
  setVisited: (set: SetFormVisitedFunc<T>) => void
  /**
   * Sets the form's touched state imperatively.
   * @param set A function that accepts the previous touched state and returns the next touched state.
   */
  setTouched: (set: SetFormTouchedFunc<T>) => void
  /**
   * Sets a Field's visited state imperatively.
   * @param path The string or array path of the Field to visit or unvisit.
   * @param value A boolean value to which this Field's visited state should be set.
   */
  visitField: (path: Path, visited: boolean) => void
  /**
   * Sets a Field's touched state imperatively.
   * @param path The string or array path of the Field to touch or untouch
   * @param value A boolean value to which this Field's touched state should be set.
   */
  touchField: ((path: Path, touched: boolean) => void)
}

export interface SetFormValueFunc<T extends object> {
  (previousValue: T): T
}

export interface SetFormVisitedFunc<T extends object> {
  (previousVisited: BooleanTree<T>): BooleanTree<T>
}

export interface SetFormTouchedFunc<T extends object> {
  (previousTouched: BooleanTree<T>): BooleanTree<T>
}

export interface RegisteredField {
  path: Path
  type: 'section' | 'field'
}

export type RegisteredFields = {
  [key: string]: RegisteredField
}

export type ComponentTypes<F extends object> = {
  [key: string]: React.ComponentType<FieldProps<F, any>> | React.ComponentType<GizmoProps<F>>
}

export interface InputProps<T = any> {
  /**
   * The name of this Field.
   */
  name: Name
  /**
   * The value of this Field.
   */
  value: T
  onBlur: (e: React.FocusEvent<any>) => void
  onFocus: (e: React.FocusEvent<any>) => void
  onChange: (e: React.ChangeEvent<any>) => void
}

export interface FieldConfig<F extends object, T = any> {
  name: Name
  type?: string
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
  /**
   * Indicates whether this Field has been visited. Automatically set to true on when field.onBlur() is called.
   */
  visited: boolean
  /**
   * Indicates whether the initialValue for this Field is different from its current value.
   */
  isDirty: boolean
  /**
   * Indicates whether this Field has been touched. Automatically set to true the first time a Field's value is changed.
   */
  touched: boolean
  /**
   * Indicates whether this Field is currently in Focus.
   */
  isActive: boolean
  /**
   * Indicates whether this Field is valid based on whether there are any Faults rendered that match the path of this Field.
   */
  isValid: boolean
  /**
   * An array containing any errors for this Field based on whether there are any Faults rendered that match the path of this Field.
   */
  errors: string[]
  /**
   * The value this Field was initialized with.
   */
  initialValue: T
  /**
   * The default value that this Field was initialized with.
   */
  defaultValue: T
  /**
   * Sets the value for this Field.
   * @param value The value to set.
   * @param touch Optionally specify if this Field should be touched when this function is called. Default is true.
   */
  setValue: (value: T, touch?: boolean) => void
  /**
   * Sets the visited state for this Field.
   * @param value The boolean value to which this Field's visited state should be set.
   */
  setVisited: (value: boolean) => void
  /**
   * Sets the visited state for this Field.
   * @param value The boolean value to which this Field's touched state should be set.
   */
  setTouched: (value: boolean) => void
}

export interface InnerFieldProps<F extends object, T> extends FormProvider<F, T> {
  name: Name
  formValue: F
  value: T
  initialValue: T
  type: string
  render?: (state: FieldProps<F, T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<F, T>>
  forwardProps: { [key: string]: any }
}

export interface FormState<F extends object> {
  errorCount: number
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

export interface CommonFieldProps {
  [key: string]: any
}

export interface FormProvider<F extends object, T = F> {
  path: Path
  value: T
  defaultValue: T
  initialValue: T
  errorCount: number
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
  errors: FormErrors<F>
  submit: (() => void)
  resetForm: (() => void)
  clearForm: (() => void)
  forgetState: (() => void)
  unwrapFormState: (() => FormState<F>)
  commonFieldProps: CommonFieldProps
  setActiveField: ((path: string | null) => void)
  touchField: ((path: Path, touched: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  registerError: ((path: Path, error: string) => void)
  unregisterError: ((path: Path, error: string) => void)
  setFormValue: (setFunc: SetFormValueFunc<F>) => void
  setValue: ((path: Path, value: any, setTouched?: boolean) => void)
  setTouched: (setFunc: SetFormTouchedFunc<F>) => void
  setVisited: (setFunc: SetFormVisitedFunc<F>) => void
  unregisterField: ((path: Path) => void)
  registerField: ((path: Path, type: 'section' | 'field') => void)
}

export interface GizmoProps<F extends object> extends FormMeta<F> {
  /**
   * The default value of the Form.
   */
  defaultValue: F
  /**
   * The initial value of the Form.
   */
  initialValue: F
  /**
   * Indicates whether the Form is valid based on whether any Faults have been rendered.
   */
  formIsValid: boolean
  /**
   * Indicates whether the Form is dirty based on whether the current Form value is equal to the Form's initialValue.
   */
  formIsDirty: boolean
  /**
   * The string path of the currently active (focused) Field.
   * Correct behaviour requires that a Field's onFocus and onBlur are correctly called.
   */
  activeField: string | null
  /**
   * The visited state of the Form.
   */
  visited: BooleanTree<F>
  /**
   * The touched state of the Form.
   */
  touched: BooleanTree<F>
  /**
   * The error state of the Form.
   */
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
  setFormValue: (set: SetFormValueFunc<F>) => void
  setTouched: (set: SetFormTouchedFunc<F>) => void
  setVisited: (set: SetFormVisitedFunc<F>) => void
  forwardProps: { [key: string]: any }
}

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
