import * as React from 'react'
import { createFormContext } from '../src'
import { cleanup, render } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundry'
import { NO_PROVIDER } from '../src/useSafeContext'
import { createFormRenderer } from './helpers'
import { TextInput } from './TextInput'
import warning from 'tiny-warning'
import { BRANCH_MODE_WARNING } from '../src/warnings'

jest.mock('tiny-warning')

afterEach(() => {
  cleanup()
  jest.resetAllMocks()
})

const renderError = (error: Error) => {
  return (
    <div>
      <span>Oops there was an error</span>
      {error.message}
    </div>
  )
}

describe('<ForwardProps />', () => {
  describe('when a ForwardProps is rendered outside of a Form Component', () => {
    it('throws an error stating that a ForwardProps can only be rendered inside of a Form component', () => {
      const { ForwardProps } = createFormContext()
      const { queryByText } = render(
        <ErrorBoundary renderError={renderError}>
          <ForwardProps>
            <span />
          </ForwardProps>
        </ErrorBoundary>
      )

      expect(queryByText(NO_PROVIDER)).toBeTruthy()
    })
  })

  describe('default mode', () => {
    it('whole prop values are forwarded to and arrive unchanged at all children Field components', () => {
      const { renderForm, Field, Section, ForwardProps } = createFormRenderer<any>()

      const { getByTestId } = renderForm(
        {},
        <ForwardProps superImportantThing="wow">
          <Field name="field1" component={TextInput} />
          <Field name="field2" component={TextInput} />
          <Section name="section">
            <Field name="field3" component={TextInput} />
          </Section>
        </ForwardProps>
      )

      expect(getByTestId('extra_field1').innerHTML).toContain('superImportantThing')
      expect(getByTestId('extra_field2').innerHTML).toContain('superImportantThing')
      expect(getByTestId('extra_field3').innerHTML).toContain('superImportantThing')
    })
  })

  describe('branch mode', () => {
    it('whole prop values are forwarded to and arrive unchanged at all children Field components', () => {
      const branch = {
        field1: 'pigs',
        field2: 'say',
        section: {
          field3: 'oink'
        },
        repeat: ['sweet', 'potatoes']
      }

      const { renderForm, Field, Section, Repeat, ForwardProps } = createFormRenderer<any>()

      const { getByTestId } = renderForm(
        {
          initialValue: {
            repeat: ['', '']
          }
        },
        <ForwardProps mode="branch" branch={branch}>
          <Field name="field1" component={TextInput} />
          <Field name="field2" component={TextInput} />
          <Section name="section">
            <Field name="field3" component={TextInput} />
          </Section>
          <Repeat name="repeat">
            {arr => arr.map((_, i) => <Field key={i} name={i} component={TextInput} />)}
          </Repeat>
        </ForwardProps>
      )

      expect(getByTestId('extra_field1').innerHTML).toMatch(branch.field1)
      expect(getByTestId('extra_field2').innerHTML).toMatch(branch.field2)
      expect(getByTestId('extra_field3').innerHTML).toMatch(branch.section.field3)
      expect(getByTestId('extra_0').innerHTML).toMatch(branch.repeat[0])
      expect(getByTestId('extra_1').innerHTML).toMatch(branch.repeat[1])
    })

    it('warns the user that one or more of the props supplied are not compatible with branch mode', () => {
      const { renderForm, Field, Section, ForwardProps } = createFormRenderer<any>()
      renderForm(
        {},
        <ErrorBoundary renderError={e => null}>
          <ForwardProps mode="branch" good={{ field1: 'wow' }} bad="wow">
            <Field name="field1" component={TextInput} />
            <Field name="field2" component={TextInput} />
            <Section name="section">
              <Field name="field3" component={TextInput} />
            </Section>
          </ForwardProps>
        </ErrorBoundary>
      )

      expect(warning).toHaveBeenCalledWith(false, BRANCH_MODE_WARNING)
    })
  })
})
