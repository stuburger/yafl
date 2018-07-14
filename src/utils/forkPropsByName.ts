import { isObject } from './checkType'
import { Name, FormProvider } from '../sharedTypes'

const baseForkProps = <T extends object>(name: Name, props: T, keysToSplit: (keyof T)[]) => {
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
  const result: any = baseForkProps(name, props, keysToSplit)
  result.name = name
  result.value = result.value === undefined ? valueFallback : result.value
  result.path = props.path.concat(name)
  result.forkProps = isObject(props.forkProps)
    ? Object.keys(props.forkProps).reduce(
        (ret: any, key: string) => {
          ret[key] = isObject(props.forkProps[key]) ? props.forkProps[key][name] : undefined
          return ret
        },
        {} as any
      )
    : undefined
  return { ...props, ...result }
}
