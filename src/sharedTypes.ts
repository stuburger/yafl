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
  // resetForm: () => void
  // /**
  //  * Calls the onSubmit function supplied to the Form component
  //  */
  // submit: () => void
  // /**
  //  * Resets submitCount, touched and visited. The form value is not reset.
  //  */
  // forgetState: () => void
  // /**
  //  * Clears all form state. formValue is reset to its defaultValue.
  //  */
  // clearForm: () => void
  // /**
  //  * Sets the form value imperatively.
  //  * @param set A function that accepts the previous form value and returns the next form value.
  //  */
  // setFormValue: (setValue: SetFormValueFunc<T>) => void
  // /**
  //  * Sets the form's visited state imperatively.
  //  * @param set A function that accepts the previous visited state and returns the next visited state.
  //  */
  // setFormVisited: (set: SetFormVisitedFunc<T>) => void
  // /**
  //  * Sets the form's touched state imperatively.
  //  * @param set A function that accepts the previous touched state and returns the next touched state.
  //  */
  // setFormTouched: (set: SetFormTouchedFunc<T>) => void
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

export type ComponentTypes<F extends object> = {
  [key: string]: React.ComponentType<FieldProps<F, any>>
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

export interface FieldConfig<F extends object, T = any> {
  name: Name
  forwardRef?: React.Ref<any>
  render?: (state: FieldProps<F, T>) => React.ReactNode
  validate?: FieldValidator<T, F> | Array<FieldValidator<T, F>>
  component?: React.ComponentType<FieldProps<F, T>> | string
  onChange?: (e: React.ChangeEvent<any>, props: FieldProps<F, T>) => void
  onBlur?: (e: React.FocusEvent<any>, props: FieldProps<F, T>) => void
  onFocus?: (e: React.FocusEvent<any>, props: FieldProps<F, T>) => void
  [key: string]: any
}
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
   * Used to dispatch a form Action
   */
  dispatch: React.Dispatch<Action<F>>
}

export interface InnerFieldProps<F extends object, T = any> {
  name: Name
  forwardRef?: React.Ref<any>
  validate?: FieldValidator<T, F> | Array<FieldValidator<T, F>>
  render?: (state: FieldProps<F, T>) => React.ReactNode
  component?: React.ComponentType<FieldProps<F, T>> | string
  onChange?: (e: React.ChangeEvent<any>, props: FieldProps<F, T>) => void
  onBlur?: (e: React.FocusEvent<any>, props: FieldProps<F, T>) => void
  onFocus?: (e: React.FocusEvent<any>, props: FieldProps<F, T>) => void
  forwardProps: { [key: string]: any }
}

export type ValidationResult = string | void | undefined

export interface FieldValidator<T, F extends object> {
  (value: T, formValue: F): ValidationResult
}

export interface FormState<F extends object, T = any> {
  value: T
  path: PathV2
  activeField: string | null
  errorCount: number
  submitCount: number
  errors: FormErrors<F>
  touched: BooleanTree<F>
  visited: BooleanTree<F>
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

export interface FormProps<F extends object> extends FormMeta<F> {
  /**
   * Indicates if the Form has mounted. Field's are only registerd once initialMount becomes true.
   */
  initialMount: boolean
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

export type IncSubmitCountAction = { type: 'inc_submit_count' }
export type ForgetStateAction = { type: 'forget_state' }
export type RegisterFieldAction = { type: 'register_field'; payload: PathV2 }
export type UnregisterFieldAction = {
  type: 'unregister_field'
  payload: PathV2
}

export interface InitializeFormPayload<F extends object> {
  value?: F
  touched?: BooleanTree<any>
  visited?: BooleanTree<any>
  submitCount?: number
}

export type InitializeFormAction<F extends object> = {
  type: 'set_form_state'
  payload: InitializeFormPayload<F>
}

export type RegisterErrorAction = {
  type: 'register_error'
  payload: {
    path: PathV2
    error: string
  }
}

export type UnregisterErrorAction = {
  type: 'unregister_error'
  payload: {
    path: PathV2
    error: string
  }
}

export type ResetFormAction<F extends object> = {
  type: 'reset_form'
  payload: F
}

export type SetActiveFieldAction = {
  type: 'set_active_field'
  payload: PathV2 | null
}

export type TouchFieldAction = {
  type: 'touch_field'
  payload: {
    path: PathV2
    touched: boolean
  }
}

export type VisitFieldAction = {
  type: 'visit_field'
  payload: {
    path: PathV2
    visited: boolean
  }
}

export type SetFieldValueAction = {
  type: 'set_field_value'
  payload: {
    path: PathV2
    val: any
    setTouched: boolean
  }
}

export type SetFormValueAction<F extends object> = {
  type: 'set_form_value'
  payload: F
}

export type SetFormVisited<F extends object> = {
  type: 'set_form_visited'
  payload: BooleanTree<F>
}

export type SetFormTouched<F extends object> = {
  type: 'set_form_touched'
  payload: BooleanTree<F>
}

export type Action<F extends object> =
  | RegisterFieldAction
  | UnregisterFieldAction
  | RegisterErrorAction
  | UnregisterErrorAction
  | IncSubmitCountAction
  | ForgetStateAction
  | ResetFormAction<F>
  | SetFieldValueAction
  | SetActiveFieldAction
  | VisitFieldAction
  | TouchFieldAction
  | InitializeFormAction<F>
  | SetFormValueAction<F>
  | SetFormTouched<F>
  | SetFormVisited<F>

export interface FormConfig<T extends object> {
  initialValue?: T
  disabled?: boolean
  initialSubmitCount?: number
  initialTouched?: BooleanTree<T>
  initialVisited?: BooleanTree<T>
  children: React.ReactNode | ((formState: FormState<T>, submit: () => void) => React.ReactNode)
  submitUnregisteredValues?: boolean
  onSubmit?: (formValue: FormState<T>, dispatch: React.Dispatch<Action<T>>) => boolean | void
  rememberStateOnReinitialize?: boolean
  onStateChange?: (previousState: FormState<T>, nextState: FormState<T>) => void
  onFormValueChange?: (prev: T, next: T) => void
}

export interface PropForwarderConfig {
  children: React.ReactNode
  [key: string]: any
}

export interface CombinedContexts<F extends object> {
  state: React.Context<FormState<F> | Symbol>
  dispatch: React.Context<React.Dispatch<Action<F>>>
  config: React.Context<FormConfig<F>>
  register: React.Context<(path: PathV2) => void>
  formValue: React.Context<F>
  submit: React.Context<() => void>
  branch: React.Context<any>
}
