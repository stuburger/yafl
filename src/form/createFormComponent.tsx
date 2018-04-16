import * as React from 'react'
import { ProviderValue, FormComponentProps, FormComponentWrapper } from '../'

function wrapConsumer<T>(Consumer: React.Consumer<ProviderValue<T>>) {
  const Component = getComponent<T>()

  return class FormComponent extends React.Component<FormComponentWrapper<T>> {
    _render = ({
      registerValidator,
      registerField,
      onFieldBlur,
      ...providerValue
    }: ProviderValue<T>) => {
      return <Component {...this.props} {...providerValue} />
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}

function getComponent<T>() {
  class FormComponent extends React.Component<FormComponentProps<T>> {
    render() {
      const { render, component: Component, ...props } = this.props

      if (render) {
        return render(props)
      }

      if (Component) {
        return <Component {...props} />
      }

      return null
    }
  }

  return FormComponent
}

export default wrapConsumer
