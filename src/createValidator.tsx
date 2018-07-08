import * as React from 'react'
import PropTypes from 'prop-types'
import { Path, FormProvider } from './sharedTypes'
import invariant from 'invariant'

export type InnerValidatorProps = FormProvider<any> & ValidatorProps

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
  msg: string
  path?: Path
  invalid?: boolean
}

export default function createValidator(Consumer: React.Consumer<FormProvider<any, any>>) {
  return class Validator extends React.PureComponent<ValidatorProps> {
    static propTypes = {
      msg: PropTypes.string,
      invalid: PropTypes.bool,
      path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
    }

    render() {
      const { msg, path, invalid = true } = this.props
      return invalid ? (
        <Consumer>
          {props => <InnerError key={msg + path} {...props} msg={msg} path={path || props.path} />}
        </Consumer>
      ) : null
    }
  }
}
