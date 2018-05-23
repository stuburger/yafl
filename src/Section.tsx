import * as React from 'react'
import { FormProviderConfig, FieldConfig, SectionConfig } from './sharedTypes'

export const createSection = <T extends object, K extends keyof T = keyof T>(
  Form: React.ComponentClass<FormProviderConfig<T[K] & object>>,
  Field: React.ComponentClass<FieldConfig<T, K>>,
  fieldName?: K
) => {
  return class Section extends React.Component<SectionConfig<T, K>> {
    static createSection = function<P extends object & keyof T[K], N extends keyof P>(
      Form: React.ComponentClass<FormProviderConfig<T[K][P]>>,
      Field: React.ComponentClass<FieldConfig<P, N>>,
      fieldName?: N
    ): React.ComponentClass<SectionConfig<P, N>> {
      return createSection<P, N>(Form, Field, fieldName)
    }

    constructor(props: SectionConfig<T, K>) {
      super(props)
      this._renderChildren = this._renderChildren.bind(this)
    }

    componentWillUnmount() {
      console.log('Section willUnmount')
    }

    _renderChildren(value: T[K]) {
      const { children } = this.props
      if (typeof children === 'function') {
        return children(value)
      } else {
        return children
      }
    }

    render() {
      const { name, defaultValue } = this.props
      return (
        <Field
          name={fieldName || name}
          render={props => {
            const { input, utils, meta } = props
            return (
              <Form
                onSubmit={utils.submit}
                allowReinitialize
                loaded={meta.loaded}
                rememberStateOnReinitialize
                onChange={utils.setValue}
                initialValue={input.value as any}
                submitting={meta.submitting}
                defaultValue={defaultValue || (meta.defaultValue as any)}
              >
                {this._renderChildren(input.value)}
              </Form>
            )
          }}
        />
      )
    }
  }
}
