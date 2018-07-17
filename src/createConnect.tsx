import * as React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { FormProvider, FormProps } from './sharedTypes'

export default function createConnect<F extends object>(
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  return function connect<T>(Component: React.ComponentType<T & { yafl: FormProps<F> }>) {
    const Inner: React.SFC<T> = props => {
      return <Consumer>{yafl => <Component {...props} yafl={yafl} />}</Consumer>
    }
    return hoistNonReactStatics<T, T & { yafl: FormProps<F> }>(Inner, Component)
  }
}
