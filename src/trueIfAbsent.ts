function trueIfAbsent(val: any) {
  const nullOrUndefined = val === undefined || val === null
  return nullOrUndefined || !!val
}

export default trueIfAbsent
