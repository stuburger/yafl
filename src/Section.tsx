import * as React from 'react'

export const createSection = (Form: React.ComponentType<any>, Field: React.ComponentType<any>) => {
  return class Section extends React.Component<{ name: string; children: React.ReactNode }> {
    render() {
      return (
        <Field
          name={this.props.name}
          render={(props: any) => {
            return (
              <Form
                allowReinitialize
                loaded={props.meta.loaded}
                rememberStateOnReinitialize
                onChange={props.utils.setValue}
                initialValue={props.input.value}
                submitting={props.meta.submitting}
                defaultValue={props.meta.defaultValue}
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
