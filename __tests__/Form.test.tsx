import * as React from 'react'
import { cleanup } from '@testing-library/react'
import { Person, Hobby } from '../src'
import renderer from 'react-test-renderer'
import { createFormRenderer, createDataSetter } from './helpers'

type B = { x?: any[]; y?: Date }

type Thing = { a?: number; b?: B }
const { renderForm, Field } = createFormRenderer<Thing>()

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

    describe('when overriding the initial values of touched, visited, and submitCount', () => {
      const overrides: any = {
        initialSubmitCount: 21,
        initialTouched: { a: true },
        initialVisited: {
          b: {
            x: [true],
            y: true
          }
        }
      }

      const { getFormProps, getRenderCount } = renderForm(
        { initialValue, defaultValue, ...overrides },
        <Field<number>
          name="a"
          component={TextInput}
          validate={value => {
            if (value < 15) {
              return 'number too small'
            }
            return
          }}
        />
      )
      const { submitCount, touched, visited, errors, errorCount, formIsValid } = getFormProps()

      it('should only render twice (once before cDM, and once for setting initialMount)', () => {
        expect(getRenderCount()).toEqual(2)
      })

      it(`should set submitCount, touched and visited as supplied by initialSubmitCount,
        initialTouched and initialVisited, respectively`, () => {
        expect(submitCount).toEqual(overrides.initialSubmitCount)
        expect(touched).toEqual(overrides.initialTouched)
        expect(visited).toEqual(overrides.initialVisited)
      })

      it('should set errors according to field validation supplied', () => {
        expect(errors).toEqual({ a: ['number too small'] })
        expect(errorCount).toEqual(1)
        expect(formIsValid).toEqual(false)
      })
    })

    describe('render prop initial values', () => {
      it('supplies the correct values for the forms render props', () => {
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

        expect(props.initialValue).toEqual(initialValue)
        expect(props.defaultValue).toEqual(defaultValue)
        expect(props.errors).toEqual({})
        expect(props.errorCount).toEqual(0)
        expect(props.formIsDirty).toEqual(false)
        expect(props.initialMount).toEqual(true)
        expect(props.formIsValid).toEqual(true)
        expect(props.submitCount).toEqual(0)
        expect(props.touched).toEqual({})
        expect(props.visited).toEqual({})
      })

      it('merges defaultValue into initalValue to create the form starting value', () => {
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

        expect(props.formValue).toEqual(expectedStartingValue)
      })
    })

    describe('FormMeta functions', () => {
      describe('submit', () => {
        it('calls the submit function', () => {
          const submitMk = jest.fn()
          const onSubmit = (formValue: Thing) => {
            submitMk(formValue)
          }
          const { getFormProps, getRenderCount } = renderForm({
            initialValue,
            defaultValue,
            onSubmit
          })
          expect(getRenderCount()).toEqual(2)

          const { submit } = getFormProps()
          submit()
          expect(getRenderCount()).toEqual(3)
          expect(submitMk).toBeCalledTimes(1)
        })

        describe('when submitUnregisteredValues is false', () => {
          it('should call submit with the only registered fields', () => {
            const submitMk = jest.fn()
            const onSubmit = (formValue: Thing) => {
              submitMk(formValue)
            }
            const { getFormProps, getRenderCount } = renderForm(
              {
                initialValue,
                defaultValue,
                onSubmit
              },
              <Field name="a" component="input" />
            )

            expect(getRenderCount()).toEqual(2)
            const { submit } = getFormProps()
            submit()
            expect(getRenderCount()).toEqual(3)
            expect(submitMk).toHaveBeenCalledWith({ a: 12 })
          })
        })

        describe('when submitUnregisteredValues is true', () => {
          it('should call submit with the whole formValue', () => {
            const expectedStartingValue = {
              a: 12,
              b: { x: [{ name: 'Munk Jones' }], y: date }
            }
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

            const { submit } = getFormProps()
            submit()
            const { submitCount } = getFormProps()
            expect(submitCount).toEqual(1)
            expect(submitMk).toHaveBeenCalledWith(expectedStartingValue)
          })
        })

        describe('when onSubmit returns nothing', () => {
          it('should update submitCount', () => {
            const { getFormProps } = renderForm()
            const { submit } = getFormProps()
            submit()
            const { submitCount } = getFormProps()
            expect(submitCount).toEqual(1)
          })
        })

        describe('when onSubmit returns false', () => {
          it('should not update submitCount', () => {
            const submitMk = jest.fn()

            const onSubmit = (formValue: Thing) => {
              submitMk(formValue)
              return false
            }
            const { getFormProps, getRenderCount } = renderForm({
              initialValue,
              defaultValue,
              onSubmit
            })

            expect(getRenderCount()).toEqual(2)
            const { submit } = getFormProps()

            submit()

            const { submitCount } = getFormProps()

            expect(submitMk).toHaveBeenCalledTimes(1)
            expect(submitCount).toEqual(0)
            expect(getRenderCount()).toEqual(2)
          })
        })
      })

      describe('setFormValue', () => {
        it('should set the form value as supplied, but not set touched or visited', () => {
          const { renderForm } = createFormRenderer<Person>()

          const { getFormProps, getRenderCount } = renderForm({
            initialValue: personData,
            defaultValue: defaultPerson
          })

          const { setFormValue } = getFormProps()

          const newContact = {
            tel: '1234567890',
            address: {
              code: '0878',
              street: '2nd Road'
            }
          }

          expect(getRenderCount()).toEqual(2)
          setFormValue(({ contact, ...value }) => ({ ...value, contact: newContact }))

          const { formValue, formIsDirty, errorCount, touched, visited } = getFormProps()
          expect(formValue.contact).toEqual(newContact)
          expect(formIsDirty).toEqual(true)
          expect(errorCount).toEqual(0)
          expect(touched).toEqual({})
          expect(visited).toEqual({})
          expect(getRenderCount()).toEqual(3)
        })
      })

      describe('setFormTouched', () => {
        it('should set touched as supplied', () => {
          const { renderForm } = createFormRenderer<Person>()
          const { getFormProps, getRenderCount } = renderForm({
            initialValue: personData,
            defaultValue: defaultPerson
          })

          expect(getRenderCount()).toEqual(2)

          const { setFormTouched } = getFormProps()
          setFormTouched(touched => ({ ...touched, age: true }))
          const { touched } = getFormProps()
          expect(touched).toEqual({ age: true })
          expect(getRenderCount()).toEqual(3)
        })
      })

      describe('setFormVisited', () => {
        it('should set visited as supplied', () => {
          const { renderForm } = createFormRenderer<Person>()
          const { getFormProps, getRenderCount } = renderForm({
            initialValue: personData,
            defaultValue: defaultPerson
          })

          expect(getRenderCount()).toEqual(2)

          const { setFormVisited } = getFormProps()
          setFormVisited(visited => ({ ...visited, contact: { tel: true } }))
          const { visited } = getFormProps()
          expect(visited).toEqual({ contact: { tel: true } })
          expect(getRenderCount()).toEqual(3)
        })
      })

      describe('resetForm', () => {
        describe('When initial values are supplied for touched, visited and submitCount', () => {
          it('should reset touched, visited and submitCount to supplied initialValues', () => {
            const { renderForm } = createFormRenderer<Person>()
            const overrides = {
              initialSubmitCount: 4,
              initialTouched: {
                age: true
              },
              initialVisited: {
                age: true
              }
            }
            const { getFormProps, getRenderCount } = renderForm({
              initialValue: personData,
              defaultValue: defaultPerson,
              ...overrides
            })

            expect(getRenderCount()).toEqual(2)

            const p = getFormProps()
            expect(p.touched).toEqual({ age: true })
            expect(p.visited).toEqual({ age: true })

            p.resetForm()

            const p2 = getFormProps()

            expect(p2.submitCount).toEqual(overrides.initialSubmitCount)
            expect(p2.touched).toEqual(overrides.initialTouched)
            expect(p2.visited).toEqual(overrides.initialVisited)
          })
        })

        describe('When no initial values are supplied for touched, visited and submitCount', () => {
          it('should reset touched and visited to default initialValues', () => {
            const { renderForm } = createFormRenderer<Person>()

            const { getFormProps, getRenderCount } = renderForm({
              initialValue: personData,
              defaultValue: defaultPerson
            })

            expect(getRenderCount()).toEqual(2)

            const p = getFormProps()
            expect(p.touched).toEqual({})
            expect(p.visited).toEqual({})

            p.resetForm()

            const p2 = getFormProps()

            expect(p2.submitCount).toEqual(0)
            expect(p2.touched).toEqual({})
            expect(p2.visited).toEqual({})
          })
        })
      })

      describe('forgetState', () => {
        const { renderForm } = createFormRenderer<Person>()
        const overrides = {
          initialSubmitCount: 4,
          initialTouched: {
            age: true,
            name: true
          },
          initialVisited: {
            age: true,
            name: true
          }
        }
        const { getFormProps, getRenderCount } = renderForm({
          initialValue: personData,
          defaultValue: defaultPerson,
          ...overrides
        })

        expect(getRenderCount()).toEqual(2)

        const p = getFormProps()

        const formValueBeforeForgetState = p.formValue

        expect(p.touched).toEqual({ age: true, name: true })
        expect(p.visited).toEqual({ age: true, name: true })

        p.forgetState() // forget the values of submitCount, touched and visited

        it('should clear touched and visited', () => {
          const { touched, visited } = getFormProps()
          expect(touched).toEqual({})
          expect(visited).toEqual({})
        })

        it('should reset submitCount', () => {
          const { submitCount } = getFormProps()
          expect(submitCount).toEqual(0)
        })

        it('should not reset or alter formValue in any way', () => {
          const { formValue } = getFormProps()
          expect(formValue).toEqual(formValueBeforeForgetState)
        })
      })
    })
  })

  describe('FormConfig: what happens when the props passed to the <Form /> component change', () => {
    const { renderForm } = createDataSetter<Person>()
    describe('asynchronously setting initialValue to imitate async api calls', () => {
      it('should have correct initialValue and defaultValue', () => {
        const { getFormProps } = renderForm({ defaultValue: defaultPerson })
        const { initialValue, defaultValue } = getFormProps()
        expect(initialValue).toEqual({})
        expect(defaultValue).toEqual(defaultPerson)
      })

      describe('when initialValue is finally set', () => {
        it('should set the formValue', () => {
          const { getFormProps, setFormConfig } = renderForm({ defaultValue: defaultPerson })
          const p = getFormProps()
          expect(p.initialValue).toEqual({})
          expect(p.defaultValue).toEqual(defaultPerson)
          setFormConfig({ initialValue: personData })
          const { initialValue, formValue } = getFormProps()
          expect(initialValue).toEqual(personData)
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
