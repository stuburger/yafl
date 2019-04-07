import * as React from 'react'
import PropTypes from 'prop-types'
import { CombinedContexts, Action } from './sharedTypes'
import { useSafeContext } from './useSafeContext'
import { VALIDATOR_PATH_WARNING } from './warnings'
import warning from 'tiny-warning'

export type InnerValidatorProps = {
  msg: string
  path: PathV2
  dispatch: React.Dispatch<Action<any>>
}

export const InnerError: React.FC<InnerValidatorProps> = props => {
  const { msg, path, dispatch } = props
  React.useEffect(() => {
    dispatch({ type: 'register_error', payload: { path, error: msg } })
    return () => {
      dispatch({ type: 'unregister_error', payload: { path, error: msg } })
    }
  }, [])

  return null
}

export interface ValidatorProps {
  msg?: string | null | void
  path: PathV2
}

export default function createValidator(ctx: CombinedContexts<any>) {
  const Validator: React.FC<ValidatorProps> = props => {
    const { path = [], msg, children = null } = props

    if (process.env.NODE_ENV !== 'production') {
      warning(path.length > 0, VALIDATOR_PATH_WARNING)
    }

    const [, dispatch] = useSafeContext(ctx)
    if (typeof msg === 'string') {
      return <InnerError key={msg + path} msg={msg} path={path} dispatch={dispatch} />
    }

    return children as React.ReactElement<any>
  }

  Validator.propTypes /* remove-proptypes */ = {
    msg: PropTypes.string,
    path: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired
    ).isRequired
  }

  return Validator
}
