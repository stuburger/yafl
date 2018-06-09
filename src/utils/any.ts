import { isObject } from './checkType'

export interface EquityComparer {
  (a: any, b: any): boolean
}

const any = (obj: any, value: boolean | null | string | number): boolean => {
  if (!isObject(obj)) {
    return obj === value
  }

  // if the object is an array or an object
  let ret: boolean = false
  for (let key in obj) {
    ret = any(obj[key], value)
    if (ret) break
  }

  return ret
  // then iterate over the array, check if the same is true of its children
  // otherwise compare for equality
}

export default any
