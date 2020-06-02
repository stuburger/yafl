/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import isEqual from 'react-fast-compare'
import classnames from 'classnames'

export default class FormatJson extends Component {
  constructor(props) {
    super(props)
    this.state = { showChangeEffect: false }
  }

  componentDidMount() {
    this.timeout = null
  }

  shouldComponentUpdate(np, ns) {
    const { value } = this.props
    const { showChangeEffect } = this.state
    return ns.showChangeEffect !== showChangeEffect || !isEqual(value, np.value)
  }

  componentDidUpdate(prev) {
    const { value } = this.props

    if (!isEqual(value, prev.value)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => {
        return { showChangeEffect: true }
      })
      this.timeout = setTimeout(() => {
        if (this.isUnmounting) return
        this.setState(() => {
          return { showChangeEffect: false }
        })
      }, 500)
    }
  }

  componentWillUnmount() {
    this.isUnmounting = true
    clearTimeout(this.timeout)
  }

  render() {
    const { value, spacing = 2 } = this.props
    const { showChangeEffect } = this.state
    return (
      <pre
        className={classnames('json-formatted', {
          'change-fade': !showChangeEffect,
        })}
      >
        {JSON.stringify(value, null, spacing)}
      </pre>
    )
  }
}
