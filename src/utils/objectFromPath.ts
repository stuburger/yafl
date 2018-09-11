import get from 'lodash.get'
import immutable from 'object-path-immutable'
export default function<F extends object>(obj: F, paths: string[]): F {
  return paths.reduce((ret, path) => immutable.set(ret, path, get(obj, path)), {} as F)
}
