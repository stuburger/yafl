import * as React from 'react'
import { render } from 'react-testing-library'
import { createFormContext, FormProps, FormConfig } from '../src'

export function createFormRenderer<T extends object>() {
  const { Form, Section, Field, Repeat, connect } = createFormContext<T>()
  function noop(e: T, props: FormProps<T>) {}
  function renderForm(props: Partial<FormConfig<T>> = {}, ui: React.ReactNode = null) {
    let injected: FormProps<T>
    const { onSubmit = noop } = props
    return {
      getFormProps(): FormProps<T> {
        return injected
      },
      ...render(
        <Form onSubmit={onSubmit} {...props}>
          {props => {
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
