function isNullOrUndefined(val: any): boolean {
  return val === undefined || val === null
}

function isNaN(val: any): boolean {
  return val !== val
}

function trueIfAbsent(val: any) {
  const isFalsyType = isNullOrUndefined(val) || isNaN(val) || val === '' || val === 0
  return isFalsyType || !!val
}

export default trueIfAbsent
