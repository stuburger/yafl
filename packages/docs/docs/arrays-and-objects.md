---
id: arrays-and-objects
title: Arrays and nested objects
sidebar_label: Arrays and nested objects
---

Working with complex data structures in Yafl is made easy by using the `<Section />` and `<Repeat />` components which are used to create nested object and array structures, respectively. The `<Repeat />` component is similar to what is often called a `<FieldArray />` in other form libraries but with one key difference which we'll see in a bit. There is no analogous component for `<Section />`, however!

## A note on `"string.paths"`

At this point it would be good to point out something that Yafl does differently - it does not require you to you use string paths to create complex objects and arrays in your form. You've probably seen the following syntax before: 
```js
<Field name={`profile.contact.addresses[${i}].code`} />
``` 
This syntax is being used to create depth in a from. But this is error prone, difficult to refactor and a hard to read. Imagine if you have to change the "shape" of your form so that the `addresses` array is no longer on the `contact` object, but rather it is "moved up" to be a property of the `profile` object. We would have to modify all the field names by removing `".contact"`. That's okay, but we can do better! Yafl leverages React context build up these string paths for you. That said, you do not have to use these components at all, Yafl still supports using string paths if you prefer to use them or a combination of both. 

Let's start by explaining the `<Repeat />` component as it is likely to be the most familiar to many of you. 

## The `<Repeat />` component

Use the Repeat component when you require arrays or lists in your forms. 

### Example

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


<Tabs
  defaultValue="js"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'TypeScript', value: 'ts'},
  ]}>
 <TabItem value="js">

```js title="/src/HobbyForm.js"
import React from 'react'
import { Form, Repeat } from 'yafl'
import TextInput from './TextInput'

const initialValue = {
  hobbies: []
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
          <Repeat name="hobbies">
            {(hobbies, { push }) => (
              <>
                {hobbies.map((hobby, i) => <TextInput key={i} name={i} />)}
                <button 
                  type="button" 
                  onClick={() => push('')}
                >
                  Add hobby
                </button>
              </>
            )}
          </Repeat>
          <button type="submit">Submit!<button>
        </form>
      )}
    </Form>
  )
}
```

</TabItem>
<TabItem value="ts">

```ts title="/src/HobbyForm.tsx"
import React from 'react'
import { Form, Repeat } from 'yafl'
import TextInput from './TextInput'

interface FormValue {
  hobbies: string[]
}

const initialValue: FormValue = {
  hobbies: []
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
          <Repeat<string> name="hobbies">
            {(hobbies, { push }) => (
              <>
                {hobbies.map((hobby, i) => <TextInput<string> key={i} name={i} />)}
                <button 
                  type="button" 
                  onClick={() => push('')}
                >
                  Add hobby
                </button>
              </>
            )}
          </Repeat>
          <button type="submit">Submit!<button>
        </form>
      )}
    </Form>
  )
}
```

</TabItem>
</Tabs>

Nothing new here. We have a simple hobby form where users can continuously push hobbies (as simple string values) onto an array. If you've used FieldArrays before then this is exactly what you're used to! Notice the destructuring of `push` in the render prop. This utility object also contains other important array helper methods such as `pop`, `shift`, `insert`, `swap` and `remove`. Read more about these helper functions in the documentation for [`<Repeat />`](./repeat)


Next let's take a look the `<Section />` component!

## The `<Section />` component

The `<Section />` component is similar to a `<Repeat />` but is used to represent objects - not arrays. Sections and Repeats can be used together to create very complex object structures.


### Example

<Tabs
  defaultValue="js"
  values={[
    {label: 'JavaScript', value: 'js'},
    {label: 'TypeScript', value: 'ts'},
  ]}>
 <TabItem value="js">

```js title="/src/AddressForm.js"
import React from 'react'
import { Form, Repeat, Section } from 'yafl'
import TextInput from './TextInput'

const initialValue = {
  contact: {
    // initialize with one empty address
    addresses: [{
      line1: '',
      country: '',
      postalCode: ''
    }]
  }
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
      <Section name="contact">
        <Repeat name="addresses">
          {(addresses) => {
            return addresses.map((address, i) => (
              <Section key={i} name={i}>
                <TextInput name="line1" />
                <TextInput name="country" />
                <TextInput name="postalCode" />
              <Section>
            ))
          }}
        </Repeat>
      </Section>
    </Form>
  )
}
```

</TabItem>
<TabItem value="ts">

```ts title="/src/AddressForm.tsx"
import React from 'react'
import { Form, Repeat, Section } from 'yafl'
import TextInput from './TextInput'

interface Address {
  line1: string;
  country: string;
  postalCode: string;
}

interface Contact {
  addresses: Address[];
}

interface FormValue {
  contact: Contact;
}

const initialValue: FormValue = {
  contact: {
    // initialize with one empty address
    addresses: [{
      line1: '',
      country: '',
      postalCode: ''
    }]
  }
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
      <Section<Contact> name="contact">
        <Repeat<Address> name="addresses">
          {(addresses) => {
            return addresses.map((address, i) => (
              <Section key={i} name={i}>
                <TextInput name="line1" />
                <TextInput name="country" />
                <TextInput name="postalCode" />
              <Section>
            ))
          }}
        </Repeat>
      </Section>
    </Form>
  )
}
```

</TabItem>
</Tabs>

