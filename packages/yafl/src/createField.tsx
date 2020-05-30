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
import { useSafeContext } from './useSafeContext'

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

    const yafl = useSafeContext(context)
    const curr = useBranch<T>(name, yafl, undefined!)

    const { path } = curr
    const { registerField, unregisterField } = yafl
    React.useEffect(() => {
      registerField(path)
      return () => unregisterField(path)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, registerField, unregisterField])

    const setValue = React.useCallback(
      (value: T | SetFieldValueFunc<T>, touchField = true): void => {
        yafl.setValue(path, isSetFunc(value) ? value(curr.value) : value, touchField)
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [yafl.setValue, path, curr.value]
    )

    const touch = yafl.touchField
    const touchField = React.useCallback(
      (touched: boolean): void => {
        touch(path, touched)
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [touch, path]
    )

    const visit = yafl.visitField
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

        setValue(value)
      },
      [setValue]
    )

    const { setActiveField } = yafl
    const handleFocus = React.useCallback(() => {
      setActiveField(curr.path)
    }, [setActiveField, curr.path])

    const { visited } = curr
    const handleBlur = React.useCallback(() => {
      if (visited) {
        setActiveField(null)
      } else {
        visit(path, true)
      }
    }, [setActiveField, visit, path, visited])

    const metaProps: FieldMeta<FValue, T> = {
      setValue,
      path: curr.path,
      errors: (curr.errors || []) as any,
      visited: !!curr.visited,
      touched: !!curr.touched,
      setTouched: touchField,
      setVisited: visitField,
      initialValue: curr.initialValue,
      isValid: ((curr.errors || []) as any).length === 0,
      isActive: yafl.activeField === curr.path,
      isDirty: yafl.formIsDirty && curr.initialValue !== curr.value,
      submit: yafl.submit,
      formValue: yafl.formValue,
      resetForm: yafl.resetForm,
      setFormValue: yafl.setFormValue,
      submitCount: yafl.submitCount,
      forgetState: yafl.forgetState,
      setFormVisited: yafl.setFormVisited,
      setFormTouched: yafl.setFormTouched,
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
      ...yafl.sharedProps,
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
      const msg = validators[i](curr.value, yafl.formValue)
      if (msg) {
        ret.push(<FormError key={msg} path={path} msg={msg} />)
      }
    }

    return <>{ret}</>
  }

  return Field
}

export default createField
