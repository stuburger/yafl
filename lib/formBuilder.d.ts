import { BoolFunc, ReactContextForm, MapPropsToFields } from './types/index'
export default class FormBuilder<T> {
  private _initialValue
  private _getInitialValueFromProps
  private _initialValueAsync
  private _isSubmitting
  private _isLoading
  initialValue(value: T): this
  initialValueFromProps(func: MapPropsToFields<T>): this
  getInitialValueAsync(value: () => Promise<T>): this
  loading(func: BoolFunc): this
  submitting(func: BoolFunc): this
  create(): ReactContextForm<T>
}
