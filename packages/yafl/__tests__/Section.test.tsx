import * as React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react'
import { createFormContext, Contact } from '../src'
import { ErrorBoundary } from './ErrorBoundry'
import { NO_PROVIDER } from '../src/useSafeContext'
import { createFormRenderer, SelectionController } from './helpers'

const renderError = (error: Error) => {
  return (
    <div>
      <span>Oops there was an error</span>
      {error.message}
    </div>
  )
}

describe('<Section />', () => {
  describe('when a Section is rendered outside of a Form Component', () => {
    it('throws an error stating that a Section can only be rendered inside of a Form component', () => {
      const { Section } = createFormContext()
      const { queryByText } = render(
        <ErrorBoundary renderError={renderError}>
          <Section name="section">{() => null}</Section>
        </ErrorBoundary>
      )

      expect(queryByText(NO_PROVIDER)).toBeTruthy()
    })
  })

  it('Section renders its children when children is a React.Node', () => {
    const { renderForm, Section } = createFormRenderer<{ contact: Contact }>()
    let buttonWasClicked = false
    const { queryByTestId } = renderForm(
      {
        initialValue: {
          contact: {
            tel: '29878786754',
            address: {
              code: 'blah',
              street: 'bleep',
            },
          },
        },
      },
      <Section<Contact> name="contact">
        <button
          type="button"
          data-testid="action"
          onClick={() => {
            buttonWasClicked = true
          }}
        >
          click me
        </button>
      </Section>
    )

    fireEvent.click(queryByTestId('action') as any)

    expect(buttonWasClicked).toBe(true)
  })

  it('setValue: sets the value for the section by passing an object to setValue', () => {
    const { renderForm, Section } = createFormRenderer<{ contact: Contact }>()
    const { queryByTestId, getFormProps } = renderForm(
      {
        initialValue: {
          contact: {
            tel: '29878786754',
            address: {
              code: 'blah',
              street: 'bleep',
            },
          },
        },
      },
      <Section<Contact> name="contact">
        {(_, { setValue }) => {
          return (
            <>
              <button
                data-testid="action"
                type="button"
                onClick={() =>
                  setValue({
                    tel: '000000000',
                    address: {
                      code: 'beans',
                      street: 'toast',
                    },
                  })
                }
              >
                set value
              </button>
            </>
          )
        }}
      </Section>
    )

    fireEvent.click(queryByTestId('action') as any)

    expect(getFormProps().formValue).toEqual({
      contact: {
        tel: '000000000',
        address: {
          code: 'beans',
          street: 'toast',
        },
      },
    })
  })

  it('setValue: sets the value for the section by passing a function to setValue', () => {
    const { renderForm, Section } = createFormRenderer<{ contact: Contact }>()
    const { queryByTestId, getFormProps } = renderForm(
      {
        initialValue: {
          contact: {
            tel: '29878786754',
            address: {
              code: 'blah',
              street: 'bleep',
            },
          },
        },
      },
      <Section<Contact> name="contact">
        {(_, { setValue }) => {
          return (
            <>
              <button
                data-testid="action"
                type="button"
                onClick={() =>
                  setValue((prev) => ({
                    ...prev,
                    tel: '77777777777777',
                  }))
                }
              >
                set value
              </button>
            </>
          )
        }}
      </Section>
    )

    fireEvent.click(queryByTestId('action') as any)

    expect(getFormProps().formValue).toEqual({
      contact: {
        tel: '77777777777777',
        address: {
          code: 'blah',
          street: 'bleep',
        },
      },
    })
  })

  it('Section renders its children when children is a React.Node', () => {
    const { renderForm, Section, Field } = createFormRenderer<{ contact: Contact }>()
    const { queryByTestId } = renderForm(
      {
        initialValue: {
          contact: {
            tel: '29878786754',
            address: {
              code: 'blah',
              street: 'bleep',
            },
          },
        },
      },
      <Section<Contact> name="contact">
        <Field name="tel" data-testid="tel" component="input" />
        <Section<Contact> name="address">
          <Field name="code" data-testid="code" component="input" />
          <Field name="street" data-testid="street" component="input" />
        </Section>
      </Section>
    )

    const input = SelectionController.create<HTMLInputElement>(
      () => queryByTestId('code') as HTMLInputElement
    )

    expect(input.current.value).toEqual('blah')

    input.change('cool code')

    expect(input.current.value).toBe('cool code')
  })

  describe('validators inside a <Section />', () => {
    it('Section renders its children when children is a React.Node', () => {
      const { renderForm, Section, Field } = createFormRenderer<{ contact: Contact }>()
      const { queryByTestId, getFormProps } = renderForm(
        {
          initialValue: {
            contact: {
              tel: '298787867545',
              address: {
                code: 'blah',
                street: 'bleep',
              },
            },
          },
        },
        <Section<Contact> name="contact">
          <Field<string>
            name="tel"
            data-testid="tel"
            component="input"
            validate={(value) => {
              if (value.length < 9) return 'tel too short'
              return undefined
            }}
          />
          <Section<Contact> name="address">
            <Field<string>
              name="code"
              data-testid="code"
              component="input"
              validate={(value) => {
                if (value === 'error') return 'code error'
                return undefined
              }}
            />
            <Field<string>
              name="street"
              data-testid="street"
              component="input"
              validate={(value) => {
                if (value === 'error') return 'street error'
                return undefined
              }}
            />
          </Section>
        </Section>
      )

      const tel = SelectionController.create<HTMLInputElement>(
        () => queryByTestId('tel') as HTMLInputElement
      )
      const code = SelectionController.create<HTMLInputElement>(
        () => queryByTestId('code') as HTMLInputElement
      )
      const street = SelectionController.create<HTMLInputElement>(
        () => queryByTestId('street') as HTMLInputElement
      )

      expect(getFormProps().contact).toBeUndefined()

      tel.change('error')
      code.change('error')
      street.change('error')

      expect(getFormProps().errors).toEqual({
        contact: {
          tel: ['tel too short'],
          address: {
            code: ['code error'],
            street: ['street error'],
          },
        },
      })
    })
  })
})
