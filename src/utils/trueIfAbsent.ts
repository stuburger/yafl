import { isNullOrUndefined } from './checkType'

function trueIfAbsent(val: any) {
  const isFalsyType = isNullOrUndefined(val) || Number.isNaN(val) || val === '' || val === 0
  return isFalsyType || !!val
}

export default trueIfAbsent
