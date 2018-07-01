import * as React from 'react'
import PropTypes from 'prop-types'
import { Path, FormProvider } from './sharedTypes'
import invariant from 'invariant'

export type InnerFaultProps = FormProvider<any> & FaultProps

export class InnerError extends React.Component<InnerFaultProps> {
  componentDidMount() {
    const { registerError, path, msg } = this.props
    invariant(
      path && path.length > 0,
      "Invalid path. The 'path' prop on the Fault component is required when rendering a Fault " +
        'outside of the component hierarchy of any Field, Section or Repeat components. ' +
        'It is likely that you are seeing this message because you are ' +
        'rendering a Fault as a direct child of your Form component.'
    )
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

export interface FaultProps {
  msg: string
  path?: Path
}

export function createFault(Consumer: React.Consumer<FormProvider<any, any>>) {
  return class Fault extends React.Component<FaultProps> {
    static propTypes = {
      msg: PropTypes.string,
      preventSubmit: PropTypes.bool,
      path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
    }
    render() {
      const { msg, path } = this.props
      return (
        <Consumer>{props => <InnerError key={msg + path} {...props} {...this.props} />}</Consumer>
      )
    }
  }
}
