import { getFormValue, initializeState, getInitialFieldState, getStartingState } from './state'

const numberValue = {
  value: 5,
  originalValue: 5,
  didBlur: false,
  touched: false
}
const stringValue = {
  value: 'Bob',
  originalValue: 'Bob',
  didBlur: false,
  touched: false
}
const nullValue = {
  value: null,
  originalValue: null,
  didBlur: false,
  touched: false
}
const undefinedValue = {
  value: undefined,
  originalValue: undefined,
  didBlur: false,
  touched: false
}

const objectValue = {
  value: {
    name: 'stuart',
    contact: {
      tel: '0786656565'
    },
    favorites: ['books', 'rock n roll']
  },
  originalValue: {
    name: 'stuart',
    contact: {
      tel: '0786656565'
    },
    favorites: ['books', 'rock n roll']
  },
  didBlur: false,
  touched: false
}

describe('getting the initial state of a single form field with different value types', () => {
  describe('field state', () => {
    const initialState = getInitialFieldState(5)
    test('didBlur, touched should be false', () => {
      expect(initialState.didBlur).toBe(false)
      expect(initialState.touched).toBe(false)
    })
  })

  describe('primitive values', () => {
    test('number', () => {
      expect(getInitialFieldState(5)).toEqual(numberValue)
    })
    test('string', () => {
      expect(getInitialFieldState('Bob')).toEqual(stringValue)
    })
    test('null values initialized to null', () => {
      const result = getInitialFieldState(null)
      expect(result).toEqual(nullValue)
    })
    test('undefined values initialized to undefined', () => {
      const result = getInitialFieldState(undefined)
      expect(result).toEqual(undefinedValue)
    })
  })

  describe('object values', () => {
    const value = {
      name: 'stuart',
      contact: {
        tel: '0786656565'
      },
      favorites: ['books', 'rock n roll']
    }
    const result = getInitialFieldState(value)
    test('values are equal', () => {
      expect(result).toEqual(objectValue)
    })

    test('values references are not equal', () => {
      expect(value).not.toBe(result.value)
      expect(value).not.toBe(result.originalValue)
      expect(result.value).not.toBe(result.originalValue)
    })
  })
})

const formResult = {
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
    value: undefined,
    originalValue: undefined,
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

describe('getting the initial form state from the intial value supplied', () => {
  const form = {
    name: 'stuart',
    age: 30,
    gender: undefined,
    contact: {
      tel: '0786656565'
    },
    favorites: ['books', 'rock n roll']
  }

  const result = initializeState(form)
  test('form state to be initialized correctly', () => {
    expect(result).toEqual(formResult)
  })
})

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
  const testResult1 = getFormValue<any>(formState1)
  test('should correctly convert form state to the actual value of the form', () => {
    expect(testResult1).toEqual(expectedResult1)
  })

  test('value should not contain references to form state values', () => {
    expect(testResult1.contact).not.toBe(expectedResult1.contact)
    expect(testResult1.favorites).not.toBe(expectedResult1.favorites)
  })
})
