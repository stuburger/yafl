import clone from './clone'
export interface TransformCallback<T, TResult> {
  (ret: TResult, value: T[keyof T], key: keyof T): TResult
}

function recurse<T, TResult>(
  object: T,
  func: TransformCallback<T, TResult>,
  ret: TResult,
  keys: (keyof T)[],
  index: number
): TResult {
  const key = keys[index]
  if (!key) return ret
  return recurse(object, func, clone(func(ret, object[key], key)), keys, index + 1)
}

function objectKeys<T>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

function transform<T, TResult>(
  object: T,
  func: TransformCallback<T, TResult>,
  initialValue?: TResult
): TResult {
  let ret: TResult = initialValue || ({} as TResult)
  return recurse(object, func, ret, objectKeys(object), 0)
}

export default transform

// function transform<T, TResult>(
//   object: T,
//   func: TransformCallback<T, TResult>,
//   initialValue?: TResult
// ): TResult {
//   let ret: TResult = initialValue || ({} as TResult)
//   for (let key in object) {
//     ret = func(ret, object[key], key)
//   }
//   return ret
// }
