// import * as React from 'react'
// import { cloneDeep, transform } from 'lodash'

// const defaultFieldState: FieldState = {
//   value: '',
//   originalValue: '',
//   isValid: false,
//   isDirty: false,
//   didBlur: false,
//   isTouched: false
// }

// function getInitialState<T>(value: T): FormFieldState<T> {
//   return transform<any, FieldState>(
//     value,
//     (ret: FormFieldState<T>, value, fieldName: keyof T) => {
//       ret[fieldName] = {
//         value,
//         originalValue: cloneDeep(value),
//         isValid: false,
//         isDirty: false,
//         didBlur: false,
//         isTouched: false
//       }
//     },
//     {} as FormFieldState<T>
//   ) as FormFieldState<T>
// }

// function createForm<T>(initialValue?: T) {
//   return React.createContext<FormProviderState<T>>({
//     value: getInitialState(initialValue),
//     loaded: false
//   })
// }

// export interface BoolFunc {
//   (props: any): boolean
// }

// export interface FieldState {
//   value: any
//   didBlur: boolean
//   isDirty: boolean
//   isValid: boolean
//   isTouched: boolean
//   originalValue: any
// }

// export type FormFieldState<T> = { [k in keyof T]: FieldState } | null

// export interface FormProviderState<T> {
//   value: FormFieldState<T>
//   loaded: boolean
// }

// export interface FormProviderProps<T> {
//   loadAsync?: () => Promise<T>
//   initialValue?: T
//   children: React.ReactNode
// }

// export interface Validator {
//   (value, fieldName, formValue): string
// }

// export interface FormFieldProps<T> {
//   name: keyof T
//   validators?: Validator[]
//   render: (state: FormContextReceiverProps) => React.ReactNode
// }

// export interface FieldValidationResult {
//   isValid: boolean
//   messages: string[]
// }

// export interface FormContextReceiverProps {
//   onChange: (value: any) => void
//   submit: () => void
//   value: any
//   validation: FieldValidationResult
// }

// export interface ReactContextForm<T> {
//   Form: React.ComponentClass<FormProviderProps<T>>
//   Field: React.ComponentClass<FormFieldProps<T>>
// }

// export interface ProviderValue<T> {
//   value: FormFieldState<T>
//   loaded: boolean
//   submit: () => void
//   registerValidator: RegisterValidator<T>
//   validateField: (fieldName: keyof T, value: any) => FieldValidationResult
//   setFieldValue: (fieldName: keyof T, value: any) => void
// }

// export default class FormBuilder<T> {
//   private _initialValue: T
//   private _initialValueAsync: () => Promise<T>
//   // private _isSubmitting: BoolFunc
//   // private _isLoading: BoolFunc

//   initialValue(value: T): this {
//     this._initialValue = value
//     return this
//   }

//   loadAsync(value: () => Promise<T>): this {
//     this._initialValueAsync = value
//     return this
//   }

//   loading(func: BoolFunc): this {
//     // this._isLoading = func
//     return this
//   }
//   submitting(func: BoolFunc): this {
//     // this._isSubmitting = func
//     return this
//   }

//   create(): ReactContextForm<T> {
//     const { Consumer, Provider } = createForm<T>(this._initialValue)
//     return {
//       Form: wrapFormProvider(Provider, {
//         initialValue: this._initialValue,
//         loadAsync: this._initialValueAsync
//       }),
//       Field: wrapFieldConsumer(Consumer)
//     }
//   }
// }

// interface FormProviderOptions<T> {
//   initialValue: T
//   loadAsync: () => Promise<T>
// }

// type ValidatorSet<T> = { [P in keyof T]?: Validator[] }

// function wrapFormProvider<T>(
//   Provider: React.Provider<FormProviderState<T>>,
//   opts: FormProviderOptions<T>
// ) {
//   // const getInitialValue = (props): FormFieldState<T> =>
//   //   props.initialValue || opts.initialValue || ({} as FormFieldState<T>)

//   return class Form extends React.Component<
//     FormProviderProps<T>,
//     FormProviderState<FormFieldState<T>>
//   > {
//     private validators: ValidatorSet<T> = {}
//     // state = { value: getInitialValue(this.props) } // here be errors
//     state = { value: null, loaded: false } // here be errors
//     componentDidMount() {
//       let load = this.props.loadAsync || opts.loadAsync
//       if (load) {
//         load().then(this.init)
//       }
//     }

//     init = (value: T) => {
//       this.setState({ value: getInitialState(value), loaded: true })
//     }

//     submit = () => {}

//     setFieldValue = (fieldName: keyof T, value: any) => {
//       if (!this.state.loaded) {
//         return
//       }
//       const state = cloneDeep(this.state)
//       state.value[fieldName].value = value
//       state.value[fieldName].isDirty =
//         JSON.stringify(value) !== JSON.stringify(state.value[fieldName].originalValue)
//       this.setState(state)
//     }

//     registerValidator = (fieldName: keyof T, validators: Validator[]) => {
//       this.validators[fieldName] = validators
//     }

//     validateField = (fieldName: keyof T, value: any): FieldValidationResult => {
//       const validators = this.validators[fieldName] || []
//       const messages = validators.map(f => f(value, fieldName, this.state.value)).filter(x => !!x)
//       return {
//         messages,
//         isValid: messages.length === 0
//       }
//     }

//     getProviderValue = (): ProviderValue<T> => {
//       return {
//         loaded: this.state.loaded, // shouldnt have to pass this down
//         submit: this.submit,
//         value: this.state.value,
//         setFieldValue: this.setFieldValue,
//         registerValidator: this.registerValidator,
//         validateField: this.validateField
//       }
//     }

//     render() {
//       return <Provider value={this.getProviderValue()}>{this.props.children}</Provider>
//     }
//   }
// }

// function wrapFieldConsumer<T>(Consumer: React.Consumer<ProviderValue<T>>) {
//   const InnerField = getInnerField<T>()

//   return class FormField extends React.Component<FormFieldProps<T>> {
//     _render = (state: ProviderValue<T>) => {
//       const { name, render, validators = [] } = this.props
//       const value = state.loaded ? state.value[name] : defaultFieldState
//       return (
//         <InnerField
//           {...value}
//           name={name}
//           submit={state.submit}
//           validators={validators}
//           setFieldValue={state.setFieldValue}
//           validationResult={state.validateField(name, value)}
//           registerValidator={state.registerValidator}
//           render={render}
//         />
//       )
//     }

//     render() {
//       return <Consumer>{this._render}</Consumer>
//     }
//   }
// }

// interface InnerFieldProps<T> extends FieldState {
//   submit: () => void
//   render: (value) => React.ReactNode
//   name: keyof T
//   validationResult: FieldValidationResult
//   setFieldValue: (fieldName: keyof T, value: any) => void
//   validators?: Validator[]
//   registerValidator: RegisterValidator<T>
// }

// interface RegisterValidator<T> {
//   (fieldName: keyof T, validators: Validator[])
// }

// function getInnerField<T>() {
//   return class InnerField extends React.Component<InnerFieldProps<T>> {
//     state = { isMounted: false }
//     componentDidMount() {
//       const { registerValidator, name, validators = [] } = this.props
//       registerValidator(name, validators)
//     }

//     onChange = e => {
//       const { setFieldValue, name } = this.props
//       setFieldValue(name, e.target.value)
//     }

//     componentDidUpdate(pp) {
//       const { validators = [], registerValidator, name } = this.props
//       if (validators !== pp.validators) {
//         registerValidator(name, validators)
//       }
//     }

//     render() {
//       const { render, value, isDirty, submit, validationResult } = this.props
//       return render({
//         value,
//         isDirty,
//         submit,
//         onChange: this.onChange,
//         validation: validationResult
//       })
//     }
//   }
// }
