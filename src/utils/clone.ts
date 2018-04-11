function clone<T>(value: T): T {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value
  } else {
    return JSON.parse(JSON.stringify(value))
  }
}

export default clone
