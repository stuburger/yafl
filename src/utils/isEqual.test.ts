import isEqual from './isEqual'

const obj1 = { a: 'foo', b: 'bar' }
const obj2 = { a: 'foo', b: 'bar' }
const arr1 = ['foo', 'bar']
const arr2 = ['foo', 'bar']

const deep1 = {
  a: {
    b: {
      c: [
        {
          x: 'foo',
          y: 'bar'
        }
      ]
    }
  }
}

const deep2 = {
  a: {
    b: {
      c: [
        {
          x: 'foo1',
          y: 'bar2'
        }
      ]
    }
  }
}

describe('should correctly compare 2 values for equality', () => {
  test('primitive values', () => {
    expect(isEqual(true, true)).toBe(true)
    expect(isEqual(true, false)).toBe(false)
    expect(isEqual('abcdefghijklmnop', 'abcdefghijklmnop')).toBe(true)
    expect(isEqual('xyz', 'xzy')).toBe(false)
    expect(isEqual(null, null)).toBe(true)
    expect(isEqual(undefined, null)).toBe(false)
  })

  test('reference values', () => {
    expect(isEqual({}, {})).toBe(true)
    expect(isEqual([], [])).toBe(true)
    expect(isEqual(obj1, obj1)).toBe(true)
    expect(isEqual(obj1, obj2)).toBe(true)
    expect(isEqual(arr1, arr1)).toBe(true)
    expect(isEqual(arr1, arr2)).toBe(true)
    expect(isEqual({}, [])).toBe(false)
    expect(isEqual(obj1, arr1)).toBe(false)
    expect(isEqual(deep1, deep1)).toBe(true)
    expect(isEqual(deep1, deep2)).toBe(false)
  })
})
