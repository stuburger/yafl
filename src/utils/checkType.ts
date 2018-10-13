import { SetFieldValueFunc } from '../sharedTypes'

export function isString(value: any): value is string {
  return Object.prototype.toString.call(value) === '[object String]'
}
export function isNullOrUndefined(value: any): value is null | undefined {
  return value === null || value === undefined
}
export function isObject(value: any): value is Object {
  return value !== null && value instanceof Object
}
export function isSetFunc<T>(value: T | SetFieldValueFunc<T>): value is SetFieldValueFunc<T> {
  return typeof value === 'function'
}
