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

    componentWillUnmount() {
      console.log('Section willUnmount')
    }

    render() {
      const { name } = this.props
      return (
        <Field
          name={fieldName || name}
          render={props => {
            return (
              <Form
                onSubmit={props.utils.submit}
                allowReinitialize
                loaded={props.meta.loaded}
                rememberStateOnReinitialize
                onChange={props.utils.setValue}
                initialValue={props.input.value as any}
                submitting={props.meta.submitting}
                defaultValue={props.meta.defaultValue as any}
              >
                {this.props.children}
              </Form>
            )
          }}
        />
      )
    }
  }
}
