import React, { Component } from 'react'
import { sidebarWidth, navbarHeight } from '../utils/sizes'
import styled from 'styled-components'
import rem from 'polished/lib/helpers/rem'
const prism = require('prismjs')

const Pre = styled.pre`
  transform: translateZ(0);
  left: auto;
	bottom: 0;
	margin: 0;
  top: ${rem(navbarHeight)};
  left: ${rem(sidebarWidth)};
  box-sizing: border-box;
  color: inherit;
  overflow-y: auto;
  transition: transform 150ms ease-out;
`

export default class CodeSnippet extends Component {
  render() {
    const { js } = this.props
    return (
      <Pre
        className="language-js"
        dangerouslySetInnerHTML={{
          __html: prism.highlight(js, prism.languages.javascript),
        }}
      />
    )
  }
}
