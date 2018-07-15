import * as React from 'react'
import { FormProvider, GeneralComponentConfig, GizmoConfig, GizmoProps } from './sharedTypes'
import GizmoSink from './GizmoSink'
import isEqual from 'react-fast-compare'
import omit from 'lodash.omit'

const listenForProps: (keyof GeneralComponentConfig<any>)[] = [
  'type',
  'errors',
  'touched',
  'visited',
  'render',
  'isDirty',
  'component',
  'formValue',
  'submitCount',
  'initialMount',
  'activeField',
  'forwardProps',
  'componentTypes'
]

const propsToOmit: (keyof FormProvider<any>)[] = [
  'unregisterField',
  'unregisterField',
  'setActiveField',
  'registerField',
  'componentTypes',
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
        forwardProps,
        component: Component,
        componentTypes,
        ...props
      } = this.props
      return { ...props, ...forwardProps }
    }

    render() {
      const { render, component, componentTypes } = this.props
      const props = this.collectProps()
      if (component && typeof component !== 'string') {
        const Component = component
        return <Component {...props} />
      } else if (render) {
        return render(props)
      } else if (typeof component === 'string') {
        if (componentTypes[component]) {
          const Component = componentTypes[component]
          return <Component {...props} />
        }
        return React.createElement(component, props.forwardProps)
      }
      return <GizmoSink {...props} />
    }
  }
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
