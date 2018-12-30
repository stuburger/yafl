import * as React from 'react'
import { render } from 'react-testing-library'
import { createFormContext, FormProps, FormConfig } from '../src'

export function createFormRenderer<T extends object>() {
  const { Form, Section, Field, Repeat, connect } = createFormContext<T>()
  function noop(e: T, props: FormProps<T>) {}
  function renderForm(props: Partial<FormConfig<T>> = {}, ui: React.ReactNode = null) {
    let injected: FormProps<T>
    let renderCount: number = 0
    const { onSubmit = noop } = props
    return {
      getRenderCount(): number {
        return renderCount
      },
      getFormProps(): FormProps<T> {
        return injected
      },
      ...render(
        <Form onSubmit={onSubmit} {...props}>
          {props => {
            renderCount = renderCount + 1
            injected = props
            return ui
          }}
        </Form>
      )
    }
  }

  return {
    Form,
    renderForm,
    Section,
    Field,
    Repeat,
    connect
  }
}
