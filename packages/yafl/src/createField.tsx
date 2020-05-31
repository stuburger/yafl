import * as React from 'react'
import {
  FormProvider,
  FieldProps,
  InputProps,
  FieldConfig,
  FieldMeta,
  SetFieldValueFunc,
} from './sharedTypes'
import { validateName, useBranch, isSetFunc, toArray } from './utils'
import FieldSink from './FieldSink'
import createFormError from './createFormError'

function isCheckInput(type?: string): type is 'radio' | 'checkbox' {
  return type === 'radio' || type === 'checkbox'
}

function createField<FValue extends object>(
  context: React.Context<FormProvider<any, any> | Symbol>
) {
  const FormError = createFormError(context)

  function Field<T = any, F extends object = FValue>(
    props: FieldConfig<F, T>
  ): React.ReactElement<FieldConfig<F, T>> {
    const { name, render, validate, component, forwardRef, ...forwardProps } = props

    if (process.env.NODE_ENV !== 'production') {
      validateName(name)
    }

    const curr = useBranch<F, T>(name, context)
    const { path, registerField, unregisterField, setValue, setActiveField } = curr

    React.useEffect(() => {
      registerField(path)
      return () => unregisterField(path)
    }, [path, registerField, unregisterField])

    const setFieldValue = React.useCallback(
      (value: T | SetFieldValueFunc<T>, touchField = true): void => {
        setValue(path, isSetFunc(value) ? value(curr.value) : value, touchField)
      },
      [curr.value, setValue, path]
    )

    const touch = curr.touchField
    const touchField = React.useCallback(
      (touched: boolean): void => {
        touch(path, touched)
      },
      [touch, path]
    )

    const visit = curr.visitField
    const visitField = React.useCallback(
      (visited: boolean): void => {
        visit(path, visited)
      },
      [visit, path]
    )

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<any>) => {
        const { value: val, type, checked } = e.target

        let value = val
        if (/number|range/.test(type)) {
          const par = parseFloat(value)
          value = Number.isNaN(par) ? '' : par
        } else if (isCheckInput(type)) {
          value = checked
        }

        setFieldValue(value)
      },
      [setFieldValue]
    )

    const handleFocus = React.useCallback(() => {
      setActiveField(path)
    }, [setActiveField, path])

    const handleBlur = React.useCallback(() => {
      if (curr.visited) {
        setActiveField(null)
      } else {
        visit(path, true)
      }
    }, [setActiveField, visit, path, curr.visited])

    const metaProps: FieldMeta<F, T> = {
      path: curr.path,
      setValue: setFieldValue,
      submit: curr.submit,
      errors: (curr.errors || []) as any,
      visited: !!curr.visited,
      touched: !!curr.touched,
      setTouched: touchField,
      setVisited: visitField,
      formValue: curr.formValue,
      resetForm: curr.resetForm,
      setFormValue: curr.setFormValue,
      submitCount: curr.submitCount,
      forgetState: curr.forgetState,
      initialValue: curr.initialValue,
      setFormVisited: curr.setFormVisited,
      setFormTouched: curr.setFormTouched,
      isActive: curr.activeField === path,
      isValid: ((curr.errors || []) as any).length === 0,
      isDirty: curr.formIsDirty && curr.initialValue !== curr.value,
    }

    const inputProps: InputProps = {
      onBlur: handleBlur,
      onFocus: handleFocus,
      onChange: handleChange,
      name: name.toString(),
      value: isCheckInput(forwardProps.type) ? forwardProps.value : curr.value,
    }

    const collectedProps: FieldProps<F, T> = {
      meta: metaProps,
      input: inputProps,
      ...curr.branchProps,
      ...curr.sharedProps,
      ...forwardProps,
    }

    let ret: React.ReactNode[] = []

    if (component && typeof component !== 'string') {
      const Component = component
      ret = [<Component key="comp" ref={forwardRef} {...collectedProps} />]
    } else if (render) {
      ret.push(render(collectedProps))
    } else if (typeof component === 'string') {
      const { input, meta, ...rest } = collectedProps
      ret = [React.createElement(component, { ...input, ...rest, ref: forwardRef, key: 'comp' })]
    } else {
      ret = [<FieldSink key="comp" path={metaProps.path} {...collectedProps} />]
    }

    const validators = toArray(validate)
    const ln = validators.length
    for (let i = 0; i < ln; i += 1) {
      const msg = validators[i](curr.value, curr.formValue)
      if (msg) {
        ret.push(<FormError key={msg} path={path} msg={msg} />)
      }
    }

    return <>{ret}</>
  }

  return Field
}

export default createField
