import * as React from 'react'

interface BoundaryConfig {
  renderError: (error: Error) => React.ReactNode
}

interface BoundaryState {
  error: Error | null
}

class ErrorBoundary extends React.Component<BoundaryConfig, BoundaryState> {
  constructor(props: BoundaryConfig) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  render() {
    const { error } = this.state
    const { renderError, children } = this.props
    if (error === null) {
      return children
    }

    return renderError(error)
  }
}

export default ErrorBoundary
