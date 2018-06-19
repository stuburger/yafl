import maxLength from './maxLength'

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
    value: 'jacasdifasldfjalsdkjf',
    initialValue: 'jackie',
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
    value: 'bourhill',
    initialValue: 'bourhill',
    defaultValue: '',
    visited: true,
    touched: true
  },
  gender: {
    value: 'female',
    initialValue: 'female',
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
    value: 'stu',
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
    value: 'Burg',
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
      tel: ''
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

const badValuesForm = {
  name: {
    value: null,
    initialValue: null,
    defaultValue: null,
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
    value: null,
    initialValue: null,
    defaultValue: null,
    visited: true,
    touched: true
  },
  gender: {
    value: null,
    initialValue: null,
    defaultValue: null,
    visited: true,
    touched: true
  },
  contact: {
    value: {
      tel: null
    },
    initialValue: null,
    defaultValue: null,
    visited: true,
    touched: true
  },
  favorites: {
    value: null,
    initialValue: null,
    defaultValue: null,
    visited: true,
    touched: true
  }
}

describe('maxLength validator correctly validates field', () => {
  const validate1 = maxLength<any>(5)
  const validate2 = maxLength<any>(5, 'abcdefg')

  describe('valid results return undefinded', () => {
    test('valid because form is untouched', () => {
      expect(validate1(formUntouchedInvalid.name.value, 'name')).toBe(undefined)
      expect(validate1(formUntouchedInvalid.surname.value, 'surname')).toBe(undefined)
      expect(validate1(formUntouchedInvalid.gender.value, 'gender')).toBe(undefined)
    })

    test('valid because form is touched and valid', () => {
      expect(validate1(formTouchedValid.name.value, 'name')).toBe(undefined)
      expect(validate1(formTouchedValid.surname.value, 'surname')).toBe(undefined)
      expect(validate1(formTouchedValid.gender.value, 'gender')).toBe(undefined)
    })
  })

  test('calling maxLength validator on invalid fields returns default message', () => {
    expect(validate1(formTouchedInvalid.name.value, 'name')).toBe(
      'name should not be longer than 5 characters'
    )
    expect(validate1(formTouchedInvalid.surname.value, 'surname')).toBe(
      'surname should not be longer than 5 characters'
    )
    expect(validate1(formTouchedInvalid.gender.value, 'gender')).toBe(
      'gender should not be longer than 5 characters'
    )
  })

  test('calling maxLength validator on invalid fields return custom message', () => {
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
      expect(validate1(badValuesForm.name.value, 'name')).toBe(undefined)
      expect(validate1(badValuesForm.surname.value, 'surname')).toBe(undefined)
      expect(validate1(badValuesForm.gender.value, 'gender')).toBe(undefined)
    })
  })
})
