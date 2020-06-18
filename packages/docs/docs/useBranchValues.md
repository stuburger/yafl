---
id: use-branch-values
title: useBranchValues()
sidebar_label: useBranchValues()
---

Sends all values supplied to a `<Form>` through the [`branchValues`](./form#branchvalues) prop. Each object key is split at the intersection of every `<Section>`, `<Repeat>` and `<Field>`. This is useful for distributing values stored in external state that matches the shape of your form.

## TypeScript

`type UseBranchValues = <T = any>(name: string | number) => T`

## Options

### `name`

**`name: string | number`**

The name or path of the field to retrieve the `branchValues` for.


## Example

Given the following `<Form>`

```js
<Form
  commonValues={{ data }}
  branchValues={{ data }}
>
  ...
</Form>
```

This:

```js
const { error } = useBranchValues(name)
```
and this:
```js
const commonValues = useCommonValues(name)
const [, meta] = useField(name)
const error = get(commonValues.data, meta.path)
```

accomplish much the same thing.