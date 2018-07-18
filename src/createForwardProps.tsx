import * as React from 'react'
import * as PropTypes from 'prop-types'
import { FormProvider, FormConfig, PropForwarderConfig } from './sharedTypes'
import { isObject } from './utils'
import invariant from 'invariant'

export default function<F extends object>(
  Provider: React.Provider<FormProvider<F, F>>,
  Consumer: React.Consumer<FormProvider<F, F>>
) {
  return class ForwardProps extends React.Component<PropForwarderConfig<F>> {
    static propTypes = {
      mode: PropTypes.oneOf(['default', 'branch']),
      children: PropTypes.node
    }
    static defaultProps = {
      mode: 'default'
    }
    constructor(props: FormConfig<F>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(ip: FormProvider<F, F>) {
      const value = { ...ip }
      const { children, mode, ...rest } = this.props
      if (mode === 'branch') {
        invariant(
          Object.keys(rest).every(key => isObject(rest[key])),
          'When using mode="branch" on the <ForwardProps /> component, all additional props must be of type object'
        )
        value.branchProps = { ...value.branchProps, ...rest }
      } else {
        value.sharedProps = { ...value.sharedProps, ...rest }
      }
      return <Provider value={value}>{children}</Provider>
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}
