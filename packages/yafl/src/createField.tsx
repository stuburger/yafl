import React from 'react'
import { FieldProps, InputProps, FieldConfig, UseFieldFn, Name } from './sharedTypes'
import FieldSink from './FieldSink'

function isCheckInput(type?: string): type is 'radio' | 'checkbox' {
  return type === 'radio' || type === 'checkbox'
}

function createField<FValue extends object>(
  useField: UseFieldFn<any, any>,
  useCommonValues: (name: Name) => any,
  useBranchValues: (name: Name) => any
) {
  function Field<T = any, F extends object = FValue>(
    props: FieldConfig<F, T>
  ): React.ReactElement<FieldConfig<F, T>> {
    const { name, render, validate, component, ...fieldProps } = props

    const [inputProps, meta] = useField(name, { validate })
    const branchProps = useBranchValues(name)
    const sharedProps = useCommonValues(name)

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
      return <Component key="comp" {...collectedProps} />
    }

    if (render) {
      return render(collectedProps)
    }

    if (typeof component === 'string') {
      return React.createElement(component, { ...input, ...fieldProps })
    }

    return <FieldSink key="comp" path={meta.path} {...collectedProps} />
  }

  return Field
}

export default createField
