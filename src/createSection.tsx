import * as React from 'react'
import { toArray, incl, toStrPath } from './utils'
import isEqual from 'react-fast-compare'
import get from 'lodash.get'
import set from 'lodash.set'
import {
  FormProvider,
  FormErrors,
  FormState,
  ValidateOn,
  FieldValidator,
  Name
} from './sharedTypes'

export interface ArrayHelpers<T = any> {
  push: (value: T[keyof T]) => void
}

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T> {
  name: Name
  validate?: FieldValidator<F, T>
  validateOn: ValidateOn<F, T>
  children: React.ReactNode
}

const listenForProps: (keyof ForkProviderConfig<any, any>)[] = [
  'activeField',
  'value',
  'touched',
  'visited',
  'errors',
  'validate',
  'validateOn'
]

function createForkProvider<F extends object>(Provider: React.Provider<FormProvider<F, any>>) {
  return class ForkProvider<T> extends React.Component<ForkProviderConfig<F, T>> {
    constructor(props: ForkProviderConfig<F, T>) {
      super(props)
      this.validate = this.validate.bind(this)
      this.registerField = this.registerField.bind(this)
      this.shouldValidate = this.shouldValidate.bind(this)
      this.registerField()
    }

    shouldComponentUpdate(nextProps: ForkProviderConfig<F, T>) {
      return listenForProps.some(key => !isEqual(nextProps[key], this.props[key]))
    }

    componentDidUpdate(pp: ForkProviderConfig<F, T>) {
      const { registeredFields, path, name } = this.props
      if (pp.name !== name || !registeredFields[toStrPath(path)]) {
        this.registerField()
      }
    }

    componentWillUnmount() {
      const { unregisterField, path } = this.props
      unregisterField(path)
    }

    shouldValidate(state: FormState<F>): boolean {
      const { name, path, validateOn, initialValue, validate } = this.props
      if (!validate || !validate.length) return false
      if (typeof validateOn === 'function') {
        return validateOn(
          {
            name: name as string,
            value: get(state.formValue, path),
            touched: get(state.touched, path), // todo
            visited: get(state.visited, path),
            originalValue: initialValue
          },
          name as string,
          state
        )
      } else {
        return (
          (!!state.visited && incl(validateOn, 'blur')) ||
          (!!state.touched && incl(validateOn, 'change')) ||
          (state.submitCount > 0 && incl(validateOn, 'submit'))
        )
      }
    }

    registerField() {
      const { path, registerField } = this.props
      registerField(path, 'section', {
        validate: this.validate,
        shouldValidate: this.shouldValidate
      })
    }

    validate(state: FormState<F>, ret: FormErrors<F>): string[] {
      const { validate = [], path, name } = this.props
      let errors: string[] = []
      const validators = toArray(validate)
      const value = get(state.formValue, path)
      errors = validators.reduce((ret, validate) => {
        const result = validate(value, state.formValue, name as string)
        return result === undefined ? ret : [...ret, ...toArray(result)]
      }, errors)

      if (ret && errors.length) {
        set(ret, path.concat('_errors'), errors)
      }

      return errors
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
  validateOn?: ValidateOn<F, T>
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
      const { children, name, validate, fallback, validateOn = 'blur' } = this.props
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
          value={get(value, name, fallback)}
          validateOn={validateOn}
          touched={get(touched, name)}
          visited={get(visited, name)}
          path={path.concat(name)}
          errors={get(errors, name)}
          initialValue={get(initialValue, name)}
          defaultValue={get(defaultValue, name)}
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
