import getNullState from './getNullState'

const result = {
  fields: {},
  loaded: false,
  isBusy: false,
  submitting: false,
  submitCount: 0,
  initialValue: {}
}

describe('getNullState of form component', () => {
  test('should equal', () => {
    expect(getNullState<any>()).toEqual(result)
  })
})
