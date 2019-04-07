import * as React from 'react'
import PropTypes from 'prop-types'
import { PropForwarderConfig, CombinedContexts } from './sharedTypes'
import { isObject } from './utils'
import { useSafeContext } from './useSafeContext'
import warning from 'tiny-warning'
import { BRANCH_MODE_WARNING } from './warnings'

function createForwardProps<F extends object>(context: CombinedContexts<F>) {
  const { Provider } = context.state
  function ForwardProps(props: PropForwarderConfig<F>) {
    const [yafl] = useSafeContext(context)

    const value = { ...yafl }
    const { children, mode, ...rest } = props
    if (mode === 'branch') {
      if (process.env.NODE_ENV !== 'production') {
        warning(Object.keys(rest).every(key => isObject(rest[key])), BRANCH_MODE_WARNING)
      }
      // value.branchProps = { ...value.branchProps, ...rest }
    }
    // else {
    //   value.sharedProps = { ...value.sharedProps, ...rest }
    // }
    return <Provider value={value}>{children}</Provider>
  }

  ForwardProps.defaultProps = {
    mode: 'default'
  }

  ForwardProps.propTypes /* remove-proptypes */ = {
    mode: PropTypes.oneOf(['default', 'branch']),
    children: PropTypes.node
  }

  return ForwardProps
}

export default createForwardProps
