import * as React from 'react'
import getInitialState from './getInitialState'
import {
  FormProviderState,
  BoolFunc,
  ReactContextForm,
  MapPropsToFields,
  PropsToBool
} from './types/index'
import wrapProvider from './createFormProvider'
import createField from './createField'
import createFormComponent from './createFormComponent'

function createForm<T>(initialValue?: T) {
  return React.createContext<FormProviderState<T>>({
    value: getInitialState(initialValue),
    loaded: false,
    submitting: false,
    isBusy: false,
    submitCount: 0
  })
}

const defaultLoading: PropsToBool = () => false
const defaultSubmitting: PropsToBool = () => false

export default class FormBuilder<T> {
  private _initialValue: T
  private _getInitialValueFromProps: MapPropsToFields<T>
  private _initialValueAsync: () => Promise<T>
  private _isSubmitting: BoolFunc
  private _isLoading: BoolFunc

  initialValue(value: T): this {
    this._initialValue = value
    return this
  }

  initialValueFromProps(func: MapPropsToFields<T>): this {
    this._getInitialValueFromProps = func
    return this
  }

  getInitialValueAsync(value: () => Promise<T>): this {
    this._initialValueAsync = value
    return this
  }

  loading(func: BoolFunc): this {
    this._isLoading = func
    return this
  }

  submitting(func: BoolFunc): this {
    this._isSubmitting = func
    return this
  }

  create(): ReactContextForm<T> {
    const { Consumer, Provider } = createForm<T>(this._initialValue)
    const defaultGetInitialValue: MapPropsToFields<T> = (props): T => ({} as T)
    const defaultGetInitialValueAsync: () => Promise<T> = () => {
      return null
    }
    return {
      Form: wrapProvider<T>(Provider, {
        initialValue: this._initialValue,
        loading: this._isLoading || defaultLoading,
        submitting: this._isSubmitting || defaultSubmitting,
        getInitialValueAsync: this._initialValueAsync || defaultGetInitialValueAsync,
        getInitialValueFromProps: this._getInitialValueFromProps || defaultGetInitialValue
      }),
      Field: createField<T>(Consumer),
      FormComponent: createFormComponent<T>(Consumer)
    }
  }
}
