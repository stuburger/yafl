import * as immutable from 'object-path-immutable'
import get from './get'

function objectFromPath<F extends object>(obj: F, paths: string[]): F {
  return paths.reduce((ret, path) => immutable.set(ret, path, get(obj, path)), {} as F)
}

export default objectFromPath
