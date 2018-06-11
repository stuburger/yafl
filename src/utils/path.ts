import { isString, isArray } from './checkType'
import { Path } from '../sharedTypes'

export default (path: Path): string => {
  if (isArray(path)) {
    return path.join('.')
  } else if (isString(path)) {
    return path
  } else {
    throw new Error('path prop should be of type string or string[]')
  }
}
