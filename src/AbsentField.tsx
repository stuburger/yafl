import * as React from 'react'

export interface AbsentFieldProps {
  name?: string
  message?: string
}

const AbsentField: React.SFC<AbsentFieldProps> = ({ name, message }) => {
  if (message) {
    return <span>message</span>
  } else {
    return <span>Fielp with name '{name}' does not exist.</span>
  }
}

export default AbsentField
