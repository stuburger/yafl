import invariant from 'invariant'

export default (name: any) => {
  const isValid = (typeof name === 'string' && name.length > 0) || Number.isInteger(name)
  invariant(!isValid, 'Expected string | number for the name prop')
}
