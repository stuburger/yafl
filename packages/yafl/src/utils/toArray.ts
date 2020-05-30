import { isNullOrUndefined } from './checkType'

// creates an array out of a value.
// if an array is supplied the original array is returned
// null and undefined return an empty array
export default function toArray<T = any>(maybeArray: T | T[] | null | undefined): T[] {
  if (isNullOrUndefined(maybeArray)) {
    return []
  }
  if (Array.isArray(maybeArray)) {
    return maybeArray
  }
  return [maybeArray]
}
