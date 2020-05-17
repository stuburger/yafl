import get from './get'

describe('get', () => {
  test('it should return the correct value', () => {
    const obj = { a: { b: 'the correct value' } }
    expect(get(obj, ['a', 'b'])).toBe('the correct value')
    expect(get(obj, 'a.b')).toBe('the correct value')
  })

  test('it should return the right value', () => {
    const obj = {
      a: {
        b: {
          c: {
            d: [{ e: { f: ['wrong', 'wrong', 'right'] } }]
          },
          x: null
        }
      }
    }
    expect(get(obj, ['a', 'b', 'c', 'd', 0, 'e', 'f', 2])).toBe('right')
    expect(get(obj, ['a', 'b', 'c', 'd', '0', 'e', 'f', '2'])).toBe('right')
    expect(get(obj, 'a.b.c.d.0.e.f.2')).toBe('right')
    expect(get(obj, 'a.b.x')).toBe(null)
    expect(get(obj, ['a', 'b', 'x'])).toBe(null)
  })

  test('it should return undefined', () => {
    const obj = { a: { b: { c: { d: [{ e: { f: ['wrong', 'wrong', 'right'] } }] } } } }
    expect(get(obj, ['a', 'x', 'c', 'd', 0, 'e', 'f', 2])).toBe(undefined)
    expect(get(obj, ['a', 'b', 'c', 'd', '0', 'e', 'f', 77])).toBe(undefined)
    expect(get(obj, 'x.b.c.d.1.e.f.2')).toBe(undefined)
  })

  test('it should return the default value', () => {
    const obj = { a: { b: { c: { d: [{ e: { f: ['wrong', 'wrong', 'right'] } }] } } } }
    expect(get(obj, ['a', 'x', 'c', 'd', 0, 'e', 'f', 2], 'the default value')).toBe(
      'the default value'
    )
    expect(get(obj, ['a', 'b', 'c', 'd', '0', 'e', 'f', 77], 44)).toBe(44)
    expect(get(obj, 'x.b.c.d.1.e.f.2', null)).toBe(null)
  })
})
