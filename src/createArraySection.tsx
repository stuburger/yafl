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

export interface ArrayHelpers<T> {
  push: (value: T) => void
}

export interface ForkProviderConfig<F extends object, T> extends FormProvider<F, T[]> {
  name: Name
  validate?: FieldValidator<F, T[]>
  validateOn: ValidateOn<F, T[]>
  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
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
      this.push = this.push.bind(this)
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

    push(valueToPush: T) {
      const { setValue, value, path } = this.props
      setValue(path, [...value, valueToPush], false)
    }

    render() {
      const { name, children, ...props } = this.props

      return (
        <Provider value={props}>
          {typeof children === 'function' ? children(props.value, { push: this.push }) : children}
        </Provider>
      )
    }
  }
}

export interface ArraySectionConfig<F extends object, T> {
  name: Name
  fallback?: T[]
  validateOn?: ValidateOn<F, T[]>
  validate?: FieldValidator<F, T[]>
  children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)
}

export default function<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>,
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  const InnerComponent = createForkProvider<F>(Provider)

  return class Section<T extends object> extends React.PureComponent<ArraySectionConfig<F, T>> {
    constructor(props: ArraySectionConfig<F, T>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(incomingProps: FormProvider<F, any>) {
      const { children, name, validate, validateOn = 'blur', fallback } = this.props
      const {
        path,
        value,
        touched,
        visited,
        errors,
        defaultValue,
        initialValue,
        ...props
      } = incomingProps

      return (
        <InnerComponent<T>
          {...props}
          name={name}
          validate={validate}
          validateOn={validateOn}
          value={get(value, name, fallback)}
          path={path.concat(name)}
          errors={get(errors, name)}
          touched={get(touched, name)}
          visited={get(visited, name)}
          initialValue={initialValue[name]}
          defaultValue={defaultValue[name]}
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
