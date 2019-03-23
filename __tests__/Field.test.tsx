import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { createFormContext } from '../src'
import { NO_PROVIDER } from '../src/useSafeContext'
import { ErrorBoundary } from './ErrorBoundry'

afterEach(cleanup)

const renderError = (error: Error) => {
  return (
    <div>
      <span>Oops there was an error</span>
      {error.message}
    </div>
  )
}

describe('<Field />', () => {
  describe('when a Field is rendered outside of a Form Component', () => {
    it('throws an error stating that a Field can only be rendered inside of a Form component', () => {
      const { Field } = createFormContext<any>()
      const api = render(
        <ErrorBoundary renderError={renderError}>
          <Field<string>
            name="test"
            render={props => {
              return (
                <>
                  <label htmlFor={props.input.name} />
                  <input {...props.input} />
                </>
              )
            }}
          />
        </ErrorBoundary>
      )

      expect(api.queryByText(NO_PROVIDER)).toBeTruthy()
    })
  })

  describe('when a Field is rendered inside of a Form Component', () => {
    it('does not throw any errors', () => {
      const { Form, Field } = createFormContext<any>()
      const api = render(
        <Form initialValue={{ test: 'wow' }} onSubmit={() => {}}>
          <Field<string>
            name="test"
            render={props => {
              return (
                <>
                  <label htmlFor={props.input.name}>Test Field</label>
                  <input id={props.input.name} {...props.input} />
                </>
              )
            }}
          />
        </Form>
      )

      // todo typing dont seem to be correct
      expect((api.getByLabelText('Test Field') as HTMLInputElement).value).toBe('wow')
    })
  })
})
