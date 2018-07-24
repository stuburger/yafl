import React from 'react'
import { Validator } from 'yafl'
import classnames from 'classnames'

export default function TextInput(props) {
  const { input, meta, required, validators = [] } = props
  const { isValid, visited, submitCount, errors = [] } = meta
  const showError = !isValid && (visited || submitCount > 0)
  return (
    <div
      className={classnames('input-group', {
        'error': showError,
        required,
      })}
    >
      <label htmlFor={input.name}>{props.label}</label>
      <input {...input} type={props.type} placeholder={props.placeholder} />
      {showError && <div className="input-feedback">{errors[0]}</div>}
      {validators.reduceRight((ret, validate) => {
        return <Validator msg={validate(input.value)}>{ret}</Validator>
      }, null)}
    </div>
  )
}
