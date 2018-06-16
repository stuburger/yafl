import * as React from 'react'
import { FormProvider, FormMeta, FormErrors, BooleanTree, Path } from './sharedTypes'
import isEqual from 'react-fast-compare'
import omit from 'lodash.omit'

interface GeneralComponentConfig<F extends object> extends GizmoConfig<F> {
  formValue: F
  defaultValue: F
  initialValue: F
  initialMount: boolean
  touched: BooleanTree<F>
  visited: BooleanTree<F>
  activeField: string | null
  submitCount: number
  formIsValid: boolean
  formIsDirty: boolean
  formIsTouched: boolean
  errors: FormErrors<F>
  submit: (() => void)
  resetForm: (() => void)
  clearForm: (() => void)
  forgetState: (() => void)
  setActiveField: ((path: string | null) => void)
  setValue: ((path: Path, value: any, setTouched?: boolean) => void)
  touchField: ((path: Path, touched: boolean) => void)
  visitField: ((path: Path, visited: boolean) => void)
  setFormValue: ((value: Partial<F>, overwrite?: boolean) => void)
  setTouched: ((value: BooleanTree<F>, overwrite?: boolean) => void)
  setVisited: ((value: BooleanTree<F>, overwrite?: boolean) => void)
  forwardProps: { [key: string]: any }
}

const listenForProps: (keyof GeneralComponentConfig<any>)[] = [
  'errors',
  'touched',
  'visited',
  'isDirty',
  'formValue',
  'forwardProps'
]

const propsToOmit: (keyof FormProvider<any>)[] = [
  'registeredFields',
  'unregisterField',
  'unregisterField',
  'setActiveField',
  'registerField',
  'initialMount',
  'validateOn',
  'value',
  'path'
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
      const { render, children, forwardProps, component: Component, ...props } = this.props
      return { ...props, ...forwardProps }
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
  formIsTouched: boolean
  formIsValid: boolean
  formIsDirty: boolean
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
          {...omit(incomingProps, propsToOmit) as GeneralComponentConfig<F>}
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
