import * as React from 'react'
import {
  FormProvider,
  FormMeta,
  FormErrors,
  BooleanTree,
  Path,
  ComponentTypes
} from './sharedTypes'
import isEqual from 'react-fast-compare'
import omit from 'lodash.omit'
import { DefaultComponentTypeKey } from './defaults'

interface GeneralComponentConfig<F extends object> extends GizmoConfig<F> {
  type: string
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
  componentTypes: ComponentTypes<F>
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
  'type',
  'touched',
  'visited',
  'isDirty',
  'formValue',
  'formErrors',
  'fieldErrors',
  'submitCount',
  'activeField',
  'forwardProps',
  'componentTypes'
]

const propsToOmit: (keyof FormProvider<any>)[] = [
  'registeredFields',
  'unregisterField',
  'unregisterField',
  'setActiveField',
  'registerField',
  'componentTypes',
  'initialMount',
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
      const {
        type,
        render,
        children,
        allErrors,
        forwardProps,
        component: Component,
        componentTypes,
        ...props
      } = this.props
      return { errors: allErrors, ...props, ...forwardProps }
    }

    render() {
      const { render, component: Component, componentTypes, type } = this.props

      const props = this.collectProps()

      if (render) {
        return render(props)
      }

      if (Component) {
        return <Component {...props} />
      }

      const DefaultComponent = componentTypes[type]
      return <DefaultComponent {...props} />
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
  render?: (props: GizmoProps<F>) => React.ReactNode
  component?: React.ComponentType<GizmoProps<F>>
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
      const {
        render,
        component,
        children,
        type = DefaultComponentTypeKey,
        ...forwardProps
      } = this.props
      return (
        <InnerGizmo
          {...omit(incomingProps, propsToOmit) as GeneralComponentConfig<F>}
          type={type}
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
