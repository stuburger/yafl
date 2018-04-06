import { BoolFunc, ReactContextForm } from './types/index'
export default class FormBuilder<T> {
  private _initialValue
  private _initialValueAsync
  initialValue(value: T): this
  loadAsync(value: () => Promise<T>): this
  loading(func: BoolFunc): this
  submitting(func: BoolFunc): this
  create(): ReactContextForm<T>
}
