import { CombinedContexts } from './sharedTypes'
import { useSafeContext } from './useSafeContext'

function createHooks<F extends object>(context: CombinedContexts<F>) {
  function useYaflContext() {
    return useSafeContext(context)
  }
  return { useYaflContext }
}

export default createHooks
