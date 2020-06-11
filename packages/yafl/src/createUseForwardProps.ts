import React from 'react'
import { Name, FormProvider } from './sharedTypes'
import { useBranch } from './utils'

function createUseForwardProps(context: React.Context<FormProvider<any, any> | Symbol>) {
  function useForwardProps<TBranch extends object = {}, TShared extends object = {}>(
    name: Name
  ): [TBranch, TShared] {
    const curr = useBranch<any, any>(name, context)

    return [curr.branchProps, curr.sharedProps as TShared]
  }

  return useForwardProps
}
export default createUseForwardProps
