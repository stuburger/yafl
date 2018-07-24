import React from 'react'
import styled from 'styled-components'
import DocsLayout from '../../components/DocsLayout'
import md from 'react-markings'
import rem from '../../utils/rem'

const Motivation = () => md`
## Motivation

Development on Yafl only started after the release of React 16.3 and uses the React Context API
behind the scenes to pass props between components. It has drawn a lot of inspiration from Redux-Form and Formik (both awesome projects!)
I didn't build Yafl because I saw the need for yet another form library. Instead, Yafl started out as an idea that has evolved throughout
development. It has gone through many iterations (I dare you to go through the commit history) and on a number of occations
I almost had to start from the _beginning_ when I realized that the current code structure didn't accommodate a specific use case.
Validation in particular was handled in multiple wildly different ways before I stumbled on - for better or worse - the idea of _rendering an
error_. So there you have it, the motivation for the existence of this library was pretty much of the "eh, why not" variety as opposed to the
often touted "I saw a need for it" variety. That said however, I've found Yafl extremely fun and flexible to use even more so, I dare say,
than the alternatives.
`

const Philosophy = () => md`
## Philosophy

Yafl's philosophy is to "keep it super simple". While it provides a lot of functionality out of the box, it aims to keep it's API surface
area as small as possible while still remaining flexible and easy to use. At the start of Yafl's development, the decision was made to leave
as much of the implementation of your form up to you, the developer. Yafl aims to provide the tools to build forms without caring too much about
the specific use case.
`

const WhyUseYafl = () => md`
## Why use YAFL?

- Use TypeScript with JSX generics to create strongly typed forms that give you peace of mind and a good nights sleep. 😴
- Create multi-page forms without needing to use specialized components or a state management library like flux or redux. 😮
- Structure your components to match the shape of your data. This means no more accessing field values using string paths! 🤯
- Deeply nested forms and forms within forms! 🎁
- Render a Validator! 😱
- Opt out of using Yafl's internal implementation by keeping track of your own form state and only use Yafl's context as a means to intelligently distribute state to your Fields! 🚀
- Easily use third pary validation libraries like Yup - it just works!
- Flexible. 💪
- Fun. 😻
`

export default () => (
  <DocsLayout title="Introduction" description="Yafl - an introduction">
		<Motivation />
		<br />
    <Philosophy />
		<br />
    <WhyUseYafl />
  </DocsLayout>
)
