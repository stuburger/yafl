import * as React from 'react'
import { Path, FormProvider } from './sharedTypes'

export type InnerFaultProps = FormProvider<any> & ErrorProps

export class InnerError extends React.Component<InnerFaultProps> {
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

export interface ErrorProps {
  msg: string
  path?: Path
  preventSubmit?: boolean
}

export function createFault(Consumer: React.Consumer<FormProvider<any, any>>) {
  return class Fault extends React.Component<ErrorProps> {
    render() {
      const { preventSubmit, msg, path } = this.props
      return (
        <Consumer>
          {props => (
            <InnerError key={msg + preventSubmit + path} {...props} {...this.props}>
              {this.props.children}
            </InnerError>
          )}
        </Consumer>
      )
    }
  }
}
