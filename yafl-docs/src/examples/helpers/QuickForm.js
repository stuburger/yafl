import React from 'react'
import { connect } from 'yafl'

const QuickForm = connect(({ yafl, children }) => (
  <form
    onSubmit={e => {
      yafl.submit()
      e.preventDefault()
    }}
  >
    {children}
  </form>
))

export default QuickForm