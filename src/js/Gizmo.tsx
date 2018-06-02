import * as React from 'react'
import { Provider as P, Visited, Touched, Path, FormErrors } from '../sharedTypes'
import { Consumer } from './Context'

type GeneralComponentConfig<T = any> = P<T> &
  GizmoConfig<T> & { forwardProps: { [key: string]: any } }

class GeneralComponent extends React.Component<GeneralComponentConfig> {
  constructor(props: GeneralComponentConfig) {
    super(props)
    this.collectProps = this.collectProps.bind(this)
  }

  collectProps(): GizmoProps {
    const { render, component: Component, forwardProps, active, onSubmit, ...props } = this.props

    return {
      ...props,
      submit: onSubmit,
      activeField: active,
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

export interface GizmoProps<T = any> {
  visited: Visited<T>
  formIsDirty: boolean
  touched: Touched<T>
  activeField: Path
  submitCount: number
  loaded: boolean
  submitting: boolean
  formIsValid: boolean
  errors: FormErrors<T>
  initialValue: any
  defaultValue: any
  resetForm: () => void
  submit: () => void
  forgetState: () => void
  clearForm: () => void
  setFormValue: ((value: Partial<T>, overwrite: boolean) => void)
  [key: string]: any
}

export interface GizmoConfig<T = any> {
  render: (props: GizmoProps) => React.ReactNode
  component: React.ComponentType<GizmoProps>
  [key: string]: any
}

class Gizmo extends React.Component<GizmoConfig> {
  render() {
    const { render, component, children, ...forwardProps } = this.props

    return (
      <Consumer>
        {props => {
          return (
            <GeneralComponent
              {...props}
              render={render}
              component={component}
              forwardProps={forwardProps}
            />
          )
        }}
      </Consumer>
    )
  }
}

export default Gizmo
