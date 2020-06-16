export function isString(value: any): value is string {
  return Object.prototype.toString.call(value) === '[object String]'
}
export function isNullOrUndefined(value: any): value is null | undefined {
  return value === null || value === undefined
}
export function isObject(value: any): value is Object {
  return value !== null && value instanceof Object
}
export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}
