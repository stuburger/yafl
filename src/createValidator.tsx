import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Path, FormProvider } from './sharedTypes'
import invariant from 'invariant'

export type InnerValidatorProps = FormProvider<any> & {
  msg: string
}

export class InnerError extends React.Component<InnerValidatorProps> {
  componentDidMount() {
    const { registerError, path, msg } = this.props
    invariant(
      path && path.length > 0,
      "Invalid path. The 'path' prop on the Validator component is required when rendering a Validator " +
        'outside of the component hierarchy of any Field, Section or Repeat components. ' +
        'It is likely that you are seeing this message because you are ' +
        'rendering a Validator as a direct child of your Form component.'
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

export interface ValidatorProps {
  msg?: string | null | void
  path?: Path | null
}

const stringOrNumber = PropTypes.oneOfType([
  PropTypes.string.isRequired,
  PropTypes.number.isRequired
]).isRequired

export default function createValidator(
  Consumer: React.Consumer<FormProvider<any, any>>
): React.ComponentType<ValidatorProps> {
  return class Validator extends React.PureComponent<ValidatorProps> {
    static propTypes = {
      msg: PropTypes.string,
      path: PropTypes.arrayOf(stringOrNumber)
    }

    render() {
      const { msg, path, children } = this.props
      return typeof msg === 'string' ? (
        <Consumer>
          {props => <InnerError key={msg + path} {...props} msg={msg} path={path || props.path} />}
        </Consumer>
      ) : (
        children || null
      )
    }
  }
}
