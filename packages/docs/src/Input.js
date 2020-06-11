/* eslint-disable react/prop-types */
import React from 'react'
import classnames from 'classnames'
import { useField } from 'yafl'

export default function TextInput(props) {
  const { name, busy, label, type, placeholder, validate } = props
  const [input, meta] = useField(name, { validate })
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
      <input
        {...input}
        type={type}
        placeholder={placeholder}
        className={classnames('text-input', {
          error: showError,
        })}
      />
      {showError && <div className="input-feedback">{errors[0]}</div>}
    </div>
  )
}
