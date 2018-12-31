import * as React from 'react'
import { render } from 'react-testing-library'
import { createFormContext, FormProps, FormConfig } from '../src'

interface Props<T extends object> {
  initialProps: Partial<FormConfig<T>>
  children: (state: State<T>, setProps: (setFn: SetProps<T>) => void) => React.ReactNode
}

type SetProps<T extends object> =
  | ((prev: Partial<FormConfig<T>>) => Partial<FormConfig<T>>)
  | Partial<FormConfig<T>>

interface State<T extends object> extends Partial<FormConfig<T>> {}

export function createDataSetter<T extends object>() {
  const { Form, Section, Field, Repeat, connect } = createFormContext<T>()
  class DataSetter extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>) {
      super(props)

      this.state = { ...props.initialProps }
    }

    setProps = (setFn: SetProps<T>) => {
      this.setState(setFn)
    }

    render() {
      return this.props.children(this.state, this.setProps)
    }
  }

  function noop(e: T, props: FormProps<T>) {}
  function renderForm(initialProps: Partial<FormConfig<T>> = {}, ui: React.ReactNode = null) {
    let injected: FormProps<T>
    let setPropsFn: (prev: SetProps<T>) => void
    let containerState: State<T>
    let renderCount: number = 0

    return {
      getRenderCount(): number {
        return renderCount
      },
      getFormProps(): FormProps<T> {
        return injected
      },
      setFormConfig(setFn: SetProps<T>): void {
        setPropsFn(setFn)
      },
      getFormConfig(): State<T> {
        return containerState
      },
      ...render(
        <DataSetter initialProps={initialProps}>
          {(state, setFn) => {
            containerState = state
            setPropsFn = setFn
            return (
              <Form onSubmit={noop} {...state}>
                {props => {
                  renderCount = renderCount + 1
                  injected = props
                  return ui
                }}
              </Form>
            )
          }}
        </DataSetter>
      )
    }
  }

  return {
    renderForm,
    Form,
    Section,
    Field,
    Repeat,
    connect
  }
}

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
