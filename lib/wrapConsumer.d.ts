/// <reference types="react" />
import * as React from 'react'
import { ProviderValue, FormFieldProps } from 'types/index'
declare function wrapConsumer<T>(
  Consumer: React.Consumer<ProviderValue<T>>
): {
  new (props: FormFieldProps<T>, context?: any): {
    _render: (state: ProviderValue<T>) => JSX.Element
    render(): JSX.Element
    setState<K extends never>(
      state:
        | {}
        | ((prevState: Readonly<{}>, props: FormFieldProps<T>) => {} | Pick<{}, K>)
        | Pick<{}, K>,
      callback?: () => void
    ): void
    forceUpdate(callBack?: () => void): void
    props: Readonly<{
      children?: React.ReactNode
    }> &
      Readonly<FormFieldProps<T>>
    state: Readonly<{}>
    context: any
    refs: {
      [key: string]: React.ReactInstance
    }
    componentDidMount?(): void
    shouldComponentUpdate?(
      nextProps: Readonly<FormFieldProps<T>>,
      nextState: Readonly<{}>,
      nextContext: any
    ): boolean
    componentWillUnmount?(): void
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void
    getSnapshotBeforeUpdate?(prevProps: Readonly<FormFieldProps<T>>, prevState: Readonly<{}>): never
    componentDidUpdate?(
      prevProps: Readonly<FormFieldProps<T>>,
      prevState: Readonly<{}>,
      snapshot?: never
    ): void
    componentWillMount?(): void
    UNSAFE_componentWillMount?(): void
    componentWillReceiveProps?(nextProps: Readonly<FormFieldProps<T>>, nextContext: any): void
    UNSAFE_componentWillReceiveProps?(
      nextProps: Readonly<FormFieldProps<T>>,
      nextContext: any
    ): void
    componentWillUpdate?(
      nextProps: Readonly<FormFieldProps<T>>,
      nextState: Readonly<{}>,
      nextContext: any
    ): void
    UNSAFE_componentWillUpdate?(
      nextProps: Readonly<FormFieldProps<T>>,
      nextState: Readonly<{}>,
      nextContext: any
    ): void
  }
}
export default wrapConsumer
