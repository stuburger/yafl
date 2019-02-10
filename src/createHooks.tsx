import * as React from 'react'
import { FormProvider } from './sharedTypes'

function createHooks<F extends object>(context: React.Context<FormProvider<F>>) {
  function useYaflContext() {
    return React.useContext(context)
  }
  return { useYaflContext }
}

export default createHooks
