import React from 'react'
import classnames from 'classnames'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactTooltip from 'react-tooltip'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'
import DemoForm from '../DemoForm'

function Home() {
  const [copied, setCopied] = React.useState(false)
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context

  function showCopiedMessage() {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>

          <div className={styles.buttons}>
            <Link
              className={classnames('button button--lg margin-right--md', styles.getStarted)}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
            <CopyToClipboard onCopy={showCopiedMessage} text="npm install yafl --save">
              <button
                data-for="npm-install"
                data-tip="Copied!"
                type="button"
                className={classnames('button button--secondary button--lg', styles.getStarted)}
              >
                <code>npm install yafl --save</code>
              </button>
            </CopyToClipboard>
            <ReactTooltip id="npm-install" getContent={() => (copied ? 'Nice! ✅' : 'Copy 📋')} />
          </div>
        </div>
      </header>
      <div className="container margin-top--md">
        <DemoForm />
      </div>
      {/* <main>
      </main> */}
    </Layout>
  )
}

export default Home
