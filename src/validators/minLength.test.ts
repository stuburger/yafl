import minLength from './minLength'
import { FormFieldState } from '../sharedTypes'
import { Person } from '../sharedTypes'

const formTouchedInvalid: FormFieldState<Person> = {
  name: {
    value: 'j',
    originalValue: 'j',
    defaultValue: '',
    didBlur: true,
    touched: true
  },
  age: {
    value: 0,
    originalValue: 0,
    defaultValue: 0,
    didBlur: true,
    touched: true
  },
  surname: {
    value: 'b',
    originalValue: 'b',
    defaultValue: '',
    didBlur: true,
    touched: true
  },
  gender: {
    value: 'f',
    originalValue: 'f',
    defaultValue: '',
    didBlur: true,
    touched: true
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
    didBlur: true,
    touched: true
  },
  favorites: {
    value: [],
    originalValue: [],
    defaultValue: [],
    didBlur: true,
    touched: true
  }
}

const formTouchedValid: FormFieldState<Person> = {
  name: {
    value: 'st',
    originalValue: 'stuart',
    defaultValue: '',
    didBlur: true,
    touched: true
  },
  age: {
    value: 30,
    originalValue: 30,
    defaultValue: 0,
    didBlur: true,
    touched: true
  },
  surname: {
    value: 'Bou',
    originalValue: 'Bourhill',
    defaultValue: '',
    didBlur: true,
    touched: true
  },
  gender: {
    value: 'male',
    originalValue: 'male',
    defaultValue: '',
    didBlur: true,
    touched: true
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
    didBlur: true,
    touched: true
  },
  favorites: {
    value: ['books', 'rock n roll'],
    originalValue: ['books', 'rock n roll'],
    defaultValue: [],
    didBlur: true,
    touched: true
  }
}

const badValuesForm = {
  name: {
    value: '',
    originalValue: null,
    defaultValue: null,
    didBlur: true,
    touched: true
  },
  age: {
    value: 30,
    originalValue: 30,
    defaultValue: 0,
    didBlur: true,
    touched: true
  },
  surname: {
    value: null,
    originalValue: null,
    defaultValue: null,
    didBlur: true,
    touched: true
  },
  gender: {
    value: '',
    originalValue: null,
    defaultValue: null,
    didBlur: true,
    touched: true
  },
  contact: {
    value: {
      tel: null
    },
    originalValue: null,
    defaultValue: null,
    didBlur: true,
    touched: true
  },
  favorites: {
    value: null,
    originalValue: null,
    defaultValue: null,
    didBlur: true,
    touched: true
  }
}

describe('minLength validator correctly validates field', () => {
  const validate1 = minLength<any>(2)
  const validate2 = minLength<any>(2, 'abcdefg')

  describe('valid results return undefinded', () => {
    test('valid because form is touched and valid', () => {
      expect(validate1(formTouchedValid.name.value, formTouchedValid, 'name')).toBe(undefined)
      expect(validate1(formTouchedValid.surname.value, formTouchedValid, 'surname')).toBe(undefined)
      expect(validate1(formTouchedValid.gender.value, formTouchedValid, 'gender')).toBe(undefined)
    })
  })

  test('calling minLength validator on invalid fields returns default message', () => {
    expect(validate1(formTouchedInvalid.name.value, formTouchedInvalid, 'name')).toBe(
      'name should be at least 2 characters'
    )
    expect(validate1(formTouchedInvalid.surname.value, formTouchedInvalid, 'surname')).toBe(
      'surname should be at least 2 characters'
    )
    expect(validate1(formTouchedInvalid.gender.value, formTouchedInvalid, 'gender')).toBe(
      'gender should be at least 2 characters'
    )
  })

  test('calling minLength validator on invalid fields return custom message', () => {
    expect(validate2(formTouchedInvalid.name.value, formTouchedInvalid, 'name')).toBe('abcdefg')
    expect(validate2(formTouchedInvalid.surname.value, formTouchedInvalid, 'surname')).toBe(
      'abcdefg'
    )
    expect(validate2(formTouchedInvalid.gender.value, formTouchedInvalid, 'gender')).toBe('abcdefg')
  })

  describe('calling minLength on null or undefined values', () => {
    test('should not throw exceptions', () => {
      expect(() => validate1(badValuesForm.name.value, badValuesForm, 'name')).not.toThrow()
      expect(() => validate1(badValuesForm.surname.value, badValuesForm, 'surname')).not.toThrow()
      expect(() => validate1(badValuesForm.gender.value, badValuesForm, 'gender')).not.toThrow()
    })

    test('should return correct invalid message', () => {
      expect(validate1(badValuesForm.name.value, badValuesForm, 'name')).toBe(
        'name should be at least 2 characters'
      )
      expect(validate1(badValuesForm.surname.value, badValuesForm, 'surname')).toBe(
        'surname should be at least 2 characters'
      )
      expect(validate1(badValuesForm.gender.value, badValuesForm, 'gender')).toBe(
        'gender should be at least 2 characters'
      )
    })
  })
})
