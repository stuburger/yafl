import required from './isRequired'

const formUntouchedInvalid = {
  name: {
    value: '',
    originalValue: '',
    didBlur: false,
    touched: false
  },
  age: {
    value: 0,
    originalValue: 0,
    didBlur: false,
    touched: false
  },
  surname: {
    value: '',
    originalValue: '',
    didBlur: false,
    touched: false
  },
  gender: {
    value: '',
    originalValue: '',
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
    didBlur: false,
    touched: false
  },
  favorites: {
    value: [],
    originalValue: [],
    didBlur: false,
    touched: false
  }
}
const formTouchedInvalid = {
  name: {
    value: '',
    originalValue: '',
    didBlur: true,
    touched: true
  },
  age: {
    value: 0,
    originalValue: 0,
    didBlur: true,
    touched: true
  },
  surname: {
    value: '',
    originalValue: '',
    didBlur: true,
    touched: true
  },
  gender: {
    value: '',
    originalValue: '',
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
    didBlur: true,
    touched: true
  },
  favorites: {
    value: [],
    originalValue: [],
    didBlur: true,
    touched: true
  }
}

const formTouchedValid = {
  name: {
    value: 'stuart',
    originalValue: 'stuart',
    didBlur: true,
    touched: true
  },
  age: {
    value: 30,
    originalValue: 30,
    didBlur: true,
    touched: true
  },
  surname: {
    value: 'Bourhill',
    originalValue: 'Bourhill',
    didBlur: true,
    touched: true
  },
  gender: {
    value: 'male',
    originalValue: 'male',
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
    didBlur: true,
    touched: true
  },
  favorites: {
    value: ['books', 'rock n roll'],
    originalValue: ['books', 'rock n roll'],
    didBlur: true,
    touched: true
  }
}

describe('required validator correctly validates field', () => {
  const validate1 = required<any>()
  const validate2 = required<any>('abcdefg')

  describe('valid results return undefinded', () => {
    test('valid because form is untouched', () => {
      expect(validate1(formUntouchedInvalid.name, formUntouchedInvalid, 'name')).toBe(undefined)
      expect(validate1(formUntouchedInvalid.surname, formUntouchedInvalid, 'surname')).toBe(
        undefined
      )
      expect(validate1(formUntouchedInvalid.gender, formUntouchedInvalid, 'gender')).toBe(undefined)
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
