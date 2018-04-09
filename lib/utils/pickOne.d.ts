declare function pick<T1, T2, TResult>(
  obj1: T1,
  obj2: T2,
  fieldName: keyof T1 & keyof T2,
  defaultValue?: any
): TResult
export default pick
export declare function createPicker<T1, T2, TResult>(
  fieldName: keyof T1 & keyof T2,
  defaultValue?: TResult
): (obj1: T1, obj2: T2) => TResult
