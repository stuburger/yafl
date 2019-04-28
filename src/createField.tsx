import * as React from 'react'
import PropTypes from 'prop-types'
import {
  InnerFieldProps,
  FieldProps,
  InputProps,
  FieldConfig,
  FieldMeta,
  SetFieldValueFunc,
  CombinedContexts,
  FormState
} from './sharedTypes'
import { toStrPath, validateName, branchByName, isSetFunc, toArray, get } from './utils'
import { branchableProps } from './defaults'
import FieldSink from './FieldSink'
import createValidator from './createValidator'
import { useSafeContext } from './useSafeContext'
import { setFieldValue, setActiveField } from './actionCreators'

function createFieldController(ctx: CombinedContexts<any>) {
  const Validator = createValidator(ctx)

  type IFP<F extends object, T> = InnerFieldProps<F, T>

  function FieldController<T, F extends object>(props: IFP<F, T>): React.ReactElement<IFP<F, T>> {
    const { state: yafl, dispatch, config, register, formValue, branch } = useSafeContext<F>(ctx)

    const path: PathV2 = yafl.path.concat(props.name as string)
    React.useEffect(() => {
      register(path)
      return () => register(path)
    }, [])

    const b = branchByName<F, T, FormState<F>>(props.name, yafl, branchableProps)

    const stringPath = toStrPath(path)
    const currentValue = b.value

    const initialValue = get<T>(config.initialValue, path)
    function collectMetaProps(): FieldMeta<F, T> {
      return {
        dispatch,
        formValue,
        initialValue,
        path: stringPath,
        errors: (b.errors || []) as any,
        visited: !!b.visited,
        touched: !!b.touched,
        submitCount: yafl.submitCount,
        isValid: ((b.errors || []) as any).length === 0,
        isActive: b.activeField === stringPath,
        isDirty: initialValue !== b.value
      }
    }

    function collectInputProps(): InputProps {
      const { forwardProps } = props
      return {
        name: props.name.toString(),
        value: isCheckInput(forwardProps.type) ? forwardProps.value : b.value,
        onFocus: onFocus,
        onBlur: onBlur,
        onChange: onChange
      }
    }

    function collectProps(): FieldProps<F, T> {
      const { forwardProps } = props
      return {
        input: collectInputProps(),
        meta: collectMetaProps(),
        ...branch,
        // ...b.sharedProps,
        ...forwardProps
      }
    }

    const setValue = React.useCallback(
      (value: T | SetFieldValueFunc<T>, touchField = true): void => {
        const nextVal = isSetFunc(value) ? value(currentValue) : value
        dispatch(setFieldValue(path, nextVal, touchField))
      },
      [currentValue]
    )

    const handleChange = props.onChange // || b.sharedProps.onChange
    const onChange = React.useCallback(
      (e: React.ChangeEvent<any>) => {
        if (typeof handleChange === 'function') {
          handleChange(e, collectProps())
        }
        if (e.isDefaultPrevented()) return
        const { value: val, type, checked } = e.target

        let value = val
        if (/number|range/.test(type)) {
          const par = parseFloat(value)
          value = isNaN(par) ? '' : par
        } else if (isCheckInput(type)) {
          value = checked
        }

        setValue(value)
      },
      [handleChange]
    )

    const handleFocus = props.onFocus
    const onFocus = React.useCallback(
      (e: React.FocusEvent<any>): void => {
        if (typeof handleFocus === 'function') {
          handleFocus(e, collectProps())
        }
        if (e.isDefaultPrevented()) return
        dispatch(setActiveField(path))
      },
      [handleFocus]
    )

    const handleBlur = props.onBlur // || b.sharedProps.onBlur
    const onBlur = React.useCallback(
      (e: React.FocusEvent<any>) => {
        if (typeof handleBlur === 'function') {
          handleBlur(e, collectProps())
        }
        if (e.isDefaultPrevented()) return
        if (b.visited) {
          dispatch({ type: 'set_active_field', payload: null })
        } else {
          dispatch({ type: 'visit_field', payload: { path, visited: true } })
        }
      },
      [b.visited]
    )

    const { render, component, forwardRef } = props

    let ret: React.ReactNode[] = []

    const jam = collectProps()
    if (component && typeof component !== 'string') {
      const Component = component
      ret = [<Component key="comp" ref={forwardRef} {...jam} />]
    } else if (render) {
      ret.push(render(jam))
    } else if (typeof component === 'string') {
      const { input, meta, ...rest } = jam
      ret = [React.createElement(component, { ...input, ...rest, ref: forwardRef, key: 'comp' })]
    } else {
      ret = [<FieldSink key="comp" path={jam.meta.path} {...jam} />]
    }

    const validators = toArray(props.validate)
    if (validators.length > 0) {
      ret.push(
        <React.Fragment key="frag">
          {validators.reduceRight<React.ReactNode>(
            (ret, test) => (
              <Validator path={path} msg={test(currentValue, yafl.value)}>
                {ret}
              </Validator>
            ),
            null
          )}
        </React.Fragment>
      )
    }

    return <>{ret}</>
  }

  return FieldController
}

export default function<F extends object>(context: CombinedContexts<F>) {
  const FieldController = createFieldController(context)

  function Field<T, F1 extends object = F>(
    props: FieldConfig<F1, T>
  ): React.ReactElement<FieldConfig<F1, T>> {
    if (process.env.NODE_ENV !== 'production') {
      validateName(props.name)
    }

    const {
      name,
      render,
      onBlur,
      onFocus,
      onChange,
      validate,
      component,
      forwardRef,
      ...forwardProps
    } = props

    return (
      <FieldController<T, F1>
        key={name}
        name={name}
        render={render}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        validate={validate}
        component={component}
        forwardRef={forwardRef}
        forwardProps={forwardProps}
      />
    )
  }

  Field.propTypes /* remove-proptypes */ = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string,
    render: PropTypes.func,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.node])
  }

  return Field
}

const isCheckInput = (type?: string): type is 'radio' | 'checkbox' => {
  return type === 'radio' || type === 'checkbox'
}
