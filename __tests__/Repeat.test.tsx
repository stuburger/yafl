import * as React from 'react'
import { createFormContext } from '../src'
import { cleanup, render } from 'react-testing-library'
import { ErrorBoundary } from './ErrorBoundry'
import { NO_PROVIDER } from '../src/useSafeContext'

afterEach(cleanup)

const renderError = (error: Error) => {
  return (
    <div>
      <span>Oops there was an error</span>
      {error.message}
    </div>
  )
}

describe('<Repeat />', () => {
  describe('when a Repeat is rendered outside of a Form Component', () => {
    it('throws an error stating that a Repeat can only be rendered inside of a Form component', () => {
      const { Repeat } = createFormContext()
      const { queryByText } = render(
        <ErrorBoundary renderError={renderError}>
          <Repeat name="repeat">{() => null}</Repeat>
        </ErrorBoundary>
      )

      expect(queryByText(NO_PROVIDER)).toBeTruthy()
    })
  })
})
