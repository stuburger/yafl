import minLength from './minLength'
// import { FormFieldState } from '../sharedTypes'
// import { Person } from '../sharedTypes'

const formTouchedInvalid: any = {
  name: {
    value: 'j',
    initialValue: 'j',
    visited: true,
    touched: true
  },
  age: {
    value: 0,
    initialValue: 0,
    visited: true,
    touched: true
  },
  surname: {
    value: 'b',
    initialValue: 'b',
    visited: true,
    touched: true
  },
  gender: {
    value: 'f',
    initialValue: 'f',
    visited: true,
    touched: true
  },
  contact: {
    value: {
      tel: ''
    },
    initialValue: {
      tel: ''
    },
    visited: true,
    touched: true
  },
  favorites: {
    value: [],
    initialValue: [],
    visited: true,
    touched: true
  }
}

// const formTouchedValid: FormFieldState<Person> = {
const formTouchedValid: any = {
  name: {
    value: 'st',
    initialValue: 'stuart',
    visited: true,
    touched: true
  },
  age: {
    value: 30,
    initialValue: 30,
    visited: true,
    touched: true
  },
  surname: {
    value: 'Bou',
    initialValue: 'Bourhill',
    visited: true,
    touched: true
  },
  gender: {
    value: 'male',
    initialValue: 'male',
    visited: true,
    touched: true
  },
  contact: {
    value: {
      tel: '0786656565'
    },
    initialValue: {
      tel: '0786656565'
    },
    visited: true,
    touched: true
  },
  favorites: {
    value: ['books', 'rock n roll'],
    initialValue: ['books', 'rock n roll'],
    visited: true,
    touched: true
  }
}

const badValuesForm = {
  name: {
    value: '',
    initialValue: null,
    visited: true,
    touched: true
  },
  age: {
    value: 30,
    initialValue: 30,
    visited: true,
    touched: true
  },
  surname: {
    value: null,
    initialValue: null,
    visited: true,
    touched: true
  },
  gender: {
    value: '',
    initialValue: null,
    visited: true,
    touched: true
  },
  contact: {
    value: {
      tel: null
    },
    initialValue: null,
    visited: true,
    touched: true
  },
  favorites: {
    value: null,
    initialValue: null,
    visited: true,
    touched: true
  }
}

describe('minLength validator correctly validates field', () => {
  const validate1 = minLength<any>(2)
  const validate2 = minLength<any>(2, 'abcdefg')

  describe('valid results return undefinded', () => {
    test('valid because form is touched and valid', () => {
      expect(validate1(formTouchedValid.name.value, 'name')).toBe(undefined)
      expect(validate1(formTouchedValid.surname.value, 'surname')).toBe(undefined)
      expect(validate1(formTouchedValid.gender.value, 'gender')).toBe(undefined)
    })
  })

  test('calling minLength validator on invalid fields returns default message', () => {
    expect(validate1(formTouchedInvalid.name.value, 'name')).toBe(
      'name should be at least 2 characters'
    )
    expect(validate1(formTouchedInvalid.surname.value, 'surname')).toBe(
      'surname should be at least 2 characters'
    )
    expect(validate1(formTouchedInvalid.gender.value, 'gender')).toBe(
      'gender should be at least 2 characters'
    )
  })

  test('calling minLength validator on invalid fields return custom message', () => {
    expect(validate2(formTouchedInvalid.name.value, 'name')).toBe('abcdefg')
    expect(validate2(formTouchedInvalid.surname.value, 'surname')).toBe('abcdefg')
    expect(validate2(formTouchedInvalid.gender.value, 'gender')).toBe('abcdefg')
  })

  describe('calling minLength on null or undefined values', () => {
    test('should not throw exceptions', () => {
      expect(() => validate1(badValuesForm.name.value, 'name')).not.toThrow()
      expect(() => validate1(badValuesForm.surname.value, 'surname')).not.toThrow()
      expect(() => validate1(badValuesForm.gender.value, 'gender')).not.toThrow()
    })

    test('should return correct invalid message', () => {
      expect(validate1(badValuesForm.name.value, 'name')).toBe(
        'name should be at least 2 characters'
      )
      expect(validate1(badValuesForm.surname.value, 'surname')).toBe(
        'surname should be at least 2 characters'
      )
      expect(validate1(badValuesForm.gender.value, 'gender')).toBe(
        'gender should be at least 2 characters'
      )
    })
  })
})
