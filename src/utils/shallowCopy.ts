import { isArray, isObject } from '.'

export default function shallowCopy<T>(obj: T): T {
  if (isArray(obj)) {
    return obj.map(x => x) as any
  }
  if (isObject(obj)) {
    const res = {} as T
    for (let x in obj) {
      res[x] = obj[x]
    }
    return res
  }
  return obj
}
