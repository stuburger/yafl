import incl from './includes'

describe('includes', () => {
  test('it should return true', () => {
    expect(incl('change', 'change')).toEqual(true)
    expect(incl(['change'], 'change')).toEqual(true)
    expect(incl(['change', 'blur'], 'change')).toEqual(true)
    expect(incl(['change', 'blur'], 'blur')).toEqual(true)
    expect(incl(['change', 'blur', 'submit'], 'submit')).toEqual(true)
    expect(incl('submit', 'submit')).toEqual(true)
  })
  test('it should return false', () => {
    expect(incl('change', 'blur')).toEqual(false)
    expect(incl(['change'], 'submit')).toEqual(false)
    expect(incl(['change', 'blur'], 'submit')).toEqual(false)
    expect(incl(['submit', 'blur'], 'change')).toEqual(false)
    expect(incl([], 'submit')).toEqual(false)
  })

  test('it should throw invalid argument error', () => {
    expect(() => incl({} as any, 'submit')).toThrow('invalid argument')
    expect(() => incl(4 as any, 'change')).toThrow('invalid argument')
    expect(() => incl(true as any, 'change')).toThrow('invalid argument')
  })
})
