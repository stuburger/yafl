import minLength from './minLength'

const formUntouchedInvalid = {
  name: {
    value: 'S',
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
    value: 'B',
    originalValue: '',
    didBlur: false,
    touched: false
  },
  gender: {
    value: 'M',
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
    value: 'j',
    originalValue: 'j',
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
    value: 'b',
    originalValue: 'b',
    didBlur: true,
    touched: true
  },
  gender: {
    value: 'f',
    originalValue: 'f',
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
    value: 'st',
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
    value: 'Bou',
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

const badValuesForm = {
  name: {
    value: null,
    originalValue: null,
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
    value: null,
    originalValue: null,
    didBlur: true,
    touched: true
  },
  gender: {
    value: null,
    originalValue: null,
    didBlur: true,
    touched: true
  },
  contact: {
    value: {
      tel: null
    },
    originalValue: null,
    didBlur: true,
    touched: true
  },
  favorites: {
    value: null,
    originalValue: null,
    didBlur: true,
    touched: true
  }
}

describe('minLength validator correctly validates field', () => {
  const validate1 = minLength<any>(2)
  const validate2 = minLength<any>(2, 'abcdefg')

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

  test('calling minLength validator on invalid fields returns default message', () => {
    expect(validate1(formTouchedInvalid.name, formTouchedInvalid, 'name')).toBe(
      'name should be at least 2 characters'
    )
    expect(validate1(formTouchedInvalid.surname, formTouchedInvalid, 'surname')).toBe(
      'surname should be at least 2 characters'
    )
    expect(validate1(formTouchedInvalid.gender, formTouchedInvalid, 'gender')).toBe(
      'gender should be at least 2 characters'
    )
  })

  test('calling minLength validator on invalid fields return custom message', () => {
    expect(validate2(formTouchedInvalid.name, formTouchedInvalid, 'name')).toBe('abcdefg')
    expect(validate2(formTouchedInvalid.surname, formTouchedInvalid, 'surname')).toBe('abcdefg')
    expect(validate2(formTouchedInvalid.gender, formTouchedInvalid, 'gender')).toBe('abcdefg')
  })

  describe('calling minLength on null or undefined values', () => {
    test('should not throw exceptions', () => {
      expect(() => validate1(badValuesForm.name, badValuesForm, 'name')).not.toThrow()
      expect(() => validate1(badValuesForm.surname, badValuesForm, 'surname')).not.toThrow()
      expect(() => validate1(badValuesForm.gender, badValuesForm, 'gender')).not.toThrow()
    })

    test('should return correct invalid message', () => {
      expect(validate1(badValuesForm.name, badValuesForm, 'name')).toBe(
        'name should be at least 2 characters'
      )
      expect(validate1(badValuesForm.surname, badValuesForm, 'surname')).toBe(
        'surname should be at least 2 characters'
      )
      expect(validate1(badValuesForm.gender, badValuesForm, 'gender')).toBe(
        'gender should be at least 2 characters'
      )
    })
  })
})
