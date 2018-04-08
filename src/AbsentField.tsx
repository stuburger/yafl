import * as React from 'react'

export interface AbsentFieldProps {
  name?: string
  message?: string
}

const AbsentField: React.SFC<AbsentFieldProps> = ({ name, message }) => {
  if (message) {
    return <span style={{ color: 'red' }}>message</span>
  } else {
    return <span style={{ color: 'red' }}>Field with name '{name}' does not exist.</span>
  }
}

export default AbsentField
