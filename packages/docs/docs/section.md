---
id: section
title: <Section />
sidebar_label: <Section />
---

Section components give your forms depth. The `name` prop of a `<Section />` will become the key of an object value in your Form. If a `<Field />` appears anywhere in a Section's children it will be a property of that Section. So, for example, the following piece of JSX

## Props

### `name: Name`

Like a Field, a Section also requires a name prop! Corresponds to the name of the object this Section will create on the `formValue`.

### `fallback?: T`

> **Why you might need this: `fallback`**
>
> A `fallback` is useful if the value for the Section is ever null or undefined. A fallback becomes especially handy if a Section or Field component is rendered within a `<Repeat />`. Since it doesn't often make much sense to assign anything other than an empty array[] as the default value for a list of things, we can specify a `fallback` to prevent warnings about uncontrolled inputs becoming controlled inputs for any Fields rendered inside the Repeat.

### `children: React.ReactNode`

This usually would not warrant an explanation, but it is important to note if any of the children of a Section (that occur anywhere in the hierarchy) that are of type Section, Field or Repeat will be correctly assigned a corresponding value on the object that this Section will produce.

## Section Helpers

| Prop | Description |
| - | - |
| `setValue: (value: T) => void` | Sets the value of this Section. |


## Example

```jsx
// Leaving out some required props for the sake of brevity
<Form>
  <Field name="fullName" />
  <Section name="contact">
    <Field name="tel" />
    <Section name="address" fallback={{ streetNo: '', streetName: '', city: ''  }}>
      <Field name="streetNo" />
      <Field name="streetName" />
      <Field name="city" />
    </Section>
  </Section>
</Form>

```
will produce a `formValue` object that looks like

```js
  {
    fullName: "",
    contact: {
      tel: "",
      address: {
        streetNo: "",
        streetName: "",
        city: ""
      }
    }
  }
```

Cool, huh!