export interface TransformCallback<T, TResult> {
  (ret: TResult, value: T[keyof T], key: keyof T): TResult
}
declare function transform<T, TResult>(
  object: T,
  func: TransformCallback<T, TResult>,
  initialValue?: TResult
): TResult
export default transform
