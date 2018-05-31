import * as _ from 'lodash'
import { Path } from '../sharedTypes'

export function s<T extends object>(obj: T, path: Path, val: any): T {
  return _.set(_.cloneDeep(obj), path, val)
}

export function us<T extends object>(obj: T, path: Path): T {
  const ret = _.cloneDeep(obj)
  _.unset(ret, path)
  return ret
}
