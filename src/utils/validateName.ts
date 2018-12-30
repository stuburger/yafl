import warning from 'tiny-warning'

export default (name: any) => {
  const isString = typeof name === 'string' && name.length > 0
  const isValidA = isString || Number.isInteger(name)
  warning(isValidA, "Expected string | number for the 'name' prop")
  if (isString) {
    warning(!name.includes('.'), "'name' prop cannot be a path string. " + name + ' is invalid')
  }
}
