import * as _ from 'lodash'
import { Path } from '../sharedTypes'
import { isArray } from './checkType'
// import shallowCopy from './shallowCopy'

export function s<T extends object>(obj: T, path: Path, val: any): T {
  return _.set(_.cloneDeep(obj), path, val)
}

export function us<T extends object>(obj: T, path: Path): T {
  const pathToParent = path.slice(0, path.length - 1)
  const value = _.get(obj, pathToParent)
  const ret = _.cloneDeep(obj)
  // if the parent object is an aray - we want to remove that element
  // unset will just assign the value undefined to that array position
  if (isArray(value)) {
    const last = path[path.length - 1] as number
    _.set(ret, pathToParent, value.splice(0, last))
  } else {
    _.unset(ret, path)
  }
  return ret
}
