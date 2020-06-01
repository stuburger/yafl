/* eslint-disable no-console */
import * as React from 'react'
import { cleanup, render } from '@testing-library/react'
import { createFormContext } from '../src'
import ErrorBoundary from './ErrorBoundry'
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

describe('<FormError />', () => {
  describe('when a FormError is rendered outside of a Form Component', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error')
      // @ts-ignore
      console.error.mockImplementation(() => {})
    })

    afterEach(() => {
      // @ts-ignore
      console.error.mockRestore()
    })

    it('throws an error stating that a FormError can only be rendered inside of a Form component', () => {
      const { FormError } = createFormContext()
      const { queryByText } = render(
        <ErrorBoundary renderError={renderError}>
          <FormError path="test">{() => null}</FormError>
        </ErrorBoundary>
      )

      expect(queryByText(NO_PROVIDER)).toBeTruthy()
    })
  })
})
