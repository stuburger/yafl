import { get, set } from 'object-path-immutable'

function objectFromPath<F extends object>(obj: F, paths: string[]): F {
  return paths.reduce((ret, path) => set(ret, path, get(obj, path)), {} as F)
}

export default objectFromPath
