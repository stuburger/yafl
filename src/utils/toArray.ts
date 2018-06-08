import { isNullOrUndefined, isArray } from './checkType'

// creates an array out of a value.
// if an array is supplied the original array is returned
// null and undefined return an empty array
export default function<T = any>(maybeArray: T | T[] | null | undefined): T[] {
  if (isNullOrUndefined(maybeArray)) {
    return []
  }
  if (isArray(maybeArray)) {
    return maybeArray
  }
  return [maybeArray]
}
