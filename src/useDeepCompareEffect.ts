import * as React from 'react'
import eq from 'react-fast-compare'

function useDeepCompareMemoize<T extends React.DependencyList>(value: T): [T, T] {
  const ref = React.useRef<T>(value)
  const prev = ref.current
  if (!eq(value, prev)) {
    ref.current = value
  }

  return [prev, ref.current]
}

export function useDeepCompareEffect<T extends React.DependencyList>(
  callback: (prev: T) => void,
  deps: T
) {
  const [prev, next] = useDeepCompareMemoize(deps)
  React.useEffect(() => {
    callback(prev)
  }, next)
}
