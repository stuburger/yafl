import { FormProviderState } from '../index'
import initializeState from './getInitialState'
function getStartingState<T>(initialValue: T = {} as T): FormProviderState<T> {
  return {
    fields: initializeState(initialValue),
    loaded: false,
    isBusy: false,
    submitting: false,
    submitCount: 0,
    initialValue
  }
}

export default getStartingState
