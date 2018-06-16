import { isString } from './checkType'
import { Path } from '../sharedTypes'

export default (path: Path | string): string => {
  if (isString(path)) {
    return path
  } else if (
    Array.isArray(path) &&
    (path as string[]).every(x => isString(x) || Number.isInteger(x))
  ) {
    return path.join('.')
  } else {
    throw new Error('path prop should be of type string | number | (string | number)[]')
  }
}
