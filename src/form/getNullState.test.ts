import getNullState from './getNullState'

const result = {
  value: {},
  loaded: false,
  isBusy: true,
  submitting: false,
  submitCount: 0
}

describe('getNullState of form component', () => {
  test('should equal', () => {
    expect(getNullState<any>()).toEqual(result)
  })
})
