import React, { useEffect, useCallback } from 'react'
import {
  FormProvider,
  InputProps,
  FieldMeta,
  SetFieldValueFunc,
  UseFieldConfig,
  UseFieldProps,
  Name,
} from './sharedTypes'
import { validateName, useBranch, isSetFunc, toArray } from './utils'

function isCheckInput(type?: string): type is 'radio' | 'checkbox' {
  return type === 'radio' || type === 'checkbox'
}

function createUseField<FValue extends object>(
  context: React.Context<FormProvider<any, any> | Symbol>
) {
  function useField<T = any, F extends object = FValue>(
    name: Name,
    props: UseFieldConfig<F, T>
  ): UseFieldProps<F, T> {
    const { validate } = props

    if (process.env.NODE_ENV !== 'production') {
      validateName(name)
    }

    const curr = useBranch<F, T>(name, context)

    const {
      path,
      setValue,
      registerField,
      unregisterField,
      registerErrors,
      unregisterErrors,
      setActiveField,
    } = curr

    useEffect(() => {
      registerField(path)
      return () => unregisterField(path)
    }, [path, registerField, unregisterField])

    const errors = toArray(validate)
      .map((test) => test(curr.value, curr.formValue))
      .filter(Boolean) as string[]

    const fe = errors.join('')
    useEffect(() => {
      registerErrors(path, errors)
      return () => unregisterErrors(path)
    }, [path, fe, unregisterErrors, registerErrors]) // eslint-disable-line react-hooks/exhaustive-deps

    const setFieldValue = useCallback(
      (value: T | SetFieldValueFunc<T>, touchField = true): void => {
        setValue(path, isSetFunc(value) ? value(curr.value) : value, touchField)
      },
      [curr.value, setValue, path]
    )

    const touch = curr.touchField
    const touchField = useCallback(
      (touched: boolean): void => {
        touch(path, touched)
      },
      [touch, path]
    )

    const visit = curr.visitField
    const visitField = useCallback(
      (visited: boolean): void => {
        visit(path, visited)
      },
      [visit, path]
    )

    const handleChange = useCallback(
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

    const handleFocus = useCallback(() => {
      setActiveField(path)
    }, [setActiveField, path])

    const handleBlur = useCallback(() => {
      if (curr.visited) {
        setActiveField(null)
      } else {
        visit(path, true)
      }
    }, [setActiveField, visit, path, curr.visited])

    const meta: FieldMeta<F, T> = {
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

    const input: InputProps = {
      onBlur: handleBlur,
      onFocus: handleFocus,
      onChange: handleChange,
      name: name.toString(),
      value: curr.value,
    }

    return {
      input,
      meta,
      ...curr.branchProps,
      ...curr.sharedProps,
    }
  }

  return useField
}

export default createUseField
