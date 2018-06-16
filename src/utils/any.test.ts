import any from './any'

const obj1 = { a: 1 }
const obj2 = { a: 1, b: 'test' }
const obj3 = { a: 1, b: ['test'] }
const obj4 = { a: 1, b: { c: { d: [{ x: [{ meow: 'meow' }] }] } } }

describe('checks the most deeply nested properties of an object using a compare function or value', () => {
  test('should return correct result', () => {
    expect(any(obj1, Number.isInteger)).toBe(true)
    expect(any(obj1, val => typeof val === 'string')).toBe(false)
    expect(any(obj2, val => typeof val === 'string')).toBe(true)
    expect(any(obj3, val => typeof val === 'string')).toBe(true)
    expect(any(obj4, val => typeof val === 'string')).toBe(true)
    expect(any(obj4, Number.isInteger)).toBe(true)
    expect(any(obj4, Number.isFinite)).toBe(true)
    expect(any(null, Number.isFinite)).toBe(false)
    expect(any(undefined, val => val === undefined)).toBe(true)
    expect(any(null, val => val === null)).toBe(true)
    expect(any(undefined, val => val === null)).toBe(false)
    expect(any([], val => val === undefined)).toBe(false)
    expect(any({}, val => val === undefined)).toBe(false)
    expect(any({ a: undefined }, val => val === undefined)).toBe(true)
    expect(any({ a: [undefined] }, val => val === undefined)).toBe(true)
    expect(any([undefined], val => val === undefined)).toBe(true)
    expect(any([null], val => val === null)).toBe(true)
  })
})
