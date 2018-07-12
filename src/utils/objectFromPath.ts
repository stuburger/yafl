import get from 'lodash.get'
import set from 'lodash.set'
export default function<F extends object>(obj: F, paths: string[]): F {
  return paths.reduce((ret, path) => set(ret, path, get(obj, path)), {} as F)
}
