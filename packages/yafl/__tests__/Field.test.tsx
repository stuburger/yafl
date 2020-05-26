import * as React from 'react'
import { cleanup, render } from '@testing-library/react'
import { createFormContext } from '../src'
import { NO_PROVIDER } from '../src/useSafeContext'
import { ErrorBoundary } from './ErrorBoundry'
import { createFormRenderer, SelectionController, Selection, Toggler } from './helpers'
import { TextInput } from './TextInput'

afterEach(cleanup)

const renderError = (error: Error) => {
  return (
    <div>
      <span>Oops there was an error</span>
      {error.message}
    </div>
  )
}

const TEST_FIELD_NAME = 'fieldUnderTest'
const LABEL_SELECTOR = 'Field Under Test'

describe('<Field />', () => {
  describe('when a Field is rendered outside of a Form Component', () => {
    it('throws an error stating that a Field can only be rendered inside of a Form component', () => {
      const { Field } = createFormContext<any>()
      const api = render(
        <ErrorBoundary renderError={renderError}>
          <Field<string>
            name="test"
            render={(props) => {
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
            render={(props) => {
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

  describe('initial Field value', () => {
    it('has the correct initialValue', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: 'so super cool' }
      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const input = SelectionController.create<HTMLInputElement>(() =>
        api.getByLabelText(LABEL_SELECTOR)
      )

      expect(input.current.value).toEqual(initialValue.fieldUnderTest)
    })

    it('has the correct initial formValue', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: 'sweet cool', username: 'Gooby' }

      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const input = SelectionController.create<HTMLSpanElement>(() =>
        api.getByTestId(`${TEST_FIELD_NAME}_formValue`)
      )

      expect(input.current.innerHTML).toBe(JSON.stringify(initialValue))
    })

    it('has an initial isValid value of true when there are no field validators', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }

      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const input = SelectionController.create<HTMLSpanElement>(() =>
        api.getByTestId(`${TEST_FIELD_NAME}_isValid`)
      )

      expect(input.current.innerHTML).toBe('true')
    })

    it('has an initial isValid value of false when the field is initially invalid', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: 'wow' }

      const api = renderForm(
        { initialValue },
        <Field
          name={TEST_FIELD_NAME}
          label={LABEL_SELECTOR}
          component={TextInput}
          validate={(value) => (value === 'wow' ? 'We cant be wowed' : undefined)}
        />
      )

      const input = SelectionController.create<HTMLSpanElement>(() =>
        api.getByTestId(`${TEST_FIELD_NAME}_isValid`)
      )

      expect(input.current.innerHTML).toBe('false')
    })

    it('has an initial errors when the field is initially invalid', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: 33 }

      const api = renderForm(
        { initialValue },
        <Field
          name={TEST_FIELD_NAME}
          label={LABEL_SELECTOR}
          component={TextInput}
          validate={(value) => (value < 42 ? 'That aint the answer' : undefined)}
        />
      )

      const input = SelectionController.create<HTMLSpanElement>(() =>
        api.getByTestId(`${TEST_FIELD_NAME}_errors`)
      )

      expect(input.current.innerHTML).toBe('That aint the answer')
    })

    it('has an initial isActive value of false', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }

      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const input = SelectionController.create<HTMLSpanElement>(() =>
        api.getByTestId(`${TEST_FIELD_NAME}_isActive`)
      )

      expect(input.current.innerHTML).toBe('false')
    })

    it('has an initial isDirty value of false', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }

      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const input = SelectionController.create<HTMLSpanElement>(() =>
        api.getByTestId(`${TEST_FIELD_NAME}_isDirty`)
      )

      expect(input.current.innerHTML).toBe('false')
    })

    it('has an initial touched value of false', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }

      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const input = SelectionController.create<HTMLSpanElement>(() =>
        api.getByTestId(`${TEST_FIELD_NAME}_touched`)
      )

      expect(input.current.innerHTML).toBe('false')
    })

    it('has an initial visited value of false', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }

      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const input = SelectionController.create<HTMLSpanElement>(() =>
        api.getByTestId(`${TEST_FIELD_NAME}_visited`)
      )

      expect(input.current.innerHTML).toBe('false')
    })

    it('has an initial submitCount value of 0', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }

      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const input = SelectionController.create<HTMLSpanElement>(() =>
        api.getByTestId(`${TEST_FIELD_NAME}_submitCount`)
      )

      expect(input.current.innerHTML).toBe('0')
    })
  })

  describe('interacting with Field components', () => {
    it('updates the value of the Field when onChange event is fired', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }
      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const input = SelectionController.create<HTMLInputElement>(() =>
        api.getByLabelText(LABEL_SELECTOR)
      )
      input.change('tap tap tap')
      expect(input.current.value).toEqual('tap tap tap')
    })

    it('has an isDirty value of true when the Field value is not equal to the initialValue of the Field', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }
      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.getByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        output: () => api.getByTestId(`${TEST_FIELD_NAME}_isDirty`) as HTMLSpanElement,
      })

      selectors.element(TEST_FIELD_NAME).change('tap tap tap')

      expect(selectors.element('output').current.innerHTML).toEqual('true')
    })

    it('has an isActive value of true when the Field value is in focus', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }
      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.getByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        output: () => api.getByTestId(`${TEST_FIELD_NAME}_isActive`) as HTMLSpanElement,
      })

      selectors.element(TEST_FIELD_NAME).focus()

      expect(selectors.element('output').current.innerHTML).toEqual('true')
    })

    it('has an isActive value of false when the Field blurs', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }
      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.getByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        output: () => api.getByTestId(`${TEST_FIELD_NAME}_isActive`) as HTMLSpanElement,
      })

      selectors.element(TEST_FIELD_NAME).focus().blur()

      expect(selectors.element('output').current.innerHTML).toEqual('false')
    })

    it('has touched value of true when the value has changed', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }
      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.getByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        output: () => api.getByTestId(`${TEST_FIELD_NAME}_touched`) as HTMLSpanElement,
      })

      selectors.element(TEST_FIELD_NAME).change('super')

      expect(selectors.element('output').current.innerHTML).toEqual('true')
    })

    it('has visited value of true when the value has changed', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '' }
      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.getByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        output: () => api.getByTestId(`${TEST_FIELD_NAME}_visited`) as HTMLSpanElement,
      })

      selectors.element(TEST_FIELD_NAME).blur()

      expect(selectors.element('output').current.innerHTML).toEqual('true')
    })

    it("has the correct formValue value after changing a Field's value", () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: '', otherField: 42 }
      const api = renderForm(
        { initialValue },
        <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.getByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        output: () => api.getByTestId(`${TEST_FIELD_NAME}_formValue`) as HTMLSpanElement,
      })

      selectors.element(TEST_FIELD_NAME).change('meow').blur()

      expect(selectors.element('output').current.innerHTML).toEqual(
        JSON.stringify({ [TEST_FIELD_NAME]: 'meow', otherField: 42 })
      )
    })
  })

  describe('unmountring a Field', () => {
    it('sanity check/test: Toggler renders the Field', () => {
      const { renderForm, Field } = createFormRenderer()
      const api = renderForm(
        {},
        <Toggler initialValue={true}>
          {({ toggle, value }) => {
            return (
              <>
                <button onClick={toggle}>Toggle</button>
                {value && (
                  <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
                )}
              </>
            )
          }}
        </Toggler>
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.getByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        toggle: () => api.getByText('Toggle') as HTMLButtonElement,
      })

      const input = selectors.element(TEST_FIELD_NAME)
      expect(input).toBeTruthy()
    })

    it('removes the Field from the dom', () => {
      const { renderForm, Field } = createFormRenderer()
      const api = renderForm(
        {},
        <Toggler initialValue={true}>
          {({ toggle, value }) => {
            return (
              <>
                <button onClick={toggle}>Toggle</button>
                {value && (
                  <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
                )}
              </>
            )
          }}
        </Toggler>
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.queryByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        toggle: () => api.getByText('Toggle') as HTMLButtonElement,
      })

      const toggleFieldBtn = selectors.element('toggle')
      toggleFieldBtn.click()

      const input = selectors.element(TEST_FIELD_NAME)
      expect(input.current).toBeNull()
    })

    it('resets the touched value for the Field when the field unmounts', () => {
      const { renderForm, Field } = createFormRenderer<{ [TEST_FIELD_NAME]: boolean }>()
      const api = renderForm(
        {},
        <Toggler initialValue>
          {({ toggle, value }) => {
            return (
              <>
                <button onClick={toggle}>Toggle</button>
                {value && (
                  <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
                )}
              </>
            )
          }}
        </Toggler>
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.queryByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        toggleBtn: () => api.getByText('Toggle') as HTMLButtonElement,
      })

      // sets touched to true for this Field
      selectors.element('fieldUnderTest').change('21')

      // unmounting will unregister this Field which resets this Field's touched state
      selectors.element('toggleBtn').click()

      const props = api.getFormProps()
      expect(props.touched.fieldUnderTest).toBeUndefined()
    })

    it('resets the visited value for the Field when the Field unmounts', () => {
      const { renderForm, Field } = createFormRenderer<{ [TEST_FIELD_NAME]: boolean }>()
      const api = renderForm(
        {},
        <Toggler initialValue>
          {({ toggle, value }) => {
            return (
              <>
                <button onClick={toggle}>Toggle</button>
                {value && (
                  <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
                )}
              </>
            )
          }}
        </Toggler>
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.queryByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        toggleBtn: () => api.getByText('Toggle') as HTMLButtonElement,
      })

      // this will set visited to true
      selectors.element('fieldUnderTest').blur()

      // unmounting the Field should unregister the field
      selectors.element('toggleBtn').click()

      const props = api.getFormProps()
      expect(props.visited.fieldUnderTest).toBeUndefined()
    })

    it("changing a Field's name causes the field to be unregistered and reregistered", () => {
      const { renderForm, Field } = createFormRenderer()
      const initialValue = {
        [TEST_FIELD_NAME]: 'wow',
        other: 42,
      }
      const api = renderForm(
        { initialValue },
        <Toggler initialValue>
          {({ toggle, value }) => {
            return (
              <>
                <button onClick={toggle}>Toggle</button>
                <Field
                  name={value ? TEST_FIELD_NAME : 'other'}
                  label={value ? LABEL_SELECTOR : 'Other Label'}
                  component={TextInput}
                />
              </>
            )
          }}
        </Toggler>
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.queryByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        other: () => api.queryByLabelText('Other Label') as HTMLInputElement,
        toggleBtn: () => api.getByText('Toggle') as HTMLButtonElement,
      })

      const input1 = selectors.element(TEST_FIELD_NAME)
      const input2 = selectors.element('other')
      // ensure that the field under test is initially in the dom

      expect(input1.current.value).toBe('wow')
      expect(input2.current).toBeFalsy()

      // click toggle to change the name of the button
      selectors.element('toggleBtn').click()

      expect(input1.current).toBeFalsy()
      expect(input2.current.value).toBe('42')
    })

    it('mounting a field for the first time registers the Field with the correct value', () => {
      const { renderForm, Field } = createFormRenderer<{ [TEST_FIELD_NAME]: string }>()
      const api = renderForm(
        {
          initialValue: {
            [TEST_FIELD_NAME]: 'wow',
          },
        },
        <Toggler initialValue={false}>
          {({ toggle, value }) => {
            return (
              <>
                <button onClick={toggle}>Toggle</button>
                {value && (
                  <Field name={TEST_FIELD_NAME} label={LABEL_SELECTOR} component={TextInput} />
                )}
              </>
            )
          }}
        </Toggler>
      )

      const selectors = Selection.create({
        [TEST_FIELD_NAME]: () => api.queryByLabelText(LABEL_SELECTOR) as HTMLInputElement,
        toggleBtn: () => api.getByText('Toggle') as HTMLButtonElement,
      })

      // ensure that the Field under test is initially nowhere to be seen
      const input = selectors.element(TEST_FIELD_NAME)
      expect(input.current).toBeFalsy()

      // click toggle
      selectors.element('toggleBtn').click()
      // the Field should now be visible and should contain the correct value
      expect(input.current.value).toBe('wow')
    })
  })

  describe('validation', () => {
    it('registers all errors returned by validate prop', () => {
      const { renderForm, Field } = createFormRenderer()

      const initialValue = { [TEST_FIELD_NAME]: 'wow' }
      let errors: any

      renderForm(
        { initialValue },
        <Field<string>
          name={TEST_FIELD_NAME}
          label={LABEL_SELECTOR}
          render={(props) => {
            errors = props.meta.errors
            return <input {...props.input} />
          }}
          validate={[
            (value) => (value === 'wow' ? 'We cant be wowed' : undefined),
            (value) => (value === 'wow' ? 'Really really cant be wowed' : undefined),
          ]}
        />
      )

      expect(errors).toEqual(['We cant be wowed', 'Really really cant be wowed'])
    })
  })
})
