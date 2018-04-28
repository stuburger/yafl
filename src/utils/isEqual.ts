function isEqual(val1: any, val2: any): boolean {
  return val1 === val2 || JSON.stringify(val1) === JSON.stringify(val2)
}

export default isEqual
