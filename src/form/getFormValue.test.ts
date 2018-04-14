import getFormValue from './getFormValue'

const formState1 = {
  name: {
    value: 'stuart',
    originalValue: 'stuart',
    didBlur: false,
    touched: false
  },
  age: {
    value: 30,
    originalValue: 30,
    didBlur: false,
    touched: false
  },
  gender: {
    value: 'male',
    originalValue: 'male',
    didBlur: false,
    touched: false
  },
  contact: {
    value: {
      tel: '0786656565'
    },
    originalValue: {
      tel: '0786656565'
    },
    didBlur: false,
    touched: false
  },
  favorites: {
    value: ['books', 'rock n roll'],
    originalValue: ['books', 'rock n roll'],
    didBlur: false,
    touched: false
  }
}

const expectedResult1 = {
  name: 'stuart',
  age: 30,
  gender: 'male',
  contact: {
    tel: '0786656565'
  },
  favorites: ['books', 'rock n roll']
}

describe('getFormValue function', () => {
  const testResult1 = getFormValue(formState1)
  test('should correctly convert form state to the actual value of the form', () => {
    expect(testResult1).toEqual(expectedResult1)
  })

  test('value should not contain references to form state values', () => {
    expect(testResult1.contact).not.toBe(expectedResult1.contact)
    expect(testResult1.favorites).not.toBe(expectedResult1.favorites)
  })
})
