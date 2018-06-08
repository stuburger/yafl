import * as React from 'react'
import { FormProvider, FormMeta } from './sharedTypes'
import * as _ from 'lodash'
import { Consumer } from './Context'

type GeneralComponentConfig<T = any> = FormProvider<T> &
  GizmoConfig<T> & { forwardProps: { [key: string]: any } }

const listenForProps: (keyof GeneralComponentConfig)[] = [
  'errors',
  'touched',
  'visited',
  'isDirty',
  'formValue',
  'forwardProps'
]

class GeneralComponent extends React.Component<GeneralComponentConfig> {
  constructor(props: GeneralComponentConfig) {
    super(props)
    this.collectProps = this.collectProps.bind(this)
  }

  shouldComponentUpdate(np: GeneralComponentConfig) {
    return listenForProps.some(key => !_.isEqual(this.props[key], np[key]))
  }

  collectProps(): GizmoProps {
    const {
      render,
      errors,
      onSubmit,
      children,
      formErrors,
      formIsValid,
      formIsDirty,
      forwardProps,
      formIsTouched,
      component: Component,
      ...props
    } = this.props

    return {
      ...props,
      errors: _.merge({}, formErrors, errors),
      submit: onSubmit,
      isValid: formIsValid,
      isDirty: formIsDirty,
      isTouched: formIsTouched,
      ...forwardProps
    }
  }

  render() {
    const { render, component: Component } = this.props

    const props = this.collectProps()

    if (render) {
      return render(props)
    }

    if (Component) {
      return <Component {...props} />
    }

    console.warn('render, component props not supplied')
    return null
  }
}

export interface GizmoProps<T = any> extends FormMeta<T> {
  [key: string]: any
}

export interface GizmoConfig<T = any> {
  render: (props: GizmoProps) => React.ReactNode
  component: React.ComponentType<GizmoProps>
  [key: string]: any
}

class Gizmo extends React.Component<GizmoConfig> {
  constructor(props: GizmoConfig) {
    super(props)
    this._render = this._render.bind(this)
  }

  _render(incomingProps: FormProvider) {
    const { render, component, children, ...forwardProps } = this.props

    return (
      <GeneralComponent
        {...incomingProps}
        render={render}
        component={component}
        forwardProps={forwardProps}
      />
    )
  }

  render() {
    return <Consumer>{this._render}</Consumer>
  }
}

export default Gizmo
