import { isObject, isFunction } from './checkType'

export interface EquityComparer {
  (a: any, b: any): boolean
}

export interface ConditionCallback {
  (value: any): boolean
}

const baseAny = (obj: any, check: ConditionCallback): boolean => {
  if (!isObject(obj)) {
    return check(obj)
  }
  let ret: boolean = false
  for (let key in obj) {
    ret = baseAny(obj[key], check)
    if (ret) break
  }
  return ret
}

const any = (obj: any, value: boolean | null | string | number | ConditionCallback): boolean => {
  if (isFunction(value)) return baseAny(obj, value)
  else return baseAny(obj, x => x === value)
}

export default any
