import * as React from 'react'
import PropTypes from 'prop-types'
import { Path, FormProvider } from './sharedTypes'
import warning from 'tiny-warning'

export type InnerValidatorProps = FormProvider<any> & {
  msg: string
}

function useWarning(condition: boolean, message: string) {
  React.useEffect(() => {
    warning(condition, message)
  }, [condition, message])
}

export const InnerError: React.FC<InnerValidatorProps> = props => {
  const { msg, path, registerError, unregisterError } = props
  React.useEffect(() => {
    registerError(path, msg)
    return () => unregisterError(path, msg)
  }, [])

  return null
}

export interface ValidatorProps {
  msg?: string | null | void
  path: Path
}

export default function createValidator(context: React.Context<FormProvider<any>>) {
  const Validator: React.FC<ValidatorProps> = props => {
    const ctx = React.useContext(context)

    const { path, msg, children = null } = props

    if (process.env.NODE_ENV !== 'production') {
      useWarning(
        path && path.length > 0,
        "Invalid path. The 'path' prop on the Validator component is required when rendering a Validator " +
          'outside of the component hierarchy of any Field, Section or Repeat components. ' +
          'It is likely that you are seeing this message because you are ' +
          'rendering a Validator as a direct child of your Form component.'
      )
    }

    if (typeof msg === 'string') {
      return <InnerError key={msg + path} {...ctx} msg={msg} path={path} />
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
