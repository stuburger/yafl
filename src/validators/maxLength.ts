function maxLength<T>(length: number, message?: string) {
  const test = function<P extends keyof T>(
    value: T[P] & (string | any[]),
    formValue: T,
    fieldName: P
  ): string | undefined {
    const val = value || ''
    if (typeof val === 'string') {
      if (val.length > length) {
        return message || `${fieldName} should not be longer than ${length} characters`
      }
    }
    return undefined
  }

  return test
}

export default maxLength
