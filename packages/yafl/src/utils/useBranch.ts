import * as React from 'react'
import { isObject } from './checkType'
import { Name, FormProvider } from '../sharedTypes'

function useBranch<T>(name: Name, yafl: FormProvider<any>, fallback: T) {
  const {
    path,
    value = {},
    errors = {},
    visited = {},
    touched = {},
    branchProps = {},
    initialValue = {},
  } = yafl

  return React.useMemo(() => {
    return {
      path: (path ? path.concat(`.${name}`) : `${name}`) as string,
      touched: touched[name] as any,
      visited: visited[name] as any,
      errors: errors[name] as any,
      initialValue: initialValue[name],
      value: value[name] === undefined ? fallback : (value[name] as T),
      branchProps: Object.keys(branchProps).reduce((ret: any, key: string) => {
        // eslint-disable-next-line no-param-reassign
        ret[key] = isObject(branchProps[key]) ? branchProps[key][name] : undefined
        return ret
      }, {}),
    }
  }, [path, name, touched, visited, errors, initialValue, value, fallback, branchProps])
}

export default useBranch
