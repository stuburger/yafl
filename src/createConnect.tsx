import * as React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { FormProps } from './sharedTypes'

export default function createConnect<F extends object>(Consumer: React.Consumer<any>) {
  return function connect<T, F1 extends F = F>(
    Component: React.ComponentType<T & { yafl: FormProps<F1> }>
  ) {
    const Inner: React.SFC<T> = props => {
      return <Consumer>{yafl => <Component {...props} yafl={yafl} />}</Consumer>
    }
    return hoistNonReactStatics<
      React.ComponentType<T>,
      React.ComponentType<T & { yafl: FormProps<F1> }>
    >(Inner, Component)
  }
}
