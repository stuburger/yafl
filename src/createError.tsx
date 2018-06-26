import * as React from 'react'
import { FormProvider } from './sharedTypes'

export type InnerErrorProps = FormProvider<any> & ErrorProps

function createInnerError() {
  return class Error extends React.Component<InnerErrorProps> {
    componentDidMount() {
      const { registerError, path, msg } = this.props
      registerError(path, msg)
    }

    componentWillUnmount() {
      const { unregisterError, path, msg } = this.props
      unregisterError(path, msg)
    }

    render() {
      return null
    }
  }
}

export interface ErrorProps {
  msg: string
  preventSubmit?: boolean
}

export function createError<F extends object>(Consumer: React.Consumer<FormProvider<any, any>>) {
  // todo prop types
  // inner error component
  const InnerComponent = createInnerError()

  return class Error extends React.Component<ErrorProps> {
    render() {
      return (
        <Consumer>
          {props => (
            <InnerComponent {...props} {...this.props}>
              {this.props.children}
            </InnerComponent>
          )}
        </Consumer>
      )
    }
  }
}
