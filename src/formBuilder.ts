import * as React from 'react'
import getInitialState from './getInitialState'
import { FormProviderState, BoolFunc, ReactContextForm } from './types/index'
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

export default class FormBuilder<T> {
  private _initialValue: T
  private _initialValueAsync: () => Promise<T>
  private _isSubmitting: BoolFunc
  private _isLoading: BoolFunc

  initialValue(value: T): this {
    this._initialValue = value
    return this
  }

  loadAsync(value: () => Promise<T>): this {
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
    return {
      Form: wrapProvider<T>(Provider, {
        initialValue: this._initialValue,
        loadAsync: this._initialValueAsync,
        loading: this._isLoading,
        submitting: this._isSubmitting
      }),
      Field: createField<T>(Consumer),
      FormComponent: createFormComponent<T>(Consumer)
    }
  }
}
