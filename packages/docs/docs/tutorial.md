---
id: tutorial
title: Tutorial
sidebar_label: Tutorial
---

## Building a signup form using Yafl

Imagine you're building a website where users can sign up with a username and password. Usually this is done using a form. This tutorial will walk you through the process of creating a signup form for a fictional web application. This form will contain a username field, password field and confirm password field. In part 2 of this tutorial we will at the different way we can implement validation for our signup form.


## Setup

Before we get started make sure you've installed Yafl in your project.

Now that you've added Yafl to your project's dependencies [using npm or yarn](./overview#installation) we're ready to start creating our signup form. To make this tutorial easy to follow we've created some simple scaffolding to help get you started. If you're using TypeScript click here. If you're using JavaScript you can follow along here.

You'll find the following components:

* `SignupForm.ts|js`
* `TextInput.ts|js`

First let's look at the `SignupForm` component. This is the component where we'll be building our form.


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="js"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'TypeScript', value: 'ts'},
  ]}>
 <TabItem value="js">

```js title="/src/SignupForm.js"
import { Form } from 'yafl'
import TextInput from './TextInput'

const initialValue = {
  email: '',
  password: '',
  confirmPassword: ''
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

```ts title="/src/SignupForm.tsx"
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
  confirmPassword: ''
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
      {(yafl) => {
        return (
          <form onSubmit={yafl.submit}>
            <TextInput<string> name="email" />
            <TextInput<string> name="password" type="password" />
            <TextInput<string> name="confirmPassword" type="password" />
            <button type="submit">Sign up!<button>
          </form>
        )
      }}
    </Form>
}
```

</TabItem>
</Tabs>


### Explanation

First let's talk about the `<Form>` component. In a way this is the most important component exported by Yafl as it contains all of your form's state as well as the behaviors that make Yafl work. It remembers things like which fields you've `visited` and `touched`, the `errors` produced when validating your form and it knows how to set these values when reacting to user input.

The `<Form>` component renders is children as a function which accepts a parameter (`yafl`) containing helper functions such as `resetForm()` and form state such as `formIsDirty`, etc. Read more about the `FormProps` that are available [here](./form#form-props).

The second component that we're importing is a custom component called `TextInput` and it represents a text field on our form that can be used to capture user input.


### Wiring up TextInput

If you're following along you'll notice that the text inputs in our sign up form do not work. In order to get them working we'll need to tell Yafl about these fields. We do this using the `useField` hook.

<Tabs
  defaultValue="js"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'TypeScript', value: 'ts'},
  ]}>
 <TabItem value="js">

```js title="/src/TextInput.js"
import React from 'react'
import { useField } from 'yafl'

function TextInput(props) {
  const { name, label, type } = props
  const [input] = useField(name);

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input 
        name={name}
        type={type}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        onChange={input.onChange}
        // Or simply spread {...input}
      />
    </>
  );
}

export default TextInput

```

</TabItem>
<TabItem value="ts">

```ts title="/src/TextInput.tsx"
import React from 'react'
import { useField } from 'yafl'

interface TextInputProps {
  name: string;
  label: string;
  type?: string;
}

function TextInput<T, F extends object = {}>(props: TextInputProps) {
  const { name, label, type = 'text' } = props
  const [input] = useField<T, F>(name);

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        type={type}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        onChange={input.onChange}
        // Or simply spread {...input}
      />
    </>
  );
}

export default TextInput
```

</TabItem>
</Tabs>

So what's going on here? Notice is that we're importing and using Yafl's `useField` hook. This hook returns a tuple that can be destructured to pull out a fields "input" props (the first value) that can be spread over your inputs. The second value contains form state and utility functions that are made available for convenience. You can read more about the `useField` hook [here](./usefield) 