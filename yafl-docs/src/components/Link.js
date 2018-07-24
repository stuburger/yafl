import React from 'react'
import styled from 'styled-components'
import { Link as GatsbyLink } from 'gatsby'

import rem from '../utils/rem'
import { violetRed, lightGrey } from '../utils/colors'

export const StyledLink = styled(GatsbyLink)`
  display: inline-block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  padding: ${rem(2)} ${rem(8)};
  margin: ${rem(-2)} ${rem(-8)};

  @media (min-width: ${1000 / 16}em) {
    border-radius: ${rem(3)};

    &:hover {
      background: ${lightGrey};
    }
  }
`

export const InlineLink = styled(GatsbyLink).attrs({
  target: '_blank',
  rel: 'noopener',
})`
  color: ${p => (p['data-white'] ? 'white' : violetRed)};
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
`

const Link = ({ children, to, className, inline, unstyled, ariaLabel }) => {
  let Child = StyledLink
  if (inline) {
    Child = InlineLink
  } else if (unstyled) {
    Child = GatsbyLink
  }
  return (
    <Child to={to} className={className} aria-label={ariaLabel}>
      {children}
    </Child>
  )
}

export default Link
