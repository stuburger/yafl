export type Name = string | number

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
export type BooleanTree<T> = { [K in keyof T]?: T[K] extends object ? BooleanTree<T[K]> : boolean }

export type FormErrors<T extends object> = {
  [P in keyof T]?: T[P] extends object ? FormErrors<T[P]> : string[]
}

// export type FormProp<F extends object> = { [K in keyof F]?: F[K] extends object ? FormProp<F[K]> : any }

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

export interface SetFieldValueFunc<T> {
  (previousValue: T): T
}

export interface SetFormVisitedFunc<T extends object> {
  (previousVisited: BooleanTree<T>): BooleanTree<T>
}

export interface SetFormTouchedFunc<T extends object> {
  (previousTouched: BooleanTree<T>): BooleanTree<T>
}

export interface InputProps<T = any> {
  /**
   * The name of this Field.
   */
  name: string
  /**
   * The value of this Field.
   */
  value: T
  onBlur: (e: React.FocusEvent<any>) => void
  onFocus: (e: React.FocusEvent<any>) => void
  onChange: (e: React.ChangeEvent<any>) => void
}

export interface UseFieldConfig<F extends object, T = any> {
  validate?: FieldValidator<T, F> | Array<FieldValidator<T, F>>
}

export interface FieldConfig<F extends object, T = any> {
  name: Name
  forwardRef?: React.Ref<any>
  render?: (props: FieldProps<F, T>) => JSX.Element
  validate?: FieldValidator<T, F> | Array<FieldValidator<T, F>>
  component?: React.ComponentType<FieldProps<F, T>> | string
  [key: string]: any
}

export type UseFieldFn<T, F extends object> = (
  name: Name,
  props: UseFieldConfig<F, T>
) => UseFieldProps<F, T>

export type UseDeliveryFn<TBranch extends object = {}, TShared extends object = {}> = (
  name: Name
) => [TBranch, TShared]

export type UseFieldProps<F extends object, T = any> = [InputProps<T>, FieldMeta<F, T>]

export interface FieldProps<F extends object, T = any> {
  input: InputProps<T>
  meta: FieldMeta<F, T>
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
   * Sets the value for this Field.
   * @param value The value to set.
   * @param touch Optionally specify if this Field should be touched when this function is called. Default is true.
   */
  setValue: (value: T | SetFieldValueFunc<T>, touch?: boolean) => void
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

export type ValidationResult = string | void | undefined

export interface FieldValidator<T, F extends object> {
  (value: T, formValue: F): ValidationResult
}

export interface FormState<F extends object> {
  formValue: F
  errorCount: number
  submitCount: number
  errors: FormErrors<F>
  initialMount: boolean
  touched: BooleanTree<F>
  visited: BooleanTree<F>
  activeField: string | null
}

export interface RepeatConfig<T> {
  name: Name
  fallback?: T[]
  children: (value: T[], utils: ArrayHelpers<T>) => React.ReactNode
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
  /**
   * Sets the value of the array.
   * @param value The new value of the array, or a callback function that accepts
   * the previous value of the array and returns the next value.
   */
  setValue: (value: T[] | SetFieldValueFunc<T[]>) => void
}

export interface SectionHelpers<T> {
  /**
   * Sets the value of this section.
   * @param value  The new value for this section, or a callback function that accepts
   * the previous value of the array and returns the next value.
   */
  setValue: (value: T | SetFieldValueFunc<T>) => void
}

export interface FormProvider<F extends object, T = F> {
  path: string
  value: T
  initialValue: T
  errorCount: number
  formValue: F
  branchProps: any
  initialMount: boolean
  touched: BooleanTree<any>
  visited: BooleanTree<any>
  activeField: string | null
  submitCount: number
  formIsValid: boolean
  formIsDirty: boolean
  errors: FormErrors<F>
  submit: () => void
  resetForm: () => void
  forgetState: () => void
  sharedProps: Record<string, any>
  setActiveField: (path: string | null) => void
  touchField: (path: string, touched: boolean) => void
  visitField: (path: string, visited: boolean) => void
  registerErrors: (path: string, error: string[]) => void
  unregisterErrors: (path: string) => void
  setFormValue: (setFunc: SetFormValueFunc<F>) => void
  setValue: (path: string, value: any, setTouched?: boolean) => void
  setFormTouched: (setFunc: SetFormTouchedFunc<F>) => void
  setFormVisited: (setFunc: SetFormVisitedFunc<F>) => void
  unregisterField: (path: string) => void
  registerField: (path: string) => void
}

export interface FormProps<F extends object> extends FormMeta<F> {
  /**
   * Indicates if the Form has mounted. Field's are only registerd once initialMount becomes true.
   */
  initialMount: boolean
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
   * The number of errors on your Form.
   */
  errorCount: number
  /**
   * The error state of the Form.
   */
  errors: FormErrors<F>
  [key: string]: any
}

/* @internal */
export interface Person {
  name: string
  age: number
  contact: Contact
  hobbies: Hobby[]
}

/* @internal */
export interface Hobby {
  name: string
  type: string
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

export interface FormConfig<T extends object> {
  initialValue?: T
  disabled?: boolean
  commonValues?: ((state: { formValue: T }) => Record<string, any>) | Record<string, any>
  branchValues?: ((state: { formValue: T }) => Record<string, any>) | Record<string, any>
  initialSubmitCount?: number
  initialTouched?: BooleanTree<T>
  initialVisited?: BooleanTree<T>
  children: React.ReactNode | ((props: FormProps<T>) => React.ReactNode)
  submitUnregisteredValues?: boolean
  persistFieldState?: boolean
  onSubmit?: (formValue: T, props: FormProps<T>) => boolean | void
  rememberStateOnReinitialize?: boolean
  onStateChange?: (previousState: FormState<T>, nextState: FormState<T>) => void
  onFormValueChange?: (prev: T, next: T) => void
}
