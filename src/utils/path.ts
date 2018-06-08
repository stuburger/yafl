import { isArray } from './checkType'
import { isString } from 'util'
import { Path } from '../sharedTypes'

export function toString(path: Path): string {
  if (isArray(path)) {
    return path.join('.')
  } else if (isString(path)) {
    return path
  } else {
    throw new Error('path prop should be of type string or string[]')
  }
}

export function toArray(path: string): Path {
  if (isArray(path)) {
    return path
  } else if (isString(path)) {
    return path.split('.')
  } else {
    throw new Error('path prop should be of type string or string[]')
  }
}
