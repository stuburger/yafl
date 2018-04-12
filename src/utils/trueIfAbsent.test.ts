import trueIfAbsent from './trueIfAbsent'

describe('trueIfAbsent only returns false if a value is === false', () => {
  test('should return true if value is null or undefinde', () => {
    expect(trueIfAbsent(null)).toBe(true)
    expect(trueIfAbsent(undefined)).toBe(true)
    expect(trueIfAbsent('')).toBe(true)
    expect(trueIfAbsent(0)).toBe(true)
    expect(trueIfAbsent(NaN)).toBe(true)
  })

  test('should return true if value is true', () => {
    expect(trueIfAbsent(true)).toBe(true)
  })
  test('should return false if value is false', () => {
    expect(trueIfAbsent(false)).toBe(false)
  })
})
