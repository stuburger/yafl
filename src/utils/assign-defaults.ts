import { isObject } from './checkType'

function baseAssign(target: any, source: any) {
  target = target || (Array.isArray(source) ? [] : {})
  const sourceKeys = Object.keys(source)
  return sourceKeys.reduce((ret: any, key: any) => {
    if (target[key] === undefined) {
      if (isObject(source[key])) {
        if (source[key] instanceof Date) {
          ret[key] = source[key]
        } else {
          ret[key] = baseAssign(Array.isArray(source[key]) ? [] : {}, source[key])
        }
      } else {
        ret[key] = source[key]
      }
    } else if (isObject(source[key])) {
      ret[key] = baseAssign(target[key], source[key])
    } else {
      ret[key] = target[key]
    }
    return ret
  }, target)
}

export default function assignDefaults(target: any, ...sources: any[]) {
  target = target || {}
  return sources.reduce((ret, obj) => {
    return baseAssign(ret, obj)
  }, target)
}
