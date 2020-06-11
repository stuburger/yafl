/* eslint-disable react/prop-types */
import * as React from 'react'
import { FieldProps } from '../src'

// interface Props {
//   label: string
//   size: 'xxs' | 'xs'
// }

const TextInput = (props: FieldProps<any, any>) => {
  const { meta, input, ...rest } = props
  const { touched, errors, isValid } = meta
  return (
    <div>
      <label htmlFor={input.name}>{rest.label}</label>
      <input id={input.name} {...input} />
      {isValid && touched && <span data-testid={`error_${input.name}`}>{errors[0]}</span>}
      <pre data-testid={`extra_${input.name}`}>{JSON.stringify(rest, null, 2)}</pre>
      <span data-testid={`${input.name}_isValid`}>{`${meta.isValid}`}</span>
      <span data-testid={`${input.name}_isActive`}>{`${meta.isActive}`}</span>
      <span data-testid={`${input.name}_isDirty`}>{`${meta.isDirty}`}</span>
      <span data-testid={`${input.name}_visited`}>{`${meta.visited}`}</span>
      <span data-testid={`${input.name}_touched`}>{`${meta.touched}`}</span>
      <span data-testid={`${input.name}_submitCount`}>{`${meta.submitCount}`}</span>
      <span data-testid={`${input.name}_errors`}>{`${meta.errors[0]}`}</span>
      <span data-testid={`${input.name}_formValue`}>{JSON.stringify(meta.formValue)}</span>
    </div>
  )
}

export default TextInput
