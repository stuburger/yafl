/* eslint-disable react/no-array-index-key */
import * as React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, fireEvent } from '@testing-library/react'
import { createFormContext } from '../src'
import { ErrorBoundary } from './ErrorBoundry'
import { NO_PROVIDER } from '../src/useSafeContext'
import { createFormRenderer } from './helpers'

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

    describe('Repeat helper functions', () => {
      it('push: pushes an item onto the end of an array field', () => {
        const { renderForm, Field, Repeat } = createFormRenderer<{ arr: string[] }>()
        const { queryByTestId, getFormProps } = renderForm(
          { initialValue: { arr: [] } },
          <Repeat<string> name="arr">
            {(values, { push }) => {
              return (
                <>
                  <button type="button" data-testid="adder" onClick={() => push('blah')}>
                    push
                  </button>
                  {values.map((_, i) => {
                    return <Field key={i} name={i} component="input" />
                  })}
                </>
              )
            }}
          </Repeat>
        )

        fireEvent.click(queryByTestId('adder') as any)

        expect(getFormProps().formValue).toEqual({ arr: ['blah'] })
      })

      it('remove: deletes an item from specified index in array', () => {
        const { renderForm, Field, Repeat } = createFormRenderer<{ arr: string[] }>()
        const { queryByTestId, getFormProps } = renderForm(
          { initialValue: { arr: ['cool', 'beans', 'yo', 'sweet', 'potatoes'] } },
          <Repeat<string> name="arr">
            {(values, { remove }) => {
              return (
                <>
                  <button type="button" data-testid="adder" onClick={() => remove(2)}>
                    remove
                  </button>
                  {values.map((_, i) => {
                    return <Field key={i} name={i} component="input" />
                  })}
                </>
              )
            }}
          </Repeat>
        )

        fireEvent.click(queryByTestId('adder') as any)

        expect(getFormProps().formValue).toEqual({ arr: ['cool', 'beans', 'sweet', 'potatoes'] })
      })

      it('shift: removes the first item from an array', () => {
        const { renderForm, Field, Repeat } = createFormRenderer<{ arr: string[] }>()
        const { queryByTestId, getFormProps } = renderForm(
          { initialValue: { arr: ['cool', 'beans', 'sweet', 'potatoes'] } },
          <Repeat<string> name="arr">
            {(values, { shift }) => {
              return (
                <>
                  <button type="button" data-testid="adder" onClick={() => shift()}>
                    shift
                  </button>
                  {values.map((_, i) => {
                    return <Field key={i} name={i} component="input" />
                  })}
                </>
              )
            }}
          </Repeat>
        )

        fireEvent.click(queryByTestId('adder') as any)

        expect(getFormProps().formValue).toEqual({ arr: ['beans', 'sweet', 'potatoes'] })
      })

      it('swap: swaps 2 elements in an array at specified positions', () => {
        const { renderForm, Field, Repeat } = createFormRenderer<{ arr: string[] }>()
        const { queryByTestId, getFormProps } = renderForm(
          { initialValue: { arr: ['cool', 'beans', 'sweet', 'potatoes'] } },
          <Repeat<string> name="arr">
            {(values, { swap }) => {
              return (
                <>
                  <button type="button" data-testid="adder" onClick={() => swap(1, 2)}>
                    swap
                  </button>
                  {values.map((_, i) => {
                    return <Field key={i} name={i} component="input" />
                  })}
                </>
              )
            }}
          </Repeat>
        )

        fireEvent.click(queryByTestId('adder') as any)

        expect(getFormProps().formValue).toEqual({ arr: ['cool', 'sweet', 'beans', 'potatoes'] })
      })

      it('setValue: supplying an array value sets the value of the array by overwriting the previous value', () => {
        const { renderForm, Field, Repeat } = createFormRenderer<{ arr: string[] }>()
        const { queryByTestId, getFormProps } = renderForm(
          { initialValue: { arr: ['cool', 'beans', 'sweet', 'potatoes'] } },
          <Repeat<string> name="arr">
            {(values, { setValue }) => {
              return (
                <>
                  <button
                    type="button"
                    data-testid="adder"
                    onClick={() => setValue(['we', 'are', 'one'])}
                  >
                    setValue
                  </button>
                  {values.map((_, i) => {
                    return <Field key={i} name={i} component="input" />
                  })}
                </>
              )
            }}
          </Repeat>
        )

        fireEvent.click(queryByTestId('adder') as any)

        expect(getFormProps().formValue).toEqual({ arr: ['we', 'are', 'one'] })
      })

      it('setValue: supplying a setValue function sets the value of the array', () => {
        const { renderForm, Field, Repeat } = createFormRenderer<{ arr: string[] }>()
        const { queryByTestId, getFormProps } = renderForm(
          { initialValue: { arr: ['cool', 'beans', 'sweet', 'potatoes'] } },
          <Repeat<string> name="arr">
            {(values, { setValue }) => {
              return (
                <>
                  <button
                    data-testid="adder"
                    type="button"
                    onClick={() => setValue((prev) => [...prev, 'we', 'are', 'one'])}
                  >
                    setValue
                  </button>
                  {values.map((_, i) => {
                    return <Field key={i} name={i} component="input" />
                  })}
                </>
              )
            }}
          </Repeat>
        )

        fireEvent.click(queryByTestId('adder') as any)

        expect(getFormProps().formValue).toEqual({
          arr: ['cool', 'beans', 'sweet', 'potatoes', 'we', 'are', 'one'],
        })
      })

      it('unshift: adds an item to the front of an array', () => {
        const { renderForm, Field, Repeat } = createFormRenderer<{ arr: string[] }>()
        const { queryByTestId, getFormProps } = renderForm(
          { initialValue: { arr: ['cool', 'beans', 'sweet', 'potatoes'] } },
          <Repeat<string> name="arr">
            {(values, { unshift }) => {
              return (
                <>
                  <button data-testid="adder" onClick={() => unshift(...['a', 'b'])} type="button">
                    unshift
                  </button>
                  {values.map((_, i) => {
                    return <Field key={i} name={i} component="input" />
                  })}
                </>
              )
            }}
          </Repeat>
        )

        fireEvent.click(queryByTestId('adder') as any)

        expect(getFormProps().formValue).toEqual({
          arr: ['a', 'b', 'cool', 'beans', 'sweet', 'potatoes'],
        })
      })

      it('pop: pops a value off the end of an array', () => {
        const { renderForm, Field, Repeat } = createFormRenderer<{ arr: string[] }>()
        const { queryByTestId, getFormProps } = renderForm(
          { initialValue: { arr: ['cool', 'beans', 'sweet', 'potatoes'] } },
          <Repeat<string> name="arr">
            {(values, { pop }) => {
              return (
                <>
                  <button data-testid="adder" onClick={() => pop()} type="button">
                    pop
                  </button>
                  {values.map((_, i) => {
                    return <Field key={i} name={i} component="input" />
                  })}
                </>
              )
            }}
          </Repeat>
        )

        fireEvent.click(queryByTestId('adder') as any)

        expect(getFormProps().formValue).toEqual({
          arr: ['cool', 'beans', 'sweet'],
        })
      })

      it('insert: insets a value into an array at specified index', () => {
        const { renderForm, Field, Repeat } = createFormRenderer<{ arr: string[] }>()
        const { queryByTestId, getFormProps } = renderForm(
          { initialValue: { arr: ['cool', 'beans', 'sweet', 'potatoes'] } },
          <Repeat<string> name="arr">
            {(values, { insert }) => {
              return (
                <>
                  <button data-testid="adder" onClick={() => insert(1, 'a', 'b')} type="button">
                    insert
                  </button>
                  {values.map((_, i) => {
                    return <Field key={i} name={i} component="input" />
                  })}
                </>
              )
            }}
          </Repeat>
        )

        fireEvent.click(queryByTestId('adder') as any)

        expect(getFormProps().formValue).toEqual({
          arr: ['cool', 'a', 'b', 'beans', 'sweet', 'potatoes'],
        })
      })
    })
  })
})
