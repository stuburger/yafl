// import * as React from 'react'
// import { wrapProvider } from './provider'
// import {
//   wrapConsumer,
//   wrapFormConsumer,
//   getTypedField,
//   createFormComponent,
//   wrapFieldMapConsumer
// } from './consumers'
// import {
//   Noop,
//   Provider,
//   FieldProps,
//   ComponentConfig,
//   FieldConfig,
//   FormProviderConfig,
//   BaseFieldConfig,
//   ComponentProps,
//   FieldOptions,
//   ValidationType,
//   ValidateOnCustom,
//   ValidateOn,
//   ValidatorConfig,
//   SectionConfig,
//   FormProviderState
// } from './sharedTypes'
// import { createSection } from './Section'

// export {
//   FormProviderConfig,
//   ComponentConfig,
//   ComponentProps,
//   FieldConfig,
//   BaseFieldConfig,
//   FieldProps,
//   FieldOptions,
//   ValidationType,
//   ValidateOnCustom,
//   ValidatorConfig,
//   ValidateOn,
//   SectionConfig
// }

// export type FPC<T extends object> = FormProviderConfig<T>
// export type GCC<T extends object, K extends keyof T = keyof T> = ComponentConfig<T, K>
// export type GCP<T extends object, K extends keyof T = keyof T> = ComponentProps<T, K>
// export type FCC<T extends object, K extends keyof T = keyof T> = FieldConfig<T, K>
// export type FC<T extends object, K extends keyof T = keyof T> = BaseFieldConfig<T, K>
// export type FP<T extends object, K extends keyof T = keyof T> = FieldProps<T, K>

// /* @internal */
// interface DefaultProviderValue<T extends object, P extends keyof T = keyof T>
//   extends FormProviderState<T> {
//   getFormValue: ((includeUnregisterdFields?: boolean) => T) | Noop
//   resetForm: (() => void) | Noop
//   formIsTouched: boolean
//   defaultValue: T
//   formIsValid: boolean
//   formIsDirty: boolean
//   forgetState: (() => void) | Noop
//   onSubmit: (() => void) | Noop
//   submitCount: number
//   clearForm: (() => void) | Noop
//   errors: { [K in keyof T]: string[] }
//   registerValidators:
//     | (<K extends keyof T>(fieldName: K, opts: ValidatorConfig<T, K>) => void)
//     | Noop
//   registerField: (<K extends P>(fieldName: K, opts: FieldOptions<T, K>) => void) | Noop
//   unregisterField: (<K extends P>(fieldName: K) => void) | Noop
//   onFieldBlur: (<K extends P>(fieldName: K) => void) | Noop
//   setFieldValue: (<K extends P>(fieldName: K, value: T[K]) => void) | Noop
//   setFieldValues: ((partialUpdate: Partial<T>) => void) | Noop
//   touchField: (<K extends P>(fieldName: K) => void) | Noop
//   setActiveField: (<K extends P>(fieldName: K | null) => void) | Noop
//   renameField: (<K extends P>(prevName: K, nextName: K) => void) | Noop
//   untouchField: (<K extends P>(fieldName: K) => void) | Noop
//   touchFields: ((fieldNames: (keyof T)[]) => void) | Noop
//   untouchFields: ((fieldNames: (keyof T)[]) => void) | Noop
// }

// function noop(): never {
//   throw new Error('A <Field /> component can only appear inside a <Form /> component')
// }

// function getDefaultProviderValue<T extends object>(): DefaultProviderValue<T> {
//   return {
//     initialMount: false,
//     touched: {},
//     blurred: {},
//     active: null,
//     registeredFields: {},
//     defaultValue: {} as T,
//     formValue: {} as T,
//     initialFormValue: {} as T,
//     isBusy: false,
//     loaded: false,
//     formIsTouched: false,
//     formIsValid: true,
//     submitCount: 0,
//     submitting: false,
//     formIsDirty: false,
//     errors: {} as { [K in keyof T]: string[] },
//     getFormValue: noop,
//     onSubmit: noop,
//     resetForm: noop,
//     clearForm: noop,
//     touchField: noop,
//     renameField: noop,
//     untouchField: noop,
//     touchFields: noop,
//     untouchFields: noop,
//     forgetState: noop,
//     onFieldBlur: noop,
//     setFieldValue: noop,
//     setActiveField: noop,
//     setFieldValues: noop,
//     registerField: noop,
//     unregisterField: noop,
//     registerValidators: noop
//   }
// }

// export const createFormContext = <T extends object>(defaultValue: T) => {
//   const { Consumer, Provider } = React.createContext<Provider<T>>(getDefaultProviderValue())

//   const Form = wrapProvider<T>(Provider, defaultValue)
//   const Field = wrapConsumer<T>(Consumer)
//   const FormComponent = wrapFormConsumer<T>(Consumer)
//   const FieldMap = wrapFieldMapConsumer(Consumer)

//   return {
//     Form,
//     Field,
//     FormComponent,
//     FieldMap,
//     // createSection: function<K extends keyof T>(fieldName?: K): React.ComponentClass<BaseSectionConfig<T, K>> {
//     //   return createSection<T, K>(Form as any, Field as any, fieldName) as any
//     // },
//     Section: createSection<T, keyof T>(Form as any, Field),
//     createField: function<K extends keyof T>(
//       fieldName: K,
//       component?: React.ComponentType<FieldProps<T, K>>
//     ) {
//       return getTypedField<T, K>(Consumer, fieldName, component)
//     },
//     createFormComponent: function<K extends keyof T>(
//       component: React.ComponentType<ComponentProps<T, K>>
//     ) {
//       return createFormComponent<T>(Consumer, component)
//     }
//   }
// }

export { default as Form } from './js/Form'
export { default as Section } from './js/Section'
export { default as Field } from './js/Field'
export { default as Gizmo } from './js/Gizmo'

// export const { Form, Field, FormComponent, FieldMap, Section } = createFormContext<any>({})
export { required, maxLength, minLength } from './validators'
