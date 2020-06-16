import React from 'react'
import { Name, FormProvider } from './sharedTypes'
import { useBranch } from './utils'

function createUseDelivery(context: React.Context<FormProvider<any, any> | Symbol>) {
  function useDelivery<TBranch extends object = {}, TShared extends object = {}>(
    name: Name
  ): [TBranch, TShared] {
    const { branchProps, sharedProps } = useBranch<any, any>(name, context)
    return [branchProps, sharedProps as TShared]
  }

  return useDelivery
}
export default createUseDelivery
