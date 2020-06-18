---
id: use-common-values
title: useCommonValues()
sidebar_label: useCommonValues()
---

Returns all values supplied to a `<Form>` through the `commonValues` prop. Works as a regular React context `<Provider>`. 

## TypeScript

`type UseCommonValues = <T = any>() => T`

## Example

```js title="/src/MyForm.js"
function CommonValuesForm(props) {
  return (
    <Form commonValues={{ sharedProp: true }}>
      <TextInput name="fullname" />
    </Form>
  )
}

function TextInput({ name }) {
  const commonValues = useCommonValues()
  console.log(commonValues.sharedProp) // true

  return (
    ...
  )
}
```