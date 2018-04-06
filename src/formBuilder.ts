import * as React from 'react'
import getInitialState from './getInitialState'
import { FormProviderState, BoolFunc, ReactContextForm } from './types/index'
import wrapProvider from './wrapProvider'
import wrapConsumer from './wrapConsumer'

function createForm<T>(initialValue?: T) {
  return React.createContext<FormProviderState<T>>({
    value: getInitialState(initialValue),
    loaded: false
  })
}

export default class FormBuilder<T> {
  private _initialValue: T
  private _initialValueAsync: () => Promise<T>
  // private _isSubmitting: BoolFunc
  // private _isLoading: BoolFunc

  initialValue(value: T): this {
    this._initialValue = value
    return this
  }

  loadAsync(value: () => Promise<T>): this {
    this._initialValueAsync = value
    return this
  }

  loading(func: BoolFunc): this {
    // this._isLoading = func
    return this
  }
  submitting(func: BoolFunc): this {
    // this._isSubmitting = func
    return this
  }

  create(): ReactContextForm<T> {
    const { Consumer, Provider } = createForm<T>(this._initialValue)
    return {
      Form: wrapProvider(Provider, {
        initialValue: this._initialValue,
        loadAsync: this._initialValueAsync
      }),
      Field: wrapConsumer(Consumer)
    }
  }
}
