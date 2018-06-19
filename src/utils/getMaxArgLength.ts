import toArray from './toArray'

export const getMaxArgLength = (func?: Function | Function[]) => {
  return toArray(func).reduce<number>((max, f) => Math.max(max, getArgLength(f)), 0)
}

export const getArgLength = (maybeFunc: any) => {
  if (typeof maybeFunc === 'function') {
    return maybeFunc.length
  }
  return 0
}
