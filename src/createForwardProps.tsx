import * as React from 'react'
import PropTypes from 'prop-types'
import { PropForwarderConfig, CombinedContexts } from './sharedTypes'
import { isObject } from './utils'
// import { useSafeContext } from './useSafeContext'
import warning from 'tiny-warning'
import { BRANCH_MODE_WARNING } from './warnings'

function createForwardProps<F extends object>(context: CombinedContexts<F>) {
  function ForwardProps(props: PropForwarderConfig) {
    // const { branch } = useSafeContext(context)
    const branch = React.useContext(context.branch)
    const { children, ...rest } = props
    if (process.env.NODE_ENV !== 'production') {
      warning(Object.keys(rest).every(key => isObject(rest[key])), BRANCH_MODE_WARNING)
    }

    const branchedValues = { ...branch, ...rest }

    return <context.branch.Provider value={branchedValues}>{children}</context.branch.Provider>
  }

  ForwardProps.propTypes /* remove-proptypes */ = {
    children: PropTypes.node
  }

  return ForwardProps
}

export default createForwardProps
