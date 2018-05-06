import required from './isRequired'

const formUntouchedInvalid = {
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
  surname: {
    value: '',
    originalValue: '',
    defaultValue: '',
    didBlur: false,
    touched: false
  },
  gender: {
    value: '',
    originalValue: '',
    defaultValue: '',
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
const formTouchedInvalid = {
  name: {
    value: '',
    originalValue: '',
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
    value: '',
    originalValue: '',
    defaultValue: '',
    didBlur: true,
    touched: true
  },
  gender: {
    value: '',
    originalValue: '',
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

const formTouchedValid = {
  name: {
    value: 'stuart',
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
    value: 'Bourhill',
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
      tel: '0786656565'
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

describe('required validator correctly validates field', () => {
  const validate1 = required<any>()
  const validate2 = required<any>('abcdefg')

  describe('valid results return undefinded', () => {
    test('invalid because form is invalid', () => {
      expect(validate1(formUntouchedInvalid.name, formUntouchedInvalid, 'name')).toBe(
        'name is required'
      )
      expect(validate1(formUntouchedInvalid.surname, formUntouchedInvalid, 'surname')).toBe(
        'surname is required'
      )
      expect(validate1(formUntouchedInvalid.gender, formUntouchedInvalid, 'gender')).toBe(
        'gender is required'
      )
    })

    test('valid because form is touched and valid', () => {
      expect(validate1(formTouchedValid.name, formTouchedValid, 'name')).toBe(undefined)
      expect(validate1(formTouchedValid.surname, formTouchedValid, 'surname')).toBe(undefined)
      expect(validate1(formTouchedValid.gender, formTouchedValid, 'gender')).toBe(undefined)
    })
  })

  test('calling required validator on invalid fields returns default message', () => {
    expect(validate1(formTouchedInvalid.name, formTouchedInvalid, 'name')).toBe('name is required')
    expect(validate1(formTouchedInvalid.surname, formTouchedInvalid, 'surname')).toBe(
      'surname is required'
    )
    expect(validate1(formTouchedInvalid.gender, formTouchedInvalid, 'gender')).toBe(
      'gender is required'
    )
  })

  test('calling required validator on invalid fields return custom message', () => {
    expect(validate2(formTouchedInvalid.name, formTouchedInvalid, 'name')).toBe('abcdefg')
    expect(validate2(formTouchedInvalid.surname, formTouchedInvalid, 'surname')).toBe('abcdefg')
    expect(validate2(formTouchedInvalid.gender, formTouchedInvalid, 'gender')).toBe('abcdefg')
  })
})
