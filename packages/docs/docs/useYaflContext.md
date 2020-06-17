---
id: useYaflContext
title: useYaflContext()
sidebar_label: useYaflContext()
---

The useYaflContext hook is a handy way to hook your components up to the Yafl context which contains form state and helper functions. Make sure that it is only used underneath a `<Form>` component. Here is a very simple example where we render a reset button what will reset the form to `initialValue` when it is clicked. Notice that `ResetButton` is disabled if the form is *not* dirty or if the form is currently submitting.

## Example usage

```js title="/src/ResetButton.js"
import { useYaflContext } from 'yafl'

const ResetButton = (props) => {
  const { isSubmitting } = props
  const { resetForm, formIsDirty } = useYaflContext()

  <button 
    type="button" 
    onClick={resetForm}
    disabled={!formIsDirty || isSubmitting} 
  >
    Reset
  </button>
}

export default ResetButton
```

```js title="/src/ResetForm.js"
import { useState } from 'react'
import { Form } from 'yafl'
import ResetButton from './ResetButton'
import TextInput from './TextInput'

function ResetForm(props) {
  const { saveProfile, profile } = props
  const [isSubmitting, setSubmitting] = useState(false)
  const { resetForm, formIsDirty } = useYaflContext()

  async function handleSubmit(formValue) {
    setSubmitting(true)
    await saveProfile(formValue)
    setSubmitting(false)
  }

  <Form initialValue={profile} onSubmit={handleSubmit}>
    <Field name="fullname" />
    <Section name="contact">
      <Field name="tel" />
      <Field name="email" />
    </Section>
    <ResetButton isSubmitting={isSubmitting} />
    <button type="submit">Submit</button>
  </button>
}

```

