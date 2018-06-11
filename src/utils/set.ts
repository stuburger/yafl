import get from 'lodash.get'
import set from 'lodash.set'
import unset from 'lodash.unset'
import cloneDeep from 'lodash.clonedeep'
import { Path } from '../sharedTypes'
import { isArray } from './checkType'
import immutable from 'object-path-immutable'

export function s<T extends object>(obj: T, path: Path, val: any): T {
  return immutable.set(obj, path as string[], val)
}

export function us<T extends object>(obj: T, path: Path): T {
  const pathToParent = path.slice(0, path.length - 1)
  const value = get(obj, pathToParent)
  const ret = cloneDeep(obj)
  // if the parent object is an array - we want to remove that element
  // unset will just assign the value undefined to that array position
  if (isArray(value)) {
    const last = path[path.length - 1] as number
    set(ret, pathToParent, value.splice(0, last))
  } else {
    unset(ret, path)
  }
  return ret
}
