/* eslint-disable react/prop-types */
import React from 'react'
import { Validator } from 'yafl'
import classnames from 'classnames'

export default function Select(props) {
  const { label, input, meta, placeholder, type, busy, options = [], validators = [] } = props
  const { isValid, visited, submitCount, errors = [] } = meta
  const showError = !isValid && (visited || submitCount > 0)
  return (
    <div className="input-group">
      <label htmlFor={input.name}>{label}</label>
      {busy && (
        <span className="input-validating" role="img" aria-label="Validating">
          🤞
        </span>
      )}
      <select
        {...input}
        type={type}
        className={classnames('text-input', {
          error: showError,
        })}
      >
        <option value="">{placeholder}</option>
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      {showError && <div className="input-feedback">{errors[0]}</div>}
      {validators.reduceRight((ret, validate) => {
        return <Validator msg={validate(input.value)}>{ret}</Validator>
      }, null)}
    </div>
  )
}
