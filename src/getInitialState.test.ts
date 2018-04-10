// const sum = require('./getInitialState');
import getInitialState, { getInitialFieldState } from './getInitialState'

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
    test('undefined values initialized to null', () => {
      const result = getInitialFieldState()
      expect(result).toEqual(nullValue)
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
    value: null,
    originalValue: null,
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

  const result = getInitialState(form)
  test('form state to be initialized correctly', () => {
    expect(result).toEqual(formResult)
  })
})
