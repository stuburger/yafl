---
id: createFormContext
title: createFormContext()
sidebar_label: createFormContext()
---

Yafl also exports a function called `createFormContext` which returns the components you need to build your forms:

```tsx
const { 
  Form,
  Field,
  Section,
  Repeat,
  FormError,
  useDelivery,
  useFormContext
 } = createFormContext<T>()
```

The reason for this is 2 fold:

1. When using TypeScript you may sepecify a type to the generic function which will give all the Form components returned from this function awarenss of the type `T` that you supply. This will help ensure type safety across Form components at the cost of a few extra key strokes.
2. Creating nested forms where nesting context providers would interfere with one another and cause some strage behaviour. Nested forms are a fairly rare use case however.

