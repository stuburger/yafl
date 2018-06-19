import required from './isRequired'

const formUntouchedInvalid = {
  name: {
    value: '',
    initialValue: '',
    defaultValue: '',
    visited: false,
    touched: false
  },
  age: {
    value: 0,
    initialValue: 0,
    defaultValue: 0,
    visited: false,
    touched: false
  },
  surname: {
    value: '',
    initialValue: '',
    defaultValue: '',
    visited: false,
    touched: false
  },
  gender: {
    value: '',
    initialValue: '',
    defaultValue: '',
    visited: false,
    touched: false
  },
  contact: {
    value: {
      tel: ''
    },
    initialValue: {
      tel: ''
    },
    defaultValue: {
      tel: ''
    },
    visited: false,
    touched: false
  },
  favorites: {
    value: [],
    initialValue: [],
    defaultValue: [],
    visited: false,
    touched: false
  }
}
const formTouchedInvalid = {
  name: {
    value: '',
    initialValue: '',
    defaultValue: '',
    visited: true,
    touched: true
  },
  age: {
    value: 0,
    initialValue: 0,
    defaultValue: 0,
    visited: true,
    touched: true
  },
  surname: {
    value: '',
    initialValue: '',
    defaultValue: '',
    visited: true,
    touched: true
  },
  gender: {
    value: '',
    initialValue: '',
    defaultValue: '',
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
    defaultValue: {
      tel: ''
    },
    visited: true,
    touched: true
  },
  favorites: {
    value: [],
    initialValue: [],
    defaultValue: [],
    visited: true,
    touched: true
  }
}

const formTouchedValid = {
  name: {
    value: 'stuart',
    initialValue: 'stuart',
    defaultValue: '',
    visited: true,
    touched: true
  },
  age: {
    value: 30,
    initialValue: 30,
    defaultValue: 0,
    visited: true,
    touched: true
  },
  surname: {
    value: 'Bourhill',
    initialValue: 'Bourhill',
    defaultValue: '',
    visited: true,
    touched: true
  },
  gender: {
    value: 'male',
    initialValue: 'male',
    defaultValue: '',
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
    defaultValue: {
      tel: '0786656565'
    },
    visited: true,
    touched: true
  },
  favorites: {
    value: ['books', 'rock n roll'],
    initialValue: ['books', 'rock n roll'],
    defaultValue: [],
    visited: true,
    touched: true
  }
}

describe('required validator correctly validates field', () => {
  const validate1 = required<any>()
  const validate2 = required<any>('abcdefg')

  describe('valid results return undefinded', () => {
    test('invalid because form is invalid', () => {
      expect(validate1(formUntouchedInvalid.name.value, 'name')).toBe('name is required')
      expect(validate1(formUntouchedInvalid.surname.value, 'surname')).toBe('surname is required')
      expect(validate1(formUntouchedInvalid.gender.value, 'gender')).toBe('gender is required')
    })

    test('valid because form is touched and valid', () => {
      expect(validate1(formTouchedValid.name.value, 'name')).toBe(undefined)
      expect(validate1(formTouchedValid.surname.value, 'surname')).toBe(undefined)
      expect(validate1(formTouchedValid.gender.value, 'gender')).toBe(undefined)
    })
  })

  test('calling required validator on invalid fields returns default message', () => {
    expect(validate1(formTouchedInvalid.name.value, 'name')).toBe('name is required')
    expect(validate1(formTouchedInvalid.surname.value, 'surname')).toBe('surname is required')
    expect(validate1(formTouchedInvalid.gender.value, 'gender')).toBe('gender is required')
  })

  test('calling required validator on invalid fields return custom message', () => {
    expect(validate2(formTouchedInvalid.name.value, 'name')).toBe('abcdefg')
    expect(validate2(formTouchedInvalid.surname.value, 'surname')).toBe('abcdefg')
    expect(validate2(formTouchedInvalid.gender.value, 'gender')).toBe('abcdefg')
  })
})
