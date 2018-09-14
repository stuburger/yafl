import React from 'react'
// import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import NextPage from '../../components/NextPage'
import md from 'react-markings'
import '../../components/custom.css'

const Repeat = () => md`
The Repeat component is conceptually similar to the Section component except that it can be used to create what other libraries call "FieldArrays". A \`<Repeat />\` uses a function as children and comes with a few handy helper methods.

## Configuration

### \`name: Name\`

The name of the array this Repeat creates.

### \`fallback?: T[]\`

Serves the same purpose as a Section's fallback prop. This is usually more useful when dealing with Repeats since it will allow you to call value.map() without worrying about the value being null or undefined

### \`children: ((value: T[], utils: ArrayHelpers<T>) => React.ReactNode)\`

The Repeat Component uses the function as a child pattern. The first argument is the value of this Repeat. The second argument is an object of array helper functions which provide some simple array manipulation functionality.

## Array Helpers

${(
  <table>
    <thead>
      <tr>
        <th>Prop</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{md`
\`push: (...items: T[]) => number\`
        `}</td>
        <td>
          Appends new elements to the array, and returns the new length of the
          array.
        </td>
      </tr>
      <tr>
        <td>{md`
\`pop: () => T \| undefined\`
        `}</td>
        <td>Removes the last element from the array and returns it.</td>
      </tr>
      <tr>
        <td>{md`
\`shift: () => T \| undefined\`
        `}</td>
        <td>Removes the first element from the array and returns it.</td>
      </tr>
      <tr>
        <td>{md`
\`unshift: (...items: T[]) => number\`
        `}</td>
        <td>
          Inserts new elements at the start of the array and returns the new
          length of the array.
        </td>
      </tr>
      <tr>
        <td>{md`
\`insert: (index: number, ...items: T[]) => number\`
        `}</td>
        <td>
          Inserts new elements into the array at the specified index and returns
          the new length of the array.
        </td>
      </tr>
      <tr>
        <td>{md`
\`swap: (index1: number, index2: number) => void\`
        `}</td>
        <td>Swaps two elements at the specified indices.</td>
      </tr>
      <tr>
        <td>{md`
\`remove: (index: number) => T \| undefined\`
        `}</td>
        <td>Removes an element from the array at the specified index.</td>
      </tr>
      <tr>
        <td>{md`
\`setValue: (value: T[]) => void\`
        `}</td>
        <td>Sets the value of the array.</td>
      </tr>
    </tbody>
  </table>
)}

`

export default () => (
  <DocsLayout
    title="The <Repeat /> Component"
    description="The Repeat Component"
  >
    <Repeat />
    <NextPage to="/api/connect" title="The ForwardProps Component" />
  </DocsLayout>
)
