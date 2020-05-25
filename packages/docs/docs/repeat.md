---
id: repeat
title: <Repeat />
sidebar_label: <Repeat />
---

The Repeat component is conceptually similar to the Section component except that it can be used to create what other libraries call "FieldArrays". A `<Repeat />` uses a function as children and comes with a few handy helper methods.

## Props

### `name: string`

The name of the array this Repeat creates.

### `fallback?: T[]`

Serves the same purpose as a Section's fallback prop. This is usually more useful when dealing with Repeats since it will allow you to call value.map() without worrying about the value being null or undefined.

### `children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)`

The Repeat Component uses the function as a child pattern. The first argument is the value of this Repeat. The second argument is an object of array helper functions which provide some simple array manipulation functionality.

## Array Helpers

| Prop | Description |
| - | - |
| `push: (...items: T[]) => number` | Appends new elements to the array, and returns the new length of the array. |
| `pop: () => T \| undefined` | Removes the last element from the array and returns it. |
| `shift: () => T \| undefined` | Removes the first element from the array and returns it. |
| `unshift: (...items: T[]) => number` | Inserts new elements at the start of the array and returns the new length of the array. |
| `insert: (index: number, ...items: T[]) => number` | Inserts new elements into the array at the specified index and returns the new length of the array. |
| `swap: (index1: number, index2: number) => void` | Swaps two elements at the specified indices. |
| `remove: (index: number) => T \| undefined` | Removes an element from the array at the specified index. |
| `setValue: (value: T[]) => void` | Sets the value of the array. |


## Example

```tsx

interface Movie {
  title: string
  releaseDate: Date | null
  rating: number
}

<Form>
  <Repeat<Movie> name="movies" fallback={[]}>
    {(arr, { push, remove, insert }) => {
      return (
        <>
          {arr.map((item, i) => (
            <Section<Movie> name={i}>
              <Field<string> name="title" />
              <Field<string> name="releaseDate" />
              <Field<number> name="rating" />
              <button onClick={() => remove(i)}>Remove</button>
            </Section>
          ))}
          <button onClick={() => push({ title: "", releaseDate: null, rating: 5 })}>Add</button>
        </>
      )
    }}
  </Repeat>
</Form>
```

Will produce...

```js
  {
    movies: [
      {
        title: "",
        releaseDate: null,
        rating: 5
      },
      ...
    ]
  }
```