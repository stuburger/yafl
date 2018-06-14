export function isNumber(value: any): value is number {
  return typeof value === 'number'
}
export function isDate(value: any): value is Date {
  return value instanceof Date
}
export function isString(value: any): value is string {
  return !isNullOrUndefined(value) && typeof value === 'string'
}
export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}
export function isUndefined(value: any): value is undefined {
  return value === undefined
}
export function isNull(value: any): value is null {
  return value === null
}
export function isNullOrUndefined(value: any): value is null | undefined {
  return isNull(value) || isUndefined(value)
}
export function isObject(value: any): value is Object {
  return !isNull(value) && value instanceof Object
}
export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}
