---
id: createFormContext
title: Using createFormContext()
sidebar_label: Using createFormContext()
---

Yafl also exports a function called `createFormContext` which returns the usual components you need to build your forms:

```tsx
const { 
  Form,
  Field,
  Section,
  Repeat,
  FormError,
  useCommonValues,
  useBranchValues,
  useFormContext
 } = createFormContext<T>()
```

## `createFormContext()` use cases

There are two reasons you might want to use `createFormContext()`:

1. **You are using TypeScript:** When using TypeScript you may specify a type to the generic function which will give all the components returned from this function awareness of the type `T` that you supply. This will help ensure type safety across components at the cost of a few extra key strokes.
2. **You are creating nested forms:** Creating nested forms where nesting context providers would interfere with one another and cause some strange behavior. Nested forms are a fairly rare use case however.

### Type safety

Yafl is built in TypeScript and type safety is a primary concern of ours. However using generics inline with JSX can be cumbersome and noisy. One way to get around this is to supply the generic type argument for your form earlier on so that all your components magically become type aware. This means that all your form components and hooks (i.e. `<Form>`, `<Field>`, `useField()`) will be aware of the generic type `T` you supplied when you called `createFormContext()`. Let's see an example:

```ts title="src/TypedForm.tsx"

interface Profile {
  email: string;
  fullname: string;
}

const { Form, useField } = createFormContext<Profile>()

<Form onSubmit={(formValue) => { /* formValue will be of type Profile */ }}>
  ...
</Form>

const [input, meta] = useField<string>()

input.value // is of type string
meta.formValue // is of type Profile
meta.setFormValue({ badValue: true }) // reports a type error
```

This also means TypeScript will not allow you to call `setFormValue()` with anything that does not conform to the `Profile` interface.

### Nested forms

The second use case for `createFormContext()` is to enable the creation of nested forms where you have a `<Form>` nested within another `<Form>`. Due to the way the React context implementation ensures that a context `<Consumer>` will always talk to its [closest](https://reactjs.org/docs/context.html#contextconsumer) `<Provider>` which can make for some weird interactions between components if you're trying to nest forms.  The best thing to do if you have this requirement is to create a new form context by using `createFormContext()`. This will ensure both of your `Forms` use different `Providers` and Yafl consumers (`<Field>`, `<Section>`, `useField`, etc) only speak to their relevant `<Form>` provider.

## Limitations of createFormContext()

Unfortunately `createFormContext<T>()` will not tell you when you are incorrectly nesting `Sections`, `Fields` and `Repeats` - there simply is no way to do that in TypeScript. Similarly Yafl does not tell you when you've supplied an incorrect `name` prop to one of these components either.

## Gotchas

* Never call `createFormContext` in render - as with `React.createContext` always call `createFormContext` at the module level.
* `createFormContext` while similarly named to `React.createContext` does not accept an optional default value as an argument.
* We've noticed that the `useField` hook can become awkward to use in conjunction with `createFormContext` because of the way the `useField` hook it is used within custom input components. The best way to get around this is to use a higher order function to spit out a version of your component with the concrete type baked in:

```tsx
function createFromComponents<F>() {
  const { useField, ...api } = createFormContext<F>()

  function TextInput<T>(props: T) {
    const [input, meta] = useField<T>()

    ...

    return <input {...input} >
  }

  return {
    ...api,
    useField,
    TextInput,
  }
}

```