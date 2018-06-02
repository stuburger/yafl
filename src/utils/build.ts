import * as _ from 'lodash'
import { Path } from '../sharedTypes'

export default function build<T extends object>(paths: Path[], val: any): T {
  return paths.reduce((ret, path) => {
    _.set(ret, path, val)
    return ret
  }, {}) as T
}
