import * as React from 'react'
import warning from 'tiny-warning'
import { FormProvider, PropForwarderConfig } from './sharedTypes'
import { isObject } from './utils'
import { useSafeContext } from './useSafeContext'
import { BRANCH_MODE_WARNING } from './warnings'

function createForwardProps<F extends object>(context: React.Context<FormProvider<F, F> | Symbol>) {
  const { Provider } = context
  function ForwardProps<TBranch extends object = {}, TShared extends object = {}>(
    props: PropForwarderConfig<TBranch, TShared>
  ) {
    const yafl = useSafeContext(context)

    const value = { ...yafl }
    const { children, branch = {} as TBranch, shared = {} } = props

    if (process.env.NODE_ENV !== 'production') {
      warning(
        (Object.keys(branch) as Array<keyof TBranch>).every((key) => isObject(branch[key])),
        BRANCH_MODE_WARNING
      )
    }

    value.branchProps = { ...value.branchProps, ...branch }
    value.sharedProps = { ...value.sharedProps, ...shared }

    return <Provider value={value}>{children}</Provider>
  }

  return ForwardProps
}

export default createForwardProps
