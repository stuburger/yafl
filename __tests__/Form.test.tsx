import * as React from 'react'
import { cleanup } from 'react-testing-library'
import { Person, Hobby } from '../src'
import renderer from 'react-test-renderer'
import { createFormRenderer } from './helpers'

function TextInput(props: any) {
  return (
    <div>
      <label>{props.label}</label>
      <input {...props.input} />
    </div>
  )
}
const personData: Person = {
  name: 'Stuart Bourhill',
  age: undefined!,
  contact: {
    tel: '07934449898',
    address: {
      code: 'SW9 1EF',
      street: 'adsfa'
    }
  },
  hobbies: [{ type: 'art', name: 'print making' }]
}

const defaultPerson: Person = {
  name: '',
  age: 0,
  contact: {
    tel: '',
    address: {
      code: '',
      street: ''
    }
  },
  hobbies: []
}

describe('<Form />', () => {
  afterEach(cleanup)

  describe('snapshot', () => {
    const { Form, Section, Field, Repeat } = createFormRenderer<Person>()
    it('should match previous snapshot', () => {
      const tree = renderer
        .create(
          <Form initialValue={personData} defaultValue={defaultPerson} onSubmit={() => {}}>
            {yafl => (
              <form onSubmit={yafl.submit}>
                <Field name="firstName" label="First Name" component={TextInput} />
                <Section name="contact">
                  <Field name="tel" label="First Name" component={TextInput} />
                  <Field name="email" label="Email Address" component={TextInput} />
                </Section>
                <Repeat<Hobby>
                  name="hobbies"
                  fallback={[{ type: 'art', name: 'print making' }, undefined, undefined] as any}
                >
                  {hobbies => {
                    return hobbies.map((value, i) => {
                      return (
                        <Section name={i} key={i} fallback={{ type: 'new', name: 'new' }}>
                          <Field name="type" label="Type of hobby" component={TextInput} />
                          <Field name="name" label="Name of hobby" component={TextInput} />
                        </Section>
                      )
                    })
                  }}
                </Repeat>
                <pre>{JSON.stringify(yafl, null, 2)}</pre>
              </form>
            )}
          </Form>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('FormProps', () => {
    type B = { x?: any[]; y?: Date }
    type Thing = { a?: number; b?: B }

    const initialValue: Thing = {
      a: undefined,
      b: {
        x: []
      }
    }

    const date = new Date()
    const defaultValue: Thing = {
      a: 12,
      b: {
        x: [{ name: 'Munk Jones' }],
        y: date
      }
    }

    const { renderForm, Field } = createFormRenderer<Thing>()
    const submitMk = jest.fn()
    const onSubmit = (formValue: Thing) => {
      submitMk(formValue)
    }
    const { getFormProps } = renderForm({
      initialValue,
      defaultValue,
      onSubmit,
      submitUnregisteredValues: true
    })

    const props = getFormProps()

    const expectedStartingValue = {
      a: 12,
      b: { x: [{ name: 'Munk Jones' }], y: date }
    }

    describe('render prop initial values', () => {
      it('supplies the correct values for the forms render props', () => {
        expect(props.initialValue).toEqual(initialValue)
        expect(props.defaultValue).toEqual(defaultValue)
        expect(props.errors).toEqual({})
        expect(props.errorCount).toEqual(0)
        expect(props.formIsDirty).toEqual(false)
        expect(props.initialMount).toEqual(true)
        expect(props.submitCount).toEqual(0)
        expect(props.touched).toEqual({})
        expect(props.visited).toEqual({})
      })

      it('merges defaultValue into initalValue to create the form starting value', () => {
        expect(props.formValue).toEqual(expectedStartingValue)
      })
    })

    describe('FormProps.submit', () => {
      props.submit()

      it('calls the submit function', () => {
        expect(submitMk).toBeCalledTimes(1)
      })

      describe('when submitUnregisteredValues is false', () => {
        it('should call submit with the only registered fields', () => {
          const submitMk = jest.fn()
          const onSubmit = (formValue: Thing) => {
            submitMk(formValue)
            return false
          }
          const { getFormProps } = renderForm(
            {
              initialValue,
              defaultValue,
              onSubmit
            },
            <Field name="a" component="input" />
          )

          const { submit } = getFormProps()
          submit()
          expect(submitMk).toHaveBeenCalledWith({ a: 12 })
        })
      })

      describe('when submitUnregisteredValues is true', () => {
        it('should call submit with the whole formValue', () => {
          expect(submitMk).toHaveBeenCalledWith(expectedStartingValue)
        })
      })

      describe('when onSubmit is called and returns nothing', () => {
        it('should update submitCount', () => {
          const { submitCount } = getFormProps()
          expect(submitCount).toEqual(1)
        })
      })

      describe('when onSubmit is called and returns false', () => {
        it('should not update submitCount', () => {
          const submitMk = jest.fn()
          const onSubmit = (formValue: Thing) => {
            submitMk(formValue)
            return false
          }
          const { getFormProps } = renderForm({
            initialValue,
            defaultValue,
            onSubmit
          })

          const { submit } = getFormProps()

          submit()

          const { submitCount } = getFormProps()

          expect(submitMk).toHaveBeenCalledTimes(1)
          expect(submitCount).toEqual(0)
        })
      })
    })
  })
})

// let temp: FieldProps<Person> = undefined!;
// <Field
//   name="firstName"
//   render={props => {
//     temp = props
//     return <TextInput {...props} />
//   }}
// />

// expect(props.formValue).toEqual(temp.meta.formValue)
