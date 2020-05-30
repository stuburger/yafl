import * as check from './checkType'

describe('type checks', () => {
  test('isString', () => {
    const { isString } = check
    expect(isString('')).toBe(true)
    expect(isString('aksdjfhasdlfa')).toBe(true)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect((isString as any)()).toBe(false)
    expect(isString(1)).toBe(false)
    expect(isString(0)).toBe(false)
    expect(isString(true)).toBe(false)
    expect(isString(false)).toBe(false)
    expect(isString([])).toBe(false)
    expect(isString({})).toBe(false)
  })

  test('isNullOrUndefined', () => {
    const { isNullOrUndefined } = check
    expect(isNullOrUndefined(null)).toBe(true)
    expect(isNullOrUndefined(undefined)).toBe(true)
    expect((isNullOrUndefined as any)()).toBe(true)
    expect(isNullOrUndefined(1)).toBe(false)
    expect(isNullOrUndefined(0)).toBe(false)
    expect(isNullOrUndefined('')).toBe(false)
    expect(isNullOrUndefined(true)).toBe(false)
    expect(isNullOrUndefined(false)).toBe(false)
    expect(isNullOrUndefined([])).toBe(false)
    expect(isNullOrUndefined({})).toBe(false)
  })

  test('isObject', () => {
    const { isObject } = check
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect((isObject as any)()).toBe(false)
    expect(isObject(1)).toBe(false)
    expect(isObject(0)).toBe(false)
    expect(isObject('')).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(false)).toBe(false)
    expect(isObject([])).toBe(true)
    expect(isObject({})).toBe(true)
  })
})
