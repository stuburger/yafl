import React from 'react'
import { FieldProps, InputProps, FieldConfig, UseFieldFn, UseForwardPropsFn } from './sharedTypes'
import FieldSink from './FieldSink'

function isCheckInput(type?: string): type is 'radio' | 'checkbox' {
  return type === 'radio' || type === 'checkbox'
}

function createField<FValue extends object>(
  useField: UseFieldFn<any, any>,
  useForwardProps: UseForwardPropsFn<any, any>
) {
  function Field<T = any, F extends object = FValue>(
    props: FieldConfig<F, T>
  ): React.ReactElement<FieldConfig<F, T>> {
    const { name, render, validate, component, forwardRef, ...fieldProps } = props

    const [inputProps, meta] = useField(name, { validate })
    const [branchProps, sharedProps] = useForwardProps(name)

    const input: InputProps = {
      ...inputProps,
      value: isCheckInput(fieldProps.type) ? fieldProps.value : inputProps.value,
    }

    const collectedProps: FieldProps<F, T> = {
      input,
      meta,
      ...fieldProps,
      ...branchProps,
      ...sharedProps,
    }

    if (component && typeof component !== 'string') {
      const Component = component as React.ComponentClass<any>
      return <Component key="comp" ref={forwardRef} {...collectedProps} />
    }

    if (render) {
      return render(collectedProps)
    }

    if (typeof component === 'string') {
      return React.createElement(component, { ...input, ...fieldProps, ref: forwardRef })
    }

    return <FieldSink key="comp" path={meta.path} {...collectedProps} />
  }

  return Field
}

export default createField
