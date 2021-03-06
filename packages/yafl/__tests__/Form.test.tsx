import * as React from 'react'
import { act } from '@testing-library/react'
import { Person } from '../src'
import { createFormRenderer, createDataSetter } from './helpers'

type B = { x?: any[]; y?: Date }

type Thing = { a?: number; b?: B }

function TextInput({ label, input }: any) {
  return (
    <div>
      <label htmlFor={input.name}>{label}</label>
      <input {...input} />
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
      street: 'adsfa',
    },
  },
  hobbies: [{ type: 'art', name: 'print making' }],
}

const defaultPerson: Person = {
  name: '',
  age: 0,
  contact: {
    tel: '',
    address: {
      code: '',
      street: '',
    },
  },
  hobbies: [],
}

describe('<Form />', () => {
  describe('FormProps', () => {
    const date = new Date()

    const initialValue: Thing = {
      a: 12,
      b: {
        x: [{ name: 'Munk Jones' }],
        y: date,
      },
    }

    describe('when overriding the initial values of touched, visited, and submitCount', () => {
      const overrides: any = {
        initialSubmitCount: 21,
        initialTouched: { a: true },
        initialVisited: {
          b: {
            x: [true],
            y: true,
          },
        },
      }
      const { renderForm, Field } = createFormRenderer<Thing>()

      const { getFormProps } = renderForm(
        { initialValue, ...overrides },
        <Field<number>
          name="a"
          component={TextInput}
          validate={(value) => {
            if (value < 15) {
              return 'number too small'
            }

            return undefined
          }}
        />
      )
      const { submitCount, touched, visited, errors, errorCount, formIsValid } = getFormProps()

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

        const { renderForm } = createFormRenderer<Thing>()

        const { getFormProps } = renderForm({
          initialValue,
          onSubmit,
          submitUnregisteredValues: true,
        })

        const props = getFormProps()

        expect(props.initialValue).toEqual(initialValue)
        expect(props.errors).toEqual({})
        expect(props.errorCount).toEqual(0)
        expect(props.formIsDirty).toEqual(false)
        expect(props.formIsValid).toEqual(true)
        expect(props.submitCount).toEqual(0)
        expect(props.touched).toEqual({})
        expect(props.visited).toEqual({})
      })
    })

    describe('FormMeta functions', () => {
      describe('submit', () => {
        it('calls the submit function', () => {
          const submitMk = jest.fn()
          const onSubmit = (formValue: Thing) => {
            submitMk(formValue)
          }

          const { renderForm } = createFormRenderer<Thing>()

          const { getFormProps, getRenderCount } = renderForm({
            initialValue,
            onSubmit,
          })
          expect(getRenderCount()).toEqual(2)

          const { submit } = getFormProps()
          act(() => {
            submit()
          })
          expect(getRenderCount()).toEqual(3)
          expect(submitMk).toBeCalledTimes(1)
        })

        describe('when submitUnregisteredValues is false', () => {
          it('should call submit with the only registered fields', () => {
            const submitMk = jest.fn()
            const onSubmit = (formValue: Thing) => {
              submitMk(formValue)
            }

            const { renderForm, Field } = createFormRenderer<Thing>()

            const { getFormProps, getRenderCount } = renderForm(
              {
                initialValue,
                onSubmit,
              },
              <Field name="a" component="input" />
            )

            expect(getRenderCount()).toEqual(2)
            const { submit } = getFormProps()
            act(() => {
              submit()
            })
            expect(getRenderCount()).toEqual(3)
            expect(submitMk).toHaveBeenCalledWith({ a: 12 })
          })
        })

        describe('when submitUnregisteredValues is true', () => {
          it('should call submit with the whole formValue', () => {
            const expectedStartingValue = {
              a: 12,
              b: { x: [{ name: 'Munk Jones' }], y: date },
            }
            const submitMk = jest.fn()
            const onSubmit = (formValue: Thing) => {
              submitMk(formValue)
            }

            const { renderForm } = createFormRenderer<Thing>()

            const { getFormProps } = renderForm({
              onSubmit,
              initialValue: expectedStartingValue,
              submitUnregisteredValues: true,
            })

            const { submit } = getFormProps()
            act(() => {
              submit()
            })
            const { submitCount } = getFormProps()
            expect(submitCount).toEqual(1)
            expect(submitMk).toHaveBeenCalledWith(expectedStartingValue)
          })
        })

        describe('when onSubmit returns nothing', () => {
          it('should update submitCount', () => {
            const { renderForm } = createFormRenderer<Thing>()

            const { getFormProps } = renderForm()
            const { submit } = getFormProps()
            act(() => {
              submit()
            })
            const { submitCount } = getFormProps()
            expect(submitCount).toEqual(1)
          })
        })

        describe('when onSubmit returns false', () => {
          it('should not update submitCount', () => {
            const submitMk = jest.fn()

            const { renderForm } = createFormRenderer<Thing>()

            const onSubmit = (formValue: Thing) => {
              submitMk(formValue)
              return false
            }
            const { getFormProps, getRenderCount } = renderForm({
              initialValue,
              onSubmit,
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
          })

          const { setFormValue } = getFormProps()

          const newContact = {
            tel: '1234567890',
            address: {
              code: '0878',
              street: '2nd Road',
            },
          }

          expect(getRenderCount()).toEqual(2)
          act(() => {
            setFormValue(({ contact, ...value }) => ({ ...value, contact: newContact }))
          })

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
          })

          expect(getRenderCount()).toEqual(2)

          const { setFormTouched } = getFormProps()
          act(() => {
            setFormTouched((touched) => ({ ...touched, age: true }))
          })
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
          })

          expect(getRenderCount()).toEqual(2)

          const { setFormVisited } = getFormProps()
          act(() => {
            setFormVisited((visited) => ({ ...visited, contact: { tel: true } }))
          })
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
                age: true,
              },
              initialVisited: {
                age: true,
              },
            }
            const { getFormProps, getRenderCount } = renderForm({
              initialValue: personData,
              ...overrides,
            })

            expect(getRenderCount()).toEqual(2)

            const p = getFormProps()
            expect(p.touched).toEqual({ age: true })
            expect(p.visited).toEqual({ age: true })

            act(() => {
              p.resetForm()
            })

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
            })

            expect(getRenderCount()).toEqual(2)

            const p = getFormProps()
            expect(p.touched).toEqual({})
            expect(p.visited).toEqual({})

            act(() => {
              p.resetForm()
            })

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
            name: true,
          },
          initialVisited: {
            age: true,
            name: true,
          },
        }
        const { getFormProps, getRenderCount } = renderForm({
          initialValue: personData,
          ...overrides,
        })

        expect(getRenderCount()).toEqual(2)

        const p = getFormProps()

        const formValueBeforeForgetState = p.formValue

        expect(p.touched).toEqual({ age: true, name: true })
        expect(p.visited).toEqual({ age: true, name: true })

        act(() => {
          p.forgetState() // forget the values of submitCount, touched and visited
        })

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
    const { renderForm, Field, Section } = createDataSetter<Person>()
    describe('asynchronously setting initialValue to imitate async api calls', () => {
      it('should have correct initialValue', () => {
        const { getFormProps } = renderForm({ initialValue: defaultPerson })
        const { initialValue } = getFormProps()
        expect(initialValue).toEqual(defaultPerson)
      })

      describe('regression: when initialValue is initially set to null', () => {
        it('should set the formValue with new incoming value when it arrives', () => {
          const { getFormProps, setFormConfig } = renderForm(
            {
              initialValue: null!,
            },
            <Section name="contact">
              <Field name="tel" component="input" />
            </Section>
          )
          const p = getFormProps()
          expect(p.initialValue).toEqual(null)
          act(() => {
            setFormConfig({ initialValue: personData })
          })
          const { formValue } = getFormProps()
          expect(formValue).toEqual(personData)
        })
      })

      describe('regression: when initialValue is initially set to undefined', () => {
        it('should set the formValue with new incoming value when it arrives', () => {
          const { getFormProps, setFormConfig } = renderForm(
            {
              initialValue: undefined!,
            },
            <Section name="contact">
              <Field name="tel" component="input" />
            </Section>
          )
          const p = getFormProps()
          expect(p.initialValue).toEqual(undefined)
          act(() => {
            setFormConfig({ initialValue: personData })
          })
          const { formValue } = getFormProps()
          expect(formValue).toEqual(personData)
        })
      })

      describe('when initialValue is initially set to a default value', () => {
        it('should set the formValue with new incoming value', () => {
          const { getFormProps, setFormConfig } = renderForm({
            initialValue: defaultPerson,
          })
          const p = getFormProps()
          expect(p.initialValue).toEqual(defaultPerson)
          act(() => {
            setFormConfig({ initialValue: personData })
          })
          const { formValue } = getFormProps()
          expect(formValue).toEqual(personData)
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
