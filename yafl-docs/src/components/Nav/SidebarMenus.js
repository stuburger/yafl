import React, { Component } from 'react'
import styled from 'styled-components'
import rem from '../../utils/rem'
import titleToDash from '../../utils/titleToDash'
import { pages } from '../../pages/docs.json'
import Link, { StyledLink } from '../Link'

const MenuInner = styled.div`
  display: block;
  box-sizing: border-box;
  height: 100%;
  padding-top: ${rem(25)};
`

const TopLevelLink = styled.div`
  display: block;
  margin: ${rem(10)} ${rem(40)};
`

const Section = styled.div`
  margin-bottom: ${rem(20)};
`

const SectionTitle = styled.h4`
  display: block;
  margin: ${rem(10)} ${rem(40)};
  font-weight: normal;
`

const SubSection = styled.h5`
  display: block;
  margin: ${rem(10)} ${rem(40)} ${rem(10)} ${rem(55)};
  font-size: 0.9rem;
  font-weight: normal;
`

class Folder extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
  }

  static getDerivedStateFromProps(np, ps) {
    return ps.isOpen !== np.isOpenDefault ? { isOpen: np.isOpenDefault } : null
  }

  toggleSubSections = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { children, isOpenDefault, ...props } = this.props
    const { isOpen } = this.state

    return typeof children === 'function'
      ? children({
          rootProps: props,
          toggleSubSections: this.toggleSubSections,
          isOpen,
        })
      : null
  }
}

export const DocsSidebarMenu = ({ onRouteChange }) => (
  <MenuInner>
    {pages.map(({ title, pathname, sections }) => (
      <Folder
        key={title}
        isOpenDefault={
          typeof window !== 'undefined' &&
          window.location.pathname.startsWith(`/${pathname}`)
        }
      >
        {({ rootProps, toggleSubSections, isOpen }) => (
          <Section {...rootProps} onClick={onRouteChange}>
            <SectionTitle onClick={toggleSubSections}>
              <Link to={`/${pathname}`}>{title}</Link>
            </SectionTitle>
            {isOpen &&
              sections.map(({ title, pathname: sectionPathname }) => (
                <SubSection key={title}>
                  <StyledLink to={`/${pathname}/${sectionPathname}`}>
                    {title}
                  </StyledLink>
                </SubSection>
              ))}
          </Section>
        )}
      </Folder>
    ))}
  </MenuInner>
)

function getSectionPath(parentPathname, sectionPathname) {
  return `${parentPathname || ''}/${sectionPathname}`
}

function isFolderOpen(currentHref, { pathname, title, sections }) {
  return (
    sections.reduce(
      (sum, v) =>
        sum || window.location.to.endsWith(getSectionPath(pathname, v.pathname)),
      false
    ) || window.location.to.endsWith(pathname || '/' + titleToDash(title))
  )
}

export const SimpleSidebarMenu = ({ onRouteChange, pages = [] }) => (
  <MenuInner>
    {pages.map(({ title, pathname, sections, to }) => {
      if (!sections) {
        return (
          <TopLevelLink key={title}>
            <StyledLink to={pathname || '/' + (to || titleToDash(title))}>
              {title}
            </StyledLink>
          </TopLevelLink>
        )
      }

      return (
        <Folder
          key={title}
          isOpenDefault={
            typeof window !== 'undefined' &&
            isFolderOpen(window.location.to, { title, pathname, sections })
          }
        >
          {({ rootProps, toggleSubSections, isOpen }) => (
            <Section {...rootProps} onClick={onRouteChange}>
              <SectionTitle onClick={toggleSubSections}>
                <Link to={pathname || '/' + titleToDash(title)}>{title}</Link>
              </SectionTitle>

              {isOpen &&
                sections.map(({ title }) => (
                  <SubSection key={title}>
                    <StyledLink unstyled to={getSectionPath(pathname, title)}>
                      {title}
                    </StyledLink>
                  </SubSection>
                ))}
            </Section>
          )}
        </Folder>
      )
    })}
  </MenuInner>
)
