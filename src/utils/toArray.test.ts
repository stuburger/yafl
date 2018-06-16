import toArray from './toArray'

describe('toArray', () => {
  test('it should convert non-array (non-null and non-undefined) types to an array containing an element of the same type', () => {
    expect(toArray(1)).toEqual([1])
    expect(toArray(0)).toEqual([0])
    expect(toArray('test')).toEqual(['test'])
    expect(toArray(true)).toEqual([true])
    expect(toArray(false)).toEqual([false])
    expect(toArray({ a: 1 })).toEqual([{ a: 1 }])
    expect(toArray({ a: null, b: [] })).toEqual([{ a: null, b: [] }])
  })

  test('it should return an empty array if null or undefined passed into the function', () => {
    expect(toArray(null)).toEqual([])
    expect(toArray(undefined)).toEqual([])
  })

  test('it should return the same array by reference if an array is passed into the function', () => {
    const arr1: any[] = []
    const arr1a: any[] = []
    const arr2 = [1, 2, 3, 4]
    const arr3 = ['a', 'b', 'c', 'd']
    const arr4 = [{ a: [] }, { a: [] }, { x: [] }, '', 32]
    expect(toArray(arr1)).toBe(arr1)
    expect(toArray(arr1)).not.toBe(arr1a)
    expect(toArray(arr2)).toBe(arr2)
    expect(toArray(arr3)).toBe(arr3)
    expect(toArray(arr4)).toBe(arr4)
  })
})
