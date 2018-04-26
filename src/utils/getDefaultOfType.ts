import {
  isNullOrUndefined,
  isBoolean,
  isNumber,
  isDate,
  isString,
  isObject
} from '../utils/checkType'

export default function getDefaultOfType<T>(value: T, defaultValue?: T): T {
  if (defaultValue) {
    return defaultValue
  }
  if (isNullOrUndefined(value)) {
    return value
  }
  let res: any
  if (isBoolean(value)) {
    res = false
  } else if (Array.isArray(value)) {
    res = []
  } else if (isNumber(value)) {
    res = 0
  } else if (isDate(value)) {
    res = new Date()
  } else if (isString(value)) {
    res = ''
  } else if (isObject(value)) {
    res = {}
    const keys = Object.keys(value) as (keyof T)[]
    for (let key of keys) {
      res[key] = getDefaultOfType(value[key])
    }
  } else {
    throw new Error('unexpected value type ' + value)
  }
  return res as T
}
