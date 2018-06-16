import path from './path'

describe('it should convert return a string path', () => {
  test('string paths should not change', () => {
    expect(path('a.b.c.d.e.f.g')).toEqual('a.b.c.d.e.f.g')
  })
  test('array paths are correctly converted to string paths', () => {
    expect(path([1, 'a'])).toEqual('1.a')
    expect(() => path(['a', {} as any])).toThrow(
      'path prop should be of type string | number | (string | number)[]'
    )
    expect(path(['a', 'b', 'c', 'd', 'e', 'f', 'g'])).toEqual('a.b.c.d.e.f.g')
  })
})
