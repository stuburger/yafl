import maxLength from './maxLength'

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
    value: 'jacasdifasldfjalsdkjf',
    originalValue: 'jackie',
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
    value: 'bourhill',
    originalValue: 'bourhill',
    defaultValue: '',
    didBlur: true,
    touched: true
  },
  gender: {
    value: 'female',
    originalValue: 'female',
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
    value: 'stu',
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
    value: 'Burg',
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
    value: null,
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
    value: null,
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

describe('maxLength validator correctly validates field', () => {
  const validate1 = maxLength<any>(5)
  const validate2 = maxLength<any>(5, 'abcdefg')

  describe('valid results return undefinded', () => {
    test('valid because form is untouched', () => {
      expect(validate1(formUntouchedInvalid.name.value, formUntouchedInvalid, 'name')).toBe(
        undefined
      )
      expect(validate1(formUntouchedInvalid.surname.value, formUntouchedInvalid, 'surname')).toBe(
        undefined
      )
      expect(validate1(formUntouchedInvalid.gender.value, formUntouchedInvalid, 'gender')).toBe(
        undefined
      )
    })

    test('valid because form is touched and valid', () => {
      expect(validate1(formTouchedValid.name.value, formTouchedValid, 'name')).toBe(undefined)
      expect(validate1(formTouchedValid.surname.value, formTouchedValid, 'surname')).toBe(undefined)
      expect(validate1(formTouchedValid.gender.value, formTouchedValid, 'gender')).toBe(undefined)
    })
  })

  test('calling maxLength validator on invalid fields returns default message', () => {
    expect(validate1(formTouchedInvalid.name.value, formTouchedInvalid, 'name')).toBe(
      'name should not be longer than 5 characters'
    )
    expect(validate1(formTouchedInvalid.surname.value, formTouchedInvalid, 'surname')).toBe(
      'surname should not be longer than 5 characters'
    )
    expect(validate1(formTouchedInvalid.gender.value, formTouchedInvalid, 'gender')).toBe(
      'gender should not be longer than 5 characters'
    )
  })

  test('calling maxLength validator on invalid fields return custom message', () => {
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
      expect(validate1(badValuesForm.name.value, badValuesForm, 'name')).toBe(undefined)
      expect(validate1(badValuesForm.surname.value, badValuesForm, 'surname')).toBe(undefined)
      expect(validate1(badValuesForm.gender.value, badValuesForm, 'gender')).toBe(undefined)
    })
  })
})
