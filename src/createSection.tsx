import * as React from 'react'
import { toStrPath, getErrors, getMaxArgLength, getArgLength, shouldValidateSection } from './utils'
import isEqual from 'react-fast-compare'
import memoize from 'memoize-one'
import get from 'lodash.get'
import { Name, FormProvider, FieldValidator, SectionValidateOn } from './sharedTypes'

export interface ArrayHelpers<T = any> {
  push: (value: T[keyof T]) => void
}
export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T> {
  name: Name
  validate?: FieldValidator<F, T>
  validateOn: SectionValidateOn<F, T>
  children: React.ReactNode
}

const listenForProps: (keyof ForkProviderConfig<any, any>)[] = [
  'value',
  'touched',
  'visited',
  'errors',
  'validate',
  'validateOn',
  'activeField',
  'submitCount'
]

function createForkProvider<F extends object>(Provider: React.Provider<FormProvider<F, any>>) {
  return class ForkProvider<T> extends React.Component<ForkProviderConfig<F, T>> {
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
      this.registerField = this.registerField.bind(this)
      this.registerFieldIfNeeded = this.registerFieldIfNeeded.bind(this)
      this.setErrorsIfNeeded = this.setErrorsIfNeeded.bind(this)
      this.registerField()
    }

    shouldComponentUpdate(np: ForkProviderConfig<F, T>) {
      return (
        getMaxArgLength(np.validate) === 3 ||
        getArgLength(np.validateOn) === 2 ||
        listenForProps.some(key => !isEqual(np[key], this.props[key]))
      )
    }

    componentDidUpdate(pp: ForkProviderConfig<F, T>) {
      this.registerFieldIfNeeded(pp)
      this.setErrorsIfNeeded(pp)
    }

    componentWillUnmount() {
      const { unregisterField, path } = this.props
      unregisterField(path)
    }

    getErrors = memoize(getErrors)

    shouldValidate = memoize(shouldValidateSection)

    registerFieldIfNeeded(pp: ForkProviderConfig<F, T>) {
      const { registeredFields, path, name } = this.props
      if (pp.name !== name || !registeredFields[toStrPath(path)]) {
        this.registerField()
      }
    }

    setErrorsIfNeeded(pp: ForkProviderConfig<F, T>) {
      const { path, name, value, formValue, validate, validateOn, unwrapFormState } = this.props
      if (
        this.shouldValidate(
          this.props.value,
          this.props.initialValue,
          this.props.touched,
          this.props.visited,
          this.props.submitCount,
          getArgLength(validateOn) === 2 && unwrapFormState(),
          validate,
          this.props.validateOn
        )
      ) {
        const errors = this.getErrors(value, formValue, name, validate)
        if (!isEqual(get(pp.errors, '_errors'), errors)) {
          this.props.setErrors(path.concat(['_errors']), errors)
        }
      }
    }

    registerField() {
      const { path, registerField } = this.props
      registerField(path, 'section')
    }

    render() {
      const { name, children, ...props } = this.props

      return <Provider value={props}>{children}</Provider>
    }
  }
}

export interface SectionConfig<F extends object, T> {
  name: Name
  fallback?: T
  validateOn?: SectionValidateOn<F, T>
  validate?: FieldValidator<F, T>
  children: React.ReactNode
}

export default function<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>,
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  const InnerComponent = createForkProvider<F>(Provider)

  return class Section<T extends object> extends React.PureComponent<SectionConfig<F, T>> {
    constructor(props: SectionConfig<F, T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(incomingProps: FormProvider<F, any>) {
      const { children, name, validate, fallback, validateOn = 'submit' } = this.props
      const {
        path,
        value,
        touched,
        visited,
        errors,
        initialValue,
        defaultValue,
        ...props
      } = incomingProps

      return (
        <InnerComponent<T>
          {...props}
          name={name}
          validate={validate}
          validateOn={validateOn}
          path={path.concat(name)}
          errors={Object(errors)[name]}
          touched={Object(touched)[name]}
          visited={Object(visited)[name]}
          value={Object(value)[name] || fallback}
          initialValue={Object(initialValue)[name]}
          defaultValue={Object(defaultValue)[name]}
        >
          {children}
        </InnerComponent>
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}
