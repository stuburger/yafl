export type Name = string | number
export type Path = Name[]

export type BooleanTree<T> = { [K in keyof T]?: T[K] extends object ? BooleanTree<T[K]> : boolean }

export type FormErrors<T extends object> = {
  [P in keyof T]?: T[P] extends object ? FormErrors<T[P]> : string[]
}

export interface FormMeta<T extends object> {
  /**
   * The current value of the form.
   */
  formValue: T
  /**
   * The number of times the form has been submitted.
   */
  submitCount: number
  /**
   * Clears all form state. formValue is reset to initialValue.
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
   * Clears all form state. formValue is reset to its defaultValue.
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
  setFormVisited: (set: SetFormVisitedFunc<T>) => void
  /**
   * Sets the form's touched state imperatively.
   * @param set A function that accepts the previous touched state and returns the next touched state.
   */
  setFormTouched: (set: SetFormTouchedFunc<T>) => void
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
  parse?: (value: any) => T
  render?: (state: FieldProps<F, T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<F, T>>
  [key: string]: any
}
export interface FieldProps<F extends object, T = any> extends FieldMeta<F, T> {
  input: InputProps<T>
  [key: string]: any
}

export interface FieldMeta<F extends object, T = any> extends FormMeta<F> {
  /**
   * The path for this Field.
   */
  path: string
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

/* @internal */
export interface InnerFieldProps<F extends object, T> extends FormProvider<F, T> {
  name: Name
  formValue: F
  value: T
  initialValue: T
  type: string
  parse?: (value: any) => T
  render?: (state: FieldProps<F, T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<F, T>>
  forwardProps: { [key: string]: any }
}

/* @internal */
export interface FormState<F extends object> {
  formValue: F
  defaultValue: F
  errorCount: number
  submitCount: number
  errors: FormErrors<F>
  initialMount: boolean
  touched: BooleanTree<F>
  visited: BooleanTree<F>
  initialValue: F | null
  activeField: string | null
  registeredFields: BooleanTree<F>
}

export interface ArrayHelpers<T> {
  /**
   * Appends new elements to an array, and returns the new length of the array.
   * @param items The items to push onto the array.
   */
  push: (...items: T[]) => number
  /**
   * Removes the last element from the array and returns it.
   * @returns The last element in the array.
   */
  pop: () => T | undefined
  /**
   * Removes the first element from the array and returns it.
   * @returns The first element in the array.
   */
  shift: () => T | undefined
  /**
   * Inserts new elements at the start of an array.
   * @param items Elements to insert at the start of the Array.
   * @returns The new length of the array.
   */
  unshift: (...items: T[]) => number
  /**
   * Inserts an element into the array at the specified index.
   * @param index The index at which to insert the value.
   * @param items Elements to insert at the specified index.
   * @returns The new length of the array.
   */
  insert: (index: number, ...items: T[]) => number
  /**
   * Swaps two elements at the specified indices.
   * @param index The index at which to insert the value.
   * @param value The value to insert into the array.
   */
  swap: (index1: number, index2: number) => void
  /**
   * Removes an element from the array at the specified index.
   * @param index The index of the element to remove.
   * @returns The value that was removed.
   */
  remove: (index: number) => T | undefined
}

export interface CommonFieldProps {
  [key: string]: any
}

/* @internal */
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
  setFormTouched: (setFunc: SetFormTouchedFunc<F>) => void
  setFormVisited: (setFunc: SetFormVisitedFunc<F>) => void
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
   * Indicates whether the Form is dirty based on whether formValue is equal to initialValue.
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

/* @internal */
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
  setFormValue: (set: SetFormValueFunc<F>) => void
  setFormTouched: (set: SetFormTouchedFunc<F>) => void
  setFormVisited: (set: SetFormVisitedFunc<F>) => void
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
