import * as React from 'react'
import { isObject } from './checkType'
import { Name, FormProvider } from '../sharedTypes'
import { useSafeContext } from '../useSafeContext'

const append = (path: string, name: Name) => (path ? path.concat(`.${name}`) : `${name}`)

function useBranch<F extends object, T>(
  name: Name,
  ctx: React.Context<FormProvider<any, any> | Symbol>,
  fallback?: T
): FormProvider<F, T> {
  const yafl = useSafeContext<any, any>(ctx)

  const {
    path,
    value = {},
    errors = {},
    visited = {},
    touched = {},
    branchProps = {},
    initialValue = {},
  } = yafl

  return {
    ...yafl,
    path: append(path, name),
    touched: touched[name] as any,
    visited: visited[name] as any,
    errors: errors[name] as any,
    initialValue: initialValue[name],
    value: value[name] === undefined ? fallback : value[name],
    branchProps: Object.keys(branchProps).reduce((ret: any, key: string) => {
      ret[key] = isObject(branchProps[key]) ? branchProps[key][name] : undefined
      return ret
    }, {}),
  }
}

export default useBranch
