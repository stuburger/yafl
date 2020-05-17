import { isObject } from './checkType'
import { Name, FormProvider } from '../sharedTypes'

const baseBranchProps = <T extends object>(name: Name, props: T, keysToSplit: (keyof T)[]) => {
  return keysToSplit.reduce<Partial<T>>((ret, key) => {
    ret[key] = isObject(props[key]) ? (props[key] as any)[name] : undefined
    return ret
  }, {}) as T
}

export default <F extends object, T, R>(
  name: Name,
  props: FormProvider<F, T>,
  keysToSplit: (keyof FormProvider<F, T>)[],
  valueFallback?: any
): R => {
  const result: any = baseBranchProps(name, props, keysToSplit)
  result.value = result.value === undefined ? valueFallback : result.value
  result.branchProps = isObject(props.branchProps)
    ? Object.keys(props.branchProps).reduce(
        (ret: any, key: string) => {
          ret[key] = isObject(props.branchProps[key]) ? props.branchProps[key][name] : undefined
          return ret
        },
        {} as any
      )
    : undefined
  return { ...props, ...result }
}
