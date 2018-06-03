// function isEqual(val1: any, val2: any): boolean {
//   return val1 === val2 || JSON.stringify(val1) === JSON.stringify(val2)
// }

// export default isEqual

import * as React from 'react'
import * as _ from 'lodash'

const customizer = (obj: any, other: any): any => {
  if (obj === other) return true

  if (!obj && !other) {
    const objIsEmpty = obj === null || obj === undefined || obj === ''
    const otherIsEmpty = other === null || other === undefined || other === ''
    return objIsEmpty === otherIsEmpty
  }

  if (obj && other && obj._error !== other._error) return false
  if (obj && other && obj._warning !== other._warning) return false
  if (React.isValidElement(obj) || React.isValidElement(other)) return false
}

const deepEqual = (a: any, b: any) => _.isEqualWith(a, b, customizer)

export default deepEqual
