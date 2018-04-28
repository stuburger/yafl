import getStartingState from './getStartingState'

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
    expect(getStartingState<any>()).toEqual(result)
  })
})
