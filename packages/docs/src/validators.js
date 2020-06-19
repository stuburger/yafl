export const required = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'This field is required'
  }
  return undefined
}

export const minLength = (length) => (value) => {
  if (value && value.length < length) {
    return `This field should be at least ${length} characters.`
  }
  return undefined
}

export const min = (minVal, msg) => (value) => {
  if (value < minVal) {
    return msg || `Should be at least ${minVal}.`
  }
  return undefined
}

const EMAIL_REG_EX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const email = (msg) => (value) => {
  if (!EMAIL_REG_EX.test(value)) {
    return msg || 'Not a valid email address'
  }
  return undefined
}
