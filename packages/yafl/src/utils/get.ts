import { isObject } from './checkType'

function baseGet<F>(obj: any, path: Path): F | undefined {
  let curr = obj
  let index = 0
  const len = path.length

  while (curr && index < len) {
    curr = curr[path[index]]
    index += 1
  }

  return index && index === len ? curr : undefined
}

export default function get<F>(obj: {}, path: string, def?: any): F {
  if (!isObject(obj)) return def

  const split = typeof path === 'string' ? path.split('.') : path
  const result = baseGet<F>(obj, split)
  return result === undefined ? def : result
}
