import * as React from 'react'
import getInitialState from './getInitialState'
import { FormProviderState, ReactContextForm } from './index'
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

  initialValue(value: T): this {
    this._initialValue = value
    return this
  }

  getInitialValueAsync(value: () => Promise<T>): this {
    this._initialValueAsync = value
    return this
  }

  create(): ReactContextForm<T> {
    const { Consumer, Provider } = createForm<T>(this._initialValue)

    return {
      Form: wrapProvider<T>(Provider, {
        initialValue: this._initialValue,
        getInitialValueAsync: this._initialValueAsync
      }),
      Field: createField<T>(Consumer),
      FormComponent: createFormComponent<T>(Consumer)
    }
  }
}
