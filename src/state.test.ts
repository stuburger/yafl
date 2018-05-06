import {
  getFormValue,
  getFieldFromValue,
  getDefaultInitialState,
  getDefaultFormState
} from './state'

const numberValue = {
  value: 5,
  originalValue: 5,
  defaultValue: undefined,
  didBlur: false,
  touched: false
}
const stringValue = {
  value: 'Bob',
  originalValue: 'Bob',
  defaultValue: undefined,
  didBlur: false,
  touched: false
}
const nullValue = {
  value: null,
  originalValue: null,
  defaultValue: undefined,
  didBlur: false,
  touched: false
}
const undefinedValue = {
  value: undefined,
  originalValue: undefined,
  defaultValue: undefined,
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
    const initialState = getFieldFromValue(5)
    test('didBlur, touched should be false', () => {
      expect(initialState.didBlur).toBe(false)
      expect(initialState.touched).toBe(false)
    })
  })

  describe('primitive values', () => {
    test('number', () => {
      expect(getFieldFromValue(5)).toEqual(numberValue)
    })
    test('string', () => {
      expect(getFieldFromValue('Bob')).toEqual(stringValue)
    })
    test('null values initialized to null', () => {
      const result = getFieldFromValue(null)
      expect(result).toEqual(nullValue)
    })
    test('undefined values initialized to undefined', () => {
      const result = getFieldFromValue(undefined)
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
    const result = getFieldFromValue(value)
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
    value: '',
    originalValue: '',
    defaultValue: '',
    didBlur: false,
    touched: false
  },
  age: {
    value: 0,
    originalValue: 0,
    defaultValue: 0,
    didBlur: false,
    touched: false
  },
  gender: {
    value: undefined,
    originalValue: undefined,
    defaultValue: undefined,
    didBlur: false,
    touched: false
  },
  contact: {
    value: {
      tel: ''
    },
    originalValue: {
      tel: ''
    },
    defaultValue: {
      tel: ''
    },
    didBlur: false,
    touched: false
  },
  favorites: {
    value: [],
    originalValue: [],
    defaultValue: [],
    didBlur: false,
    touched: false
  }
}

describe('getting the initial form state from the intial value supplied', () => {
  const form = {
    name: '',
    age: 0,
    gender: undefined,
    contact: {
      tel: ''
    },
    favorites: []
  }

  const result = getDefaultFormState(form)
  test('form state to be initialized correctly', () => {
    expect(result).toEqual(formResult)
  })
})

const result = {
  fields: {},
  registeredFields: {},
  loaded: false,
  isBusy: false,
  submitting: false,
  submitCount: 0,
  initialValue: {}
}

describe('getNullState of form component', () => {
  test('should equal', () => {
    expect(getDefaultInitialState<any>()).toEqual(result)
  })
})

const formState1 = {
  name: {
    value: 'stuart',
    defaultValue: '',
    originalValue: 'stuart',
    didBlur: false,
    touched: false
  },
  age: {
    value: 30,
    defaultValue: 0,
    originalValue: 30,
    didBlur: false,
    touched: false
  },
  gender: {
    value: 'male',
    defaultValue: '',
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
    defaultValue: {
      tel: ''
    },
    didBlur: false,
    touched: false
  },
  favorites: {
    value: ['books', 'rock n roll'],
    originalValue: ['books', 'rock n roll'],
    defaultValue: [],
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
  const testResult1 = getFormValue<any>(formState1, {}, true)
  test('should correctly convert form state to the actual value of the form', () => {
    expect(testResult1).toEqual(expectedResult1)
  })

  test('value should not contain references to form state values', () => {
    expect(testResult1.contact).not.toBe(expectedResult1.contact)
    expect(testResult1.favorites).not.toBe(expectedResult1.favorites)
  })
})
