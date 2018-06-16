import noop from './noop'

describe('noop', () => {
  test('noop should do nothing', () => {
    expect(noop()).toBe(undefined)
    expect(noop(1)).toBe(undefined)
    expect(noop({})).toBe(undefined)
    expect(noop([])).toBe(undefined)
    expect(noop([], 1, 'test')).toBe(undefined)
    expect(() => noop([], 1, 'test')).not.toThrow()
  })
})
