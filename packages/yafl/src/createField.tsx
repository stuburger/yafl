import React from 'react'
import {
  FieldProps,
  InputProps,
  FieldConfig,
  UseFieldConfig,
  UseFieldProps,
  Name,
} from './sharedTypes'
import FieldSink from './FieldSink'

function isCheckInput(type?: string): type is 'radio' | 'checkbox' {
  return type === 'radio' || type === 'checkbox'
}

type UseField<T, F extends object> = (
  name: Name,
  props: UseFieldConfig<F, T>
) => UseFieldProps<F, T>

function createField<FValue extends object>(useField: UseField<any, any>) {
  function Field<T = any, F extends object = FValue>(
    props: FieldConfig<F, T>
  ): React.ReactElement<FieldConfig<F, T>> {
    const { name, render, validate, component, forwardRef, ...forwardProps } = props

    const field = useField(name, { validate })

    const inputProps: InputProps = {
      ...field.input,
      value: isCheckInput(forwardProps.type) ? forwardProps.value : field.input.value,
    }

    const collectedProps: FieldProps<F, T> = {
      ...field,
      input: inputProps,
      ...forwardProps,
    }

    if (component && typeof component !== 'string') {
      const Component = component
      return <Component key="comp" ref={forwardRef} {...collectedProps} />
    }

    if (render) {
      return <React.Fragment key="comp">{render(collectedProps)}</React.Fragment>
    }

    if (typeof component === 'string') {
      const { input, meta, ...rest } = collectedProps
      return React.createElement(component, { ...input, ...rest, ref: forwardRef })
    }

    return <FieldSink key="comp" path={field.meta.path} {...collectedProps} />
  }

  return Field
}

export default createField
