import * as React from 'react'
import { FormProvider } from './sharedTypes'
import { useSafeContext } from './useSafeContext'

function createHooks<F extends object>(context: React.Context<FormProvider<F> | Symbol>) {
  function useYaflContext() {
    return useSafeContext(context)
  }
  return { useYaflContext }
}

export default createHooks
