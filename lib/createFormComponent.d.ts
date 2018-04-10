/// <reference types="react" />
import * as React from 'react'
import { ProviderValue, FormComponentWrapper } from './index'
declare function wrapConsumer<T>(
  Consumer: React.Consumer<ProviderValue<T>>
): {
  new (props: FormComponentWrapper<T>, context?: any): {
    _render: ({ registerValidator, onFieldBlur, ...providerValue }: ProviderValue<T>) => JSX.Element
    render(): JSX.Element
    setState<K extends never>(
      state:
        | {}
        | ((prevState: Readonly<{}>, props: FormComponentWrapper<T>) => {} | Pick<{}, K>)
        | Pick<{}, K>,
      callback?: () => void
    ): void
    forceUpdate(callBack?: () => void): void
    props: Readonly<{
      children?: React.ReactNode
    }> &
      Readonly<FormComponentWrapper<T>>
    state: Readonly<{}>
    context: any
    refs: {
      [key: string]: React.ReactInstance
    }
    componentDidMount?(): void
    shouldComponentUpdate?(
      nextProps: Readonly<FormComponentWrapper<T>>,
      nextState: Readonly<{}>,
      nextContext: any
    ): boolean
    componentWillUnmount?(): void
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void
    getSnapshotBeforeUpdate?(
      prevProps: Readonly<FormComponentWrapper<T>>,
      prevState: Readonly<{}>
    ): never
    componentDidUpdate?(
      prevProps: Readonly<FormComponentWrapper<T>>,
      prevState: Readonly<{}>,
      snapshot?: never
    ): void
    componentWillMount?(): void
    UNSAFE_componentWillMount?(): void
    componentWillReceiveProps?(nextProps: Readonly<FormComponentWrapper<T>>, nextContext: any): void
    UNSAFE_componentWillReceiveProps?(
      nextProps: Readonly<FormComponentWrapper<T>>,
      nextContext: any
    ): void
    componentWillUpdate?(
      nextProps: Readonly<FormComponentWrapper<T>>,
      nextState: Readonly<{}>,
      nextContext: any
    ): void
    UNSAFE_componentWillUpdate?(
      nextProps: Readonly<FormComponentWrapper<T>>,
      nextState: Readonly<{}>,
      nextContext: any
    ): void
  }
}
export default wrapConsumer
