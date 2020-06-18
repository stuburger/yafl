import * as React from 'react'
import { isObject } from './checkType'
import { Name, FormProvider } from '../sharedTypes'
import { useSafeContext } from '../useSafeContext'
import append from './append'

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
    branchValues = {},
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
    branchValues: Object.keys(branchValues).reduce((ret: any, key: string) => {
      ret[key] = isObject(branchValues[key]) ? branchValues[key][name] : undefined
      return ret
    }, {}),
  }
}

export default useBranch
