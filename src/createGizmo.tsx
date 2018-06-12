import * as React from 'react'
import { FormProvider, FormMeta, FormErrors, BooleanTree } from './sharedTypes'
import isEqual from 'react-fast-compare'

type GeneralComponentConfig<F extends object> = FormProvider<F> &
  GizmoConfig<F> & { forwardProps: { [key: string]: any } }

const listenForProps: (keyof GeneralComponentConfig<any>)[] = [
  'errors',
  'touched',
  'visited',
  'isDirty',
  'formValue',
  'forwardProps'
]

function createGizmo<F extends object>() {
  return class extends React.Component<GeneralComponentConfig<F>> {
    constructor(props: GeneralComponentConfig<F>) {
      super(props)
      this.collectProps = this.collectProps.bind(this)
    }

    shouldComponentUpdate(np: GeneralComponentConfig<F>) {
      return listenForProps.some(key => !isEqual(this.props[key], np[key]))
    }

    collectProps(): GizmoProps<F> {
      const {
        render,
        onSubmit,
        children,
        forwardProps,
        component: Component,
        ...props
      } = this.props

      return {
        ...props,
        submit: onSubmit,
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
}

export interface GizmoProps<F extends object> extends FormMeta<F> {
  formValue: F
  defaultValue: F
  initialValue: F
  submitCount: number
  activeField: string | null
  visited: BooleanTree<F>
  touched: BooleanTree<F>
  errors: FormErrors<F>
  [key: string]: any
}

export interface GizmoConfig<F extends object> {
  render: (props: GizmoProps<F>) => React.ReactNode
  component: React.ComponentType<GizmoProps<F>>
  [key: string]: any
}

export default function<F extends object>(Consumer: React.Consumer<FormProvider<F, F>>) {
  const InnerGizmo = createGizmo<F>()

  return class Gizmo extends React.Component<GizmoConfig<F>> {
    constructor(props: GizmoConfig<F>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(incomingProps: FormProvider<F, F>) {
      const { render, component, children, ...forwardProps } = this.props

      return (
        <InnerGizmo
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
}
