import * as React from 'react'
import wrapProvider from './form/createFormProvider'
import createField, { getTypedField } from './form/createField'
import createFormComponent from './form/createFormComponent'
import * as Internal from './internal'
import * as Exp from './export'

function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

function getDefaultProviderValue<T>(): Internal.ProviderValue<T> {
  return {
    fields: {} as Exp.FormFieldState<T>,
    loaded: false,
    isBusy: true,
    formIsTouched: false,
    formIsValid: true,
    submitCount: 0,
    submitting: false,
    formIsDirty: false,
    initialValue: {} as T,
    validation: {} as Exp.FormValidationResult<T>,
    getFormValue: noop,
    unload: noop,
    submit: noop,
    resetForm: noop,
    clearForm: noop,
    touch: noop,
    untouch: noop,
    forgetState: noop,
    onFieldBlur: noop,
    setFieldValue: noop,
    registerField: noop,
    registerValidator: noop
  }
}

function getFormContext<T>(): React.Context<Internal.ProviderValueLoaded<T>> {
  return React.createContext<Internal.ProviderValueLoaded<T>>(getDefaultProviderValue())
}

export function createForm<T>(initialValue: T) {
  const { Consumer, Provider } = getFormContext<T>()

  const form = wrapProvider<T>(Provider, initialValue)
  const field = createField<T>(Consumer)
  const component = createFormComponent<T>(Consumer)

  return {
    Form: form,
    Field: field,
    FormComponent: component,
    createField: function<K extends keyof T>(
      fieldName: K,
      component?: React.ComponentType<Exp.FieldProps<T, K>>
    ) {
      return getTypedField<T, K>(Consumer, fieldName, component)
    }
  }
}

export default createForm

const formContext = createForm<any>({})
export const Form = formContext.Form
export const Field = formContext.Field
export const FormComponent = formContext.FormComponent
export { required, maxLength, minLength } from './validators'

// export interface ReactContextForm<T> {
//   Form: React.ComponentClass<FormProviderProps<T>>
//   Field: React.ComponentClass<FormFieldProps<T>>
//   FormComponent: React.ComponentClass<GeneralComponentProps<T>>
//   createTypedField: any
// }
