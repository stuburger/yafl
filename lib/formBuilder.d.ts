import { ReactContextForm } from '../index'
export default class FormBuilder<T> {
  private _initialValue
  private _initialValueAsync
  initialValue(value: T): this
  getInitialValueAsync(value: () => Promise<T>): this
  create(): ReactContextForm<T>
}
