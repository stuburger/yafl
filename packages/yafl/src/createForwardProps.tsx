import * as React from 'react'
import warning from 'tiny-warning'
import { FormProvider, PropForwarderConfig } from './sharedTypes'
import { isObject } from './utils'
import { useSafeContext } from './useSafeContext'
import { BRANCH_MODE_WARNING } from './warnings'

function createForwardProps<F extends object>(context: React.Context<FormProvider<F, F> | Symbol>) {
  const { Provider } = context
  function ForwardProps(props: PropForwarderConfig) {
    const yafl = useSafeContext(context)

    const value = { ...yafl }
    const { children, mode, ...rest } = props
    if (mode === 'branch') {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          Object.keys(rest).every((key) => isObject(rest[key])),
          BRANCH_MODE_WARNING
        )
      }
      value.branchProps = { ...value.branchProps, ...rest }
    } else {
      value.sharedProps = { ...value.sharedProps, ...rest }
    }
    return <Provider value={value}>{children}</Provider>
  }

  ForwardProps.defaultProps = {
    mode: 'default',
  }

  return ForwardProps
}

export default createForwardProps
