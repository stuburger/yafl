import * as React from 'react'
import { ProviderValueLoaded, InnerGeneralComponentProps } from '../internal'
import { FormComponentProps, GeneralComponentProps, FormUtils, FormMeta } from '../export'

function wrapConsumer<T>(Consumer: React.Consumer<ProviderValueLoaded<T>>) {
  const Component = getComponent<T>()

  return class FormComponent extends React.Component<FormComponentProps<T>> {
    constructor(props) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(provider: ProviderValueLoaded<T>) {
      const { name, render, component, initialValue, validators, ...props } = this.props
      return (
        <Component render={render} component={component} provider={provider} forwardProps={props} />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}

function getComponent<T>() {
  class FormComponent extends React.Component<InnerGeneralComponentProps<T, keyof T>> {
    collectMetaProps(): FormMeta<T> {
      const { provider } = this.props
      return {
        loaded: provider.loaded,
        submitting: provider.submitting,
        isDirty: provider.formIsDirty,
        touched: provider.formIsTouched,
        submitCount: provider.submitCount,
        isValid: provider.formIsValid,
        validation: provider.validation,
        initialValue: provider.initialValue
      }
    }

    collectUtilProps(): FormUtils<T, keyof T> {
      const { provider } = this.props
      return {
        touch: provider.touch,
        untouch: provider.untouch,
        unload: provider.unload,
        submit: provider.submit,
        resetForm: provider.resetForm,
        getFormValue: provider.getFormValue,
        setFieldValue: provider.setFieldValue,
        forgetState: provider.forgetState,
        clearForm: provider.clearForm
      }
    }

    collectProps(): GeneralComponentProps<T> {
      return {
        state: this.collectMetaProps(),
        utils: this.collectUtilProps(),
        ...this.props.forwardProps
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

      return null
    }
  }

  return FormComponent
}

export default wrapConsumer
