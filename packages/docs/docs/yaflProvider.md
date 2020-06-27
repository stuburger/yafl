---
id: yaflProvider
title: <YaflProvider /> 
sidebar_label: <YaflProvider />
---

The `<YalfProvider>` component is always used together with the `useForm()` hook (although the `useForm()` hook can still be used on its own if you don't want to use React context). You only need this if you want to use Yafl consumers. There is nothing crazy going on in here. `<YalfProvider>` is just a React context `Provider` that has been wrapped to accept some extra props in addition to the usual `value` prop. It is acts as the communication channel for the state and behavior contained in the `useForm()` hook and Yafl context consumers. Again, if you don't want or need these consumer components then you wont need to make use of this component.

## Props

### `value`
[**`value: YaflBaseContext<F>`**](./use-form#result)

Similar to any React context `<Provider>`. Should only ever accept the result of a call to `useForm()`. 

```js title="YaflProviderExample.js
import React from 'react'
import { useForm, YaflProvider } from 'yafl'

function YaflProviderExample () {
  const yafl = useForm({ /* config */ })

  /**
   * use Yafl functions as you like, but remember to always hand over this value to the
   * value prop of `<YaflProvider>, otherwise other Yafl components may not work as expected
   */

  return (
    <YaflProvider value={yafl}>
      <Field name="fullName" />
    </YaflProvider>
  )
}
```

> **Note:**
>
> If you forget to use a `<YaflProvider>` while using Yafl's consumer components you will get an error stating that a Consumer component can only appear inside a Yafl Provider.


### `commonValues`
**`commonValues?: ((state: { formValue: T }) => Record<string, any>) | Record<string, any>`**

Identical to `commonValues` supplied to the `<Form>` component. See [`here`](./form#commonvalues) for a full explanation.

### `branchValues`
**`branchValues?: ((state: { formValue: T }) => Record<string, any>) | Record<string, any>`**

Identical to `branchValues` supplied to the `<Form>` component. See [`here`](./form#branchvalues) for a full explanation.