import invariant from 'invariant'

export default (name: any) => {
  const isString = typeof name === 'string' && name.length > 0
  const isValidA = isString || Number.isInteger(name)
  invariant(isValidA, "Expected string | number for the 'name' prop")
  if (isString) {
    invariant(!name.includes('.'), "'name' prop cannot be a path string. " + name + ' is invalid')
  }
}
