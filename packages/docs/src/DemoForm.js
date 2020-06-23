/* eslint-disable react/sort-comp */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { YaflProvider, Section, FormError, useYaflContext, useForm } from 'yafl'
import Input from './Input'
import { required, minLength, email, min } from './validators'
import FormatJson from './FormatJson'

const initialValue = {
  fullName: '',
  age: 0,
  contact: {
    tel: '',
    email: '',
    random: {
      address: {
        streetNo: '',
      },
    },
  },
}

function DemoForm() {
  const [isSubmitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState(initialValue)

  const yafl = useForm({
    initialValue: formData,
    onSubmit: (value) => {
      setSubmitting(true)
      setTimeout(() => {
        setFormData(value)
        setSubmitting(false)
      }, 1200)
    },
  })

  return (
    <YaflProvider value={yafl}>
      <form onSubmit={yafl.submit}>
        <div className="row">
          <div className="col col--4">
            <p className="hero__subtitle">Form Value</p>
            <FormatJson value={yafl.formValue} />
          </div>
          <div className="col col--4">
            <p className="hero__subtitle">Demo Form</p>
            <Input
              name="fullName"
              label="Full Name"
              placeholder="E.g. John Smith"
              validate={[required, minLength(3)]}
            />
            <Input
              name="age"
              type="number"
              label="Age"
              validate={[required, min(5, 'Must be at least 5 years old!')]}
              placeholder="E.g. 29"
            />
            <Section name="contact">
              <Input
                name="email"
                label="Email"
                placeholder="E.g. example@email.com"
                validate={[required, email()]}
                // busy={asyncValidating}
              />
              <FormError
                path="contact.email"
                // msg={asyncEmailError}
              />
              <Section name="random.address">
                <Input name="postalCode" label="Postal Code" placeholder="Postal Code" />
              </Section>
            </Section>
            <Submit submitting={isSubmitting} fetching={false} />
          </div>

          <div className="col col--4">
            <p className="hero__subtitle">Meta State</p>
            <FormatJson
              value={{
                activeField: yafl.activeField,
                submitCount: yafl.submitCount,
                errorCount: yafl.errorCount,
                formIsValid: yafl.formIsValid,
                formIsDirty: yafl.formIsDirty,
                touched: yafl.touched,
              }}
            />
          </div>
          <div className="col col--12">
            <p className="hero__subtitle">Errors</p>
            <FormatJson value={{ errorCount: yafl.errorCount, errors: yafl.errors }} />
          </div>
        </div>
      </form>
    </YaflProvider>
  )
}

export default DemoForm

const Submit = ({ fetching, submitting }) => {
  const yafl = useYaflContext()
  return (
    <button
      type="submit"
      className="button button--outline button--primary text--right"
      disabled={fetching || submitting}
    >
      {fetching
        ? 'Loading ⏳'
        : submitting
        ? 'Saving ⏳'
        : yafl.formIsDirty
        ? 'Save 🚀'
        : 'Saved 👍'}
    </button>
  )
}
