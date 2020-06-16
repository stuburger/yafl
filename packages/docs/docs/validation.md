---
id: validation
title: Validating user input
sidebar_label: Validation
---

Validation in Yalf is opinionated but straight forward and is usually done at the field-level. Most form libraries provide form-level validation as a means to give access to the entire form's values by way of a `validate` prop on the Form component. That's great, but Yafl gives you access to the form value at the field-level, so form-level validation becomes somewhat redundant. Futhuremore there are some benefits to favouring field-level validation:

1. Validation logic is always co-located with the field that it's validating. This means when you delete a field, for example, you are only removing code from one place and not two.
2. Easier to reason about and easier to debug form validation.
3. Easier to compose and share field validation logic by making use of individual field validators.
4. Semantically it makes more sense to validate a field on its own. Whether a form is valid or not is a function of the validity of its fields only.

That isn't to say yafl doesn't support form-level validation - Yafl provides you with the primitives that allow you to enable form-level validation using a library like Yup. More on that in a bit, but first let's learn how to do field-level validation.

## Field-level validation

Let's enable field-level validation in our `TextInput` component:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="js"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'TypeScript', value: 'ts'},
  ]}>
 <TabItem value="js">

```js title="/src/TextInput.js"
import { useField } from 'yafl'

function TextInput(props) {
  const { name, label, type, validate } = props
  const [input, meta] = useField(name, { validate });
  const { isValid, touched, submitCount, errors = [] } = meta;
  const showError = !isValid && (touched || submitCount > 0);

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input name={name} type={type} {...input} />
      {showError && <div>{errors[0]}</div>}
    </>
  );
}

export default TextInput
```

</TabItem>
<TabItem value="ts">

```ts title="/src/TextInput.ts"
import { useField, FieldValidator } from 'yafl'

interface TextInputProps<T, F extends object> {
  name: string;
  label: string;
  type?: string;
  validate?: FieldValidator<T, F> | Array<FieldValidator<T, F>>
}

function TextInput<T, F extends object = {}>(props: TextInputProps<T, F>) {
  const { name, label, type = 'text', validate } = props
  const [input, meta] = useField<T, F>(name, { validate });
  const { isValid, touched, submitCount, errors = [] } = meta;
  const showError = !isValid && (touched || submitCount > 0);

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input name={name} type={type} {...input} />
      {showError && <div>{errors[0]}</div>}
    </>
  );
}

export default TextInput
```

</TabItem>
</Tabs>

There are a couple of things to take note of here. The first thing to pay attention to is the addition of the `validate` prop that is then supplied to `useField`'s config options. `validate` is a function or array of functions that are executed every time the `value` for this field changes - regardless of how or when the field changes*.

What else is there? For one thing you can see that we are now making use of the second value in the tuple returned from `useField`. This `meta` value contains meta information about the field. This is then being used to decide when to display field errors. 

In this particular case we're saying, only show errors when:
* the field is in fact _invalid_ (`isValid = errors.length === 0`) and,
* the field has been `touched` or,
* the form has been submitted at least once


> \* **Note:**
> That's right, validation errors in Yafl are derived any time a field's value changes. Field errors, and by extension form errors, are determined by simply looking at the values of a field and running them through a validation function or set of validation functions. In other words, there is no such thing as (and no need for) a `validateOnBlur` or `validateOnChange` prop in Yafl. Validation is declaritive and validity is described only by the current values that the form holds. 
>
> It is up to you to decide when to display these errors based on the metadata of your form. For example you might display errors for a field based on whether a field is `touched` or not, or perhaps a little later on in the user's workflow - for example, once the user has attempted form submission.

### Field validators

Now we can supply the validation functions to our `TextInput`s from the `SignupForm` component by way of the `validate` prop:

<Tabs
  defaultValue="js"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'TypeScript', value: 'ts'},
  ]}>
 <TabItem value="js">

```js title="/src/SignupForm.js"
import React from 'react'
import { Form } from 'yafl'
import TextInput from './TextInput'

const initialValue = {
  email: '',
  password: '',
  confimPassword: ''
}

function SignupForm(props) {
  function handleSubmit(value) {
    console.log(value)
  }

  return (
    <Form
      initialValue={initialValue} 
      onSubmit={handleSubmit}
    >
      {(yafl) => (
        <form onSubmit={yafl.submit}>
          <TextInput 
            name="email"
            validate={(email) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
                return 'Email is not valid'
              }
            }}
          />
          <TextInput 
            name="password" 
            type="password"
            validate={(password) => {
              if (password.length < 8) {
                return 'Password too short'
              }
            }}
          />
          <TextInput 
            name="confirmPassword"
            type="password"
            validate={(password, formValue) => {
              if (password !== formValue.confirmPassword) {
                return 'Passwords do not match'
              }
            }}
          />
          <button type="submit">Sign up!<button>
        </form>
      )}
    </Form>
  )
}

```

</TabItem>
<TabItem value="ts">

```ts title="/src/SignupForm.ts"
import React from 'react'
import { Form } from 'yafl'
import TextInput from './TextInput'

interface FormValue {
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValue: FormValue = {
  email: '',
  password: '',
  confimPassword: ''
}

function SignupForm(props: {}) {
  function handleSubmit(value: FormValue) {
    console.log(value)
  }

  return (
    <Form<FormValue> 
      initialValue={initialValue} 
      onSubmit={handleSubmit}
    >
      {(yafl) => (
        <form onSubmit={yafl.submit}>
          <TextInput<string> 
            name="email"
            validate={(email) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
                return 'Email is not valid'
              }
            }}
          />
          <TextInput<string> 
            name="password" 
            type="password"
            validate={(password) => {
              if (password.length < 8) {
                return 'Password too short'
              }
            }}
          />
          <TextInput<string, FormValue> 
            name="confirmPassword" 
            type="password"
            validate={(password, formValue) => {
              if (password !== formValue.confirmPassword) {
                return 'Passwords do not match'
              }
            }}
          />
          <button type="submit">Sign up!<button>
        </form>
      )}
    </Form>
  )
}
```

</TabItem>
</Tabs>


This should be all that is needed to enable field-level validation. Notice that in each case we are only supplying a single validation function to each `TextInput` but note that this could also be an array of validation functions. While this is done inline for illustrative purposes it is easy to pull them out into their own reusable functions to be consumed by any forms across your app. A validator should return a `string` representing the error message to be displayed to your user when the field is invalid and `undefined` if it is valid.


## Form-level validation

While field-level validation is the approach we recommend, Yafl is flexible enough to shoehorn a form-level validation implementation into your app. Let's take a look at how it can be done using Yup:

<Tabs
  defaultValue="js"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'TypeScript', value: 'ts'},
  ]}>
 <TabItem value="js">

```js title="/src/SignupForm.js"
import React from 'react'
import { Form } from 'yafl'
import * as yup from 'yup'
import set from 'lodash.set'
import TextInput from './TextInput'

const schema = yup.object({
  email: yup
    .string()
    .email()
  password: yup
    .string()
    .required("Password is required")
    .min(8),
  confirmPassword: yup
    .string()
    .when("password", {
      is: val => val && val.length > 0,
      then: yup
        .string()
        .oneOf([yup.ref("password")], "Both passwords need to be the same")
        .required()
  }
});

function validate(value) {
  try {
    schema.validateSync(value, { abortEarly: false });
    // if all goes well return an empty error object
    return {};
  } catch (errors) {
    // otherwise catch and extract errors
    const { inner } = errors;
    return inner.reduce((ret, x) => set(ret, x.path, x.message), {});
  }
};

const initialValue = {
  email: '',
  password: '',
  confimPassword: ''
}

function SignupForm(props) {
  function handleSubmit(value) {
    console.log(value)
  }

  return (
    <Form
      initialValue={initialValue} 
      onSubmit={handleSubmit}
      branchValues={({ formValue }) => ({ error: validate(formValue) })}
    >
      {(yafl) => (
        <form onSubmit={yafl.submit}>
          <TextInput name="email" />
          <TextInput name="password" type="password" />
          <TextInput name="confirmPassword" type="password" />
          <button type="submit">Sign up!<button>
        </form>
      )}
    </Form>
  )
}
```

</TabItem>
<TabItem value="ts">

```ts title="/src/SignupForm.ts"
import React from 'react'
import { Form } from 'yafl'
import * as yup from 'yup'
import set from 'lodash.set'
import TextInput from './TextInput'

interface FormValue {
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email()
  password: yup
    .string()
    .required("Password is required")
    .min(8),
  confirmPassword: yup
    .string()
    .when("password", {
      is: val => val && val.length > 0,
      then: yup
        .string()
        .oneOf([yup.ref("password")], "Both passwords need to be the same")
        .required()
  }
});

function yupValidate(value: FormValue) {
  try {
    schema.validateSync(value, { abortEarly: false });
    // if all goes well return empty error object
    return {};
  } catch (errors) {
    // otherwise catch and extract errors
    const { inner } = errors;
    return inner.reduce((ret, x) => set(ret, x.path, x.message), {});
  }
};

const initialValue: FormValue = {
  email: '',
  password: '',
  confimPassword: ''
}

function SignupForm(props: {}) {
  function handleSubmit(value: FormValue) {
    console.log(value)
  }

  return (
    <Form<FormValue> 
      initialValue={initialValue} 
      onSubmit={handleSubmit}
      branchValues={({ formValue }) => ({ error: validate(formValue) })}
    >
      {(yafl) => (
        <form onSubmit={yafl.submit}>
          <TextInput<string> name="email" />
          <TextInput<string> name="password" type="password" />
          <TextInput<string> name="confirmPassword" type="password" />
          <button type="submit">Sign up!<button>
        </form>
      )}
    </Form>
  )
}
```

</TabItem>
</Tabs>

There is a lot to unpack here so lets go through it bit by bit. Firstly, notice that there is no `validate` function on the `TextInput` anymore. All validation is now done using Yup. We are effectively opting out of Yafl's internal implementation for form validation and we've replaced it entirely with something else. 

Next, notice that there is a new Form prop in play and is curiously named `branchValues`. `branchValues` represents one of two possible mechanisms with which Yafl can distribute or "deliver" values to your fields. You can read more about the `branchValues` prop and its corresponding hook, `useDelivery` [here](./usedelivery) and [here](./form#branchvalues). But in a nutshell, `branchValues` will intelligently split an object's values and distribute them to the fields with the paths that match the locations of the values of the object supplied.

The rest is really just implementation detail - the new `validate()` function is simply there to run our `formValue` through Yup and then transform these errors into a format that enables delivery to your fields.

But this is only half the story, next let's see how we would have to adapt our `TextInput` to receive and correctly work with these errors.

### useDelivery to grab errors

<Tabs
  defaultValue="js"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'TypeScript', value: 'ts'},
  ]}>
 <TabItem value="js">

```js title="/src/TextInput.js"
import { useField, useDelivery } from 'yafl'

function TextInput(props) {
  const { name, label, type = 'text' } = props
  const [input, meta] = useField(name);
  const [{ error }] = useDelivery(name)

  const { touched, submitCount } = meta;
  const showError = !!error && (touched || submitCount > 0);

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input name={name} type={type} {...input} />
      {showError && <div>{errors[0]}</div>}
    </>
  );
}

export default TextInput
```

</TabItem>
<TabItem value="ts">

```ts title="/src/TextInput.ts"
import { useField, useDelivery } from 'yafl'

interface TextInputProps<T, F extends object> {
  name: string;
  label: string;
  type?: string;
}

function TextInput<T, F extends object = {}>(props: TextInputProps<T, F>) {
  const { name, label, type = 'text' } = props
  const [input, meta] = useField<T, F>(name);
  const [{ error }] = useDelivery<{ error: string }>(name)

  const { touched, submitCount } = meta;
  const showError = !!error && (touched || submitCount > 0);

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input name={name} type={type} {...input} />
      {showError && <div>{errors[0]}</div>}
    </>
  );
}

export default TextInput
```

</TabItem>
</Tabs>

The most noteworthy change here is the addition of the `useDelivery` hook to grab the error for this field. Note that this value is simply a `string` and not a `string[]`. Again, this is an implementation detail and it's up to you whether you feel it's necessary to supply an array errors or a single error message to your fields.

> **Note:**
> `meta.errors` will simply contain be an empty array since you will have opted out of Yafl's error handling implementation.


## Async validation

And then there is the elephant in the room: async validation. Let's say the requirement came in to enable asynchronously checking if a username or email address was available before the user attempted to submit the form. This would require calling some backend api to check if the email is availabile.

So how does yafl handle this async validation? As with form-level validation, Yafl does not support async validation out of the box, but provides two mechanisms that effectively enable it. 

The first option is to use the same `useDelivery` mechanism as with the above with Yup example above. 

> **Note:** 
> Remember that you can supply multiple values to `branchValues` that will then be delivered to your fields so you can use Yup and still supply any number of other arbitrary values to `branchValues`

The second and preferred way to "enable" async validation is by rendering a `<FormError />` with a string `path` to the field that the error belongs to along with a `msg` representing the error as soon as we get a response from the server. This error `msg` will be concatenated onto that field's `errors` array. 

### Using a `<FormError />`

Since we've already covered `branchProps` and `useDelivery` as a method of value distribution let's look how to accomplish async validation by rendering a `<FormError />`:


<Tabs
  defaultValue="js"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'TypeScript', value: 'ts'},
  ]}>
 <TabItem value="js">

```js title="/src/SignupForm.js"
import React, { useState } from 'react'
import { Form, FormError } from 'yafl'
import TextInput from './TextInput'

const initialValue = {
  email: '',
  password: '',
  confimPassword: ''
}

function SignupForm(props) {
  const { checkEmailAvailability } = props

  const [emailAvailable, setEmailAvailability] = useState(true)

  function handleSubmit(value) {
    console.log(value)
  }

  async function checkEmail(email) {
    const isAvailable = await checkEmailAvailability(email)
    setEmailAvailability(isAvailable)
  }

  function onFormValueChange(prev, next) {
    if(next.email && prev.email !== next.email) {
      checkEmail(next.email)
    }
  }

  return (
    <Form
      initialValue={initialValue}
      onSubmit={handleSubmit}
      onFormValueChange={onFormValueChange}
    >
      {(yafl) => (
        <form onSubmit={yafl.submit}>
          <TextInput name="email" />
          <TextInput name="password" type="password" />
          <TextInput name="confirmPassword" type="password" />
          {emailAvailable && <FormError path="email" msg="Email already in use!">}
          <button type="submit">Sign up!<button>
        </form>
      )}
    </Form>
  )
}
```

</TabItem>
<TabItem value="ts">

```ts title="/src/SignupForm.ts"
import React, { useState } from 'react'
import { Form, FormError } from 'yafl'
import TextInput from './TextInput'

interface FormValue {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  checkEmailAvailability: (email: string) => Promise<boolean>
}

const initialValue: FormValue = {
  email: '',
  password: '',
  confimPassword: ''
}

function SignupForm(props: SignupFormProps) {
  const { checkEmailAvailability } = props

  const [emailAvailable, setEmailAvailability] = useState(true)

  function handleSubmit(value: FormValue) {
    console.log(value)
  }

  async function checkEmail(email: string) {
    const isAvailable = await checkEmailAvailability(email)
    setEmailAvailability(isAvailable)
  }

  function onFormValueChange(prev: FormValue, next: FormValue) {
    if(next.email && prev.email !== next.email) {
      checkEmail(next.email)
    }
  }
  return (
    <Form<FormValue> 
      initialValue={initialValue} 
      onSubmit={handleSubmit}
      onFormValueChange={onFormValueChange}
    >
      {(yafl) => (
        <form onSubmit={yafl.submit}>
          <TextInput<string> name="email" />
          <TextInput<string> name="password" type="password" />
          <TextInput<string> name="confirmPassword" type="password" />
          {emailAvailable && <FormError path="email" msg="Email already in use!">}
          <button type="submit">Sign up!<button>
        </form>
      )}
    </Form>
  )
}
```

</TabItem>
</Tabs>

Once a `<FormError />` mounts the `msg` representing the form error will be concatenated onto `meta.errors`. When the `<FormError />` unmounts, it will be removed. Note that the following code would be equivalent:

```js
 <FormError path="email" msg={emailAvailable ? undefined : "Email already in use!"}>
```

## Validation FAQ

### Can I manually trigger validation?

Nope. Yafl does not allow you to manually trigger validation this is because error states are derived from form values automatically. While Yafl does technically store error state, you should not let this is implementation detail detract from the fact that form errors are a textbook example of derived state. Yafl gives you full control over when to show errors to your users.

### What about submission phases?

There is no such thing in Yafl. Validation is happening all the time - or at least any time a values changes. Yafl also does not rely on any magic to make validation work - like touching all fields on submission. This means there is on need to keep track of `isValidating` or to do `setSubmitting(false)`. 

Since you, the developer, are best positioned to know when the form is validating (in the case of asynchronous validation) and when the from is submitting and it is Yafl's opinion that this behaviour is implemented in Userland.