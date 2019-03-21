import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { createFormContext } from '../src'
import { NO_PROVIDER } from '../src/useSafeContext'

beforeEach(cleanup)

interface BoundaryState {
  error: Error | null
}

class Boundary extends React.Component<any, BoundaryState> {
  state: BoundaryState = { error: null }
  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  render() {
    const { error } = this.state
    if (error === null) {
      return this.props.children
    }

    return (
      <div>
        <span>Oops there was an error</span>
        {error.message}
      </div>
    )
  }
}

const { Form, Field } = createFormContext<any>()

describe('<Field />', () => {
  describe('when a Field is rendered outside of a Form Component', () => {
    it('throws an error stating that a Field can only be rendered inside of a Form component', () => {
      const api = render(
        <Boundary>
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
        </Boundary>
      )

      expect(api.queryByText(NO_PROVIDER)).toBeTruthy()
    })
  })

  describe('when a Field is rendered inside of a Form Component', () => {
    it('does not throw any errors', () => {
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
      expect((api.getByLabelText('Test Field') as any).value).toBe('wow')
    })
  })
})
