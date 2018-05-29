import { cloneDeep, set, unset } from 'lodash'
import { Path } from '../sharedTypes'

export function s<T extends object>(obj: T, path: Path, val: any): T {
  return set(cloneDeep(obj), path, val)
}

export function us<T extends object>(obj: T, path: Path): T {
  const ret = cloneDeep(obj)
  unset(ret, path)
  return ret
}
