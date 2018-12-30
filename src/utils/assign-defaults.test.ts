import assignDefaults from './assign-defaults'
describe('assign-defaults', () => {
  test('should copy only missing properties defaults', () => {
    expect(assignDefaults({ a: 'c' }, { a: 'bbb', d: 'c' })).toEqual({ a: 'c', d: 'c' })
  })

  test('should copy properties from multiple objects', () => {
    expect(assignDefaults({ a: 'b' }, { c: 'd' }, { e: 'f' })).toEqual({ a: 'b', c: 'd', e: 'f' })
  })

  test('should not fill in values that are null', () => {
    expect(assignDefaults({ a: null }, { a: 'c', d: 'c' })).not.toEqual({ a: 'c', d: 'c' })
  })

  test('should fill in values that are undefined', () => {
    expect(assignDefaults({ a: undefined }, { a: 'c', d: 'c' })).toEqual({ a: 'c', d: 'c' })
  })

  test('array values should be copied correctly', () => {
    expect(assignDefaults([1], [1, 2, 3])).toEqual([1, 2, 3])
    expect(assignDefaults({}, { a: [1, 2, 3] })).toEqual({ a: [1, 2, 3] })
    expect(assignDefaults({ a: [1, 2, 3] }, { a: [4, 5, 6, 7] })).toEqual({ a: [1, 2, 3, 7] })
  })

  test('should clone when an empty object is passed as the first arg.', () => {
    const obj = {}
    expect(assignDefaults(obj, { a: { b: 'c' } }, { a: { d: 'e' } })).toEqual({
      a: { b: 'c', d: 'e' }
    })
  })

  const a = { a: 42 }
  const b = { b: 33 }
  const x = assignDefaults(
    {},
    { a, c: { e: { lekker: 'pies' } } },
    { a: 44, b },
    { c: { e: { meow: 'cat' } } }
  )

  test('should copy nested values.', () => {
    expect(x).toEqual({ a: { a: 42 }, b: { b: 33 }, c: { e: { lekker: 'pies', meow: 'cat' } } })
    expect(assignDefaults({ a: { b: 'c' } }, { a: { d: 'e' } })).toEqual({ a: { b: 'c', d: 'e' } })
  })

  test('should not be equal to reference', () => {
    expect(x.a).not.toBe(a)
    expect(x.b).not.toBe(b)
  })

  test('should return an empty object when the first arg is null.', () => {
    expect(assignDefaults(null)).toEqual({})
  })

  test('should assign date objects', () => {
    const date1 = new Date()
    const date2 = new Date()
    const defaultValue = { a: date1 }
    expect(assignDefaults({ b: date2 }, defaultValue)).toEqual({ a: date1, b: date2 })
  })
})
