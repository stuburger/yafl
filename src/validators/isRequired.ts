function required<T extends object>(message?: string) {
  const test = function<P extends keyof T = keyof T>(
    value: T[P] & (string | any[]),
    fieldName: P
  ): string | undefined {
    if (!value) {
      return message || `${fieldName} is required`
    }
    return undefined
  }

  return test
}

export default required
